import React, { useState, useEffect } from 'react';
import useAuthCheck from '../../components/verify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faEnvelope, faPhone, faCalendarAlt, faMapMarkerAlt, faEdit, faHeart, faBox,
    faSignOutAlt, faCog, faShieldAlt, faGlobe, faSpinner, faHome, faCity, faMap, faCheckCircle, faCamera, faLock, faBell
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import { cropImage } from "./cropUtils"; 
import { BASE_URL } from '../../config';

const ProfilePage = () => {
    const isLogged = useAuthCheck(); 
    const navigate = useNavigate();
    const { tab } = useParams(); 
    
    const [activeTab, setActiveTab] = useState(tab || '');
    const [isEditing, setIsEditing] = useState(false);
    const [userLoged, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingCep, setLoadingCep] = useState(false);
    
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    const [tempImage, setTempImage] = useState([]);
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    useEffect(() => {
        setActiveTab(tab || '');
    }, [tab]);

    const maskPhone = (value) => {
        return value.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2").substring(0, 15);
    };

    const maskDate = (value) => {
        return value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2").substring(0, 10);
    };

    const handleCepSearch = async (cepValue) => {
        const cleanCep = cepValue.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            setLoadingCep(true);
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setUser(prev => ({
                        ...prev,
                        profile: { 
                            ...prev.profile, 
                            street: data.logradouro, 
                            city: data.localidade, 
                            state: data.uf 
                        }
                    }));
                }
            } catch (err) { console.error("CEP error", err); }
            finally { setLoadingCep(false); }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'phone') newValue = maskPhone(value);
        if (name === 'birthdate') newValue = maskDate(value);
        if (name === 'cep') newValue = value.replace(/\D/g, "").substring(0, 8);

        if (['phone', 'cep', 'street', 'number', 'birthdate'].includes(name)) {
            setUser(prev => ({
                ...prev,
                profile: { ...prev.profile, [name]: newValue }
            }));
            if (name === 'cep' && newValue.length === 8) handleCepSearch(newValue);
        } else {
            setUser(prev => ({ ...prev, [name]: newValue }));
        }
    };

    const handleImageUpload = (imageList) => {
        setTempImage(imageList);
        if (imageList.length > 0) setCropDialogOpen(true);
    };

    const onCropSave = async () => {
        try {
            const base64Image = await cropImage(tempImage[0].dataURL, croppedAreaPixels);
            setUser(prev => ({
                ...prev,
                profile: { ...prev.profile, avatar: base64Image }
            }));
            setCropDialogOpen(false);
            setTempImage([]);
        } catch (e) { console.error(e); }
    };

    const handleSave = async () => {
        setIsEditing(false);
        setLoading(true);
        const token = localStorage.getItem("access");
        if (!token) { navigate("/login"); return; }

        const rawPhone = userLoged.profile?.phone || "";
        const cleanPhone = rawPhone.replace(/\D/g, "");

        let backendDate = null;
        const rawDate = userLoged.profile?.birthdate || "";
        if (rawDate && rawDate.length === 10 && rawDate.includes('/')) {
            const [day, month, year] = rawDate.split('/');
            backendDate = `${year}-${month}-${day}`;
        } else { backendDate = rawDate; }

        try {
            const res = await fetch(`${BASE_URL}/api/users/me/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    first_name: userLoged.first_name,
                    last_name: userLoged.last_name,
                    email: userLoged.email,
                    profile: {
                        phone: cleanPhone,
                        birthdate: backendDate,
                        cep: userLoged.profile?.cep,
                        street: userLoged.profile?.street,
                        number: userLoged.profile?.number,
                        city: userLoged.profile?.city,
                        state: userLoged.profile?.state,
                        avatar: userLoged.profile?.avatar
                    }
                }),
            });

            if (!res.ok) throw new Error("Failed");
            const updatedUser = await res.json();
            
            if (updatedUser.profile?.birthdate) {
                const [y, m, d] = updatedUser.profile.birthdate.split('-');
                updatedUser.profile.birthdate = `${d}/${m}/${y}`;
            }
            if (updatedUser.profile?.phone) updatedUser.profile.phone = maskPhone(updatedUser.profile.phone);

            setUser(updatedUser);
            setOpenSuccess(true);
        } catch (err) {
            setOpenAlert(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (!token) { navigate("/login"); return; }
        fetch(`${BASE_URL}/api/users/me/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => { if (!res.ok) throw new Error("401"); return res.json(); })
        .then(data => {
            if (data.profile?.birthdate) {
                const [y, m, d] = data.profile.birthdate.split('-');
                data.profile.birthdate = `${d}/${m}/${y}`;
            }
            if (data.profile?.phone) data.profile.phone = maskPhone(data.profile.phone);
            setUser(data);
        })
        .catch(() => {
            localStorage.clear(); navigate("/login");
        })
        .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <FontAwesomeIcon icon={faSpinner} className="text-4xl text-[#3626a7] animate-spin" />
        </div>
    );

    return (
        <div className="md:pt-[170px] pt-[100px] min-h-screen bg-[#f8f9fc] pb-15">
            
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity="error" variant="filled" sx={{ width: '100%', fontWeight: 'bold', bgcolor: '#ff0022' }}>
                    Error updating profile! Please check your data.
                </Alert>
            </Snackbar>

            <Snackbar open={openSuccess} autoHideDuration={6000} onClose={() => setOpenSuccess(false)}>
                <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
                    Profile updated successfully!
                </Alert>
            </Snackbar>

            <Dialog open={cropDialogOpen} maxWidth="sm" fullWidth>
                <div className='px-6 py-4 text-xl font-bold border-b'>Adjust Profile Picture</div>
                <DialogContent style={{ position: "relative", height: 400, backgroundColor: "#1a1a1a" }}>
                    <Cropper
                        image={tempImage.length > 0 ? tempImage[0].dataURL : null}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                    />
                </DialogContent>
                <DialogActions className="p-4 bg-gray-50">
                    <button onClick={() => setCropDialogOpen(false)} className="px-5 py-2 font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                    <button onClick={onCropSave} className="px-6 py-2 bg-[#3626a7] text-white rounded-xl font-bold hover:bg-[#2a1d8a] transition-all">Save Photo</button>
                </DialogActions>
            </Dialog>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-12 border border-gray-100">
                            <div className="relative w-28 h-28 mx-auto mb-6 group">
                                <img 
                                    src={userLoged.profile?.avatar || 'https://via.placeholder.com/150'} 
                                    className="w-full h-full rounded-3xl object-cover ring-4 ring-gray-50 shadow-inner transition-all group-hover:brightness-75" 
                                    alt="Profile" 
                                />
                                {isEditing && (
                                    <ImageUploading value={tempImage} onChange={handleImageUpload} dataURLKey="dataURL">
                                        {({ onImageUpload }) => (
                                            <div onClick={onImageUpload} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer text-white transition-all">
                                                <FontAwesomeIcon icon={faCamera} className="text-2xl" />
                                            </div>
                                        )}
                                    </ImageUploading>
                                )}
                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 text-center">{userLoged.first_name}</h2>
                            <p className="text-gray-400 text-sm text-center mb-8 font-medium truncate">{userLoged.email}</p>
                            
                            <nav className="space-y-1.5 w-full">
                                {[
                                    { id: '', icon: faUser, label: 'Account' },
                                    { id: 'orders', icon: faBox, label: 'My Orders' },
                                    { id: 'favorites', icon: faHeart, label: 'Favorites' },
                                    { id: 'settings', icon: faCog, label: 'Settings' },
                                    { id: 'security', icon: faShieldAlt, label: 'Security' }
                                ].map((item) => (
                                    <button 
                                        key={item.id}
                                        onClick={() => navigate(`/profile/${item.id}`)} 
                                        className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-semibold text-sm ${
                                            activeTab === item.id 
                                            ? 'bg-[#3626a7] text-white shadow-lg shadow-[#3626a7]/30' 
                                            : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={item.icon} className="text-lg" /> 
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                            <hr className="my-8 border-gray-100" />
                            <button onClick={() => {localStorage.clear(); navigate("/login")}} className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-all">
                                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 min-h-[650px]">
                            
                            {(!activeTab || activeTab === 'profile') && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex-col md:flex-row flex justify-between items-center mb-10">
                                        <div>
                                            <h2 className="text-center md:text-left text-3xl font-black text-gray-900 tracking-tight">Personal Details</h2>
                                            <p className="text-center md:text-left text-gray-400 font-medium">Update your info and address</p>
                                        </div>
                                        <button 
                                            onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                                            className={`my-3 texte md:m-0 px-6 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 ${isEditing ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                                        >
                                            <FontAwesomeIcon icon={isEditing ? faCheckCircle : faEdit} />
                                            {isEditing ? 'Save Profile' : 'Edit Profile'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        {[
                                            { label: 'First Name', name: 'first_name', icon: faUser, placeholder: 'John' },
                                            { label: 'Last Name', name: 'last_name', icon: faUser, placeholder: 'Doe' },
                                            { label: 'Email Address', name: 'email', icon: faEnvelope, placeholder: 'email@example.com', type: 'email' },
                                            { label: 'Phone Number', name: 'phone', icon: faPhone, placeholder: '(00) 00000-0000' },
                                            { label: 'Date of Birth', name: 'birthdate', icon: faCalendarAlt, placeholder: 'DD/MM/YYYY' },
                                            { label: 'CEP', name: 'cep', icon: faMapMarkerAlt, placeholder: '00000-000', loading: loadingCep },
                                            { label: 'Street', name: 'street', icon: faMap, placeholder: 'Street name' },
                                            { label: 'Number', name: 'number', icon: faHome, placeholder: '123' },
                                            { label: 'City', name: 'city', icon: faCity, readOnly: true },
                                            { label: 'State', name: 'state', icon: faGlobe, readOnly: true },
                                        ].map((field) => (
                                            <div key={field.name} className={`${field.name === 'street' ? 'md:col-span-2' : ''}`}>
                                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 mb-2 ml-1 uppercase tracking-[0.1em]">
                                                    <FontAwesomeIcon icon={field.icon} className="text-[#3626a7]" />
                                                    {field.label}
                                                </label>
                                                <div className="relative">
                                                    <input 
                                                        name={field.name}
                                                        type={field.type || 'text'}
                                                        disabled={field.readOnly || !isEditing}
                                                        value={(field.readOnly ? userLoged.profile?.[field.name] : (['first_name', 'last_name', 'email'].includes(field.name) ? userLoged[field.name] : userLoged.profile?.[field.name])) || ''}
                                                        onChange={handleInputChange}
                                                        placeholder={field.placeholder}
                                                        className={`w-full px-5 py-4 rounded-2xl border-2 transition-all outline-none font-semibold ${isEditing && !field.readOnly ? 'bg-white border-gray-100 focus:border-[#3626a7]' : 'bg-gray-50 border-transparent text-gray-400'}`}
                                                    />
                                                    {field.loading && <FontAwesomeIcon icon={faSpinner} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#3626a7]" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="text-center py-20 animate-in fade-in duration-500">
                                    <FontAwesomeIcon icon={faBox} className="text-5xl text-gray-200 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900">No orders found</h3>
                                    <p className="text-gray-400">Your shopping history will appear here.</p>
                                </div>
                            )}

                            {activeTab === 'favorites' && (
                                <div className="text-center py-20 animate-in fade-in duration-500">
                                    <FontAwesomeIcon icon={faHeart} className="text-5xl text-gray-200 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900">Wishlist is empty</h3>
                                    <p className="text-gray-400">Save products you love to see them here.</p>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-3xl font-black text-gray-900 mb-2">Settings</h2>
                                    <p className="text-gray-400 mb-10">Manage your preferences and notifications</p>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#3626a7] shadow-sm">
                                                    <FontAwesomeIcon icon={faBell} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Push Notifications</p>
                                                    <p className="text-sm text-gray-400">Receive alerts about your orders</p>
                                                </div>
                                            </div>
                                            <input type="checkbox" className="w-6 h-6 accent-[#3626a7]" defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#3626a7] shadow-sm">
                                                    <FontAwesomeIcon icon={faEnvelope} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">Email Marketing</p>
                                                    <p className="text-sm text-gray-400">Newsletter and weekly promotions</p>
                                                </div>
                                            </div>
                                            <input type="checkbox" className="w-6 h-6 accent-[#3626a7]" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-3xl font-black text-gray-900 mb-2">Security</h2>
                                    <p className="text-gray-400 mb-10">Keep your account safe and updated</p>
                                    
                                    <div className="max-w-md space-y-6">
                                        <div>
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Current Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#3626a7] font-semibold" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">New Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-[#3626a7] font-semibold" />
                                        </div>
                                        <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-3">
                                            <FontAwesomeIcon icon={faLock} />
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
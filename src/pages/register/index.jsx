import React, { useState, useCallback, useMemo } from 'react';
import useAuthCheck from '../../components/verify'
import Logo from '../../../public/imgs/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaCheck } from "react-icons/fa";
import { 
  faUser, faEnvelope, faLock, faEye, faEyeSlash,
  faArrowRight, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';

const InputField = React.memo(({ 
  label, icon, type = 'text', field, value, placeholder, maxLength,
  showToggleIcon = false, isPasswordVisible, 
  error, isValid, isTouched, showAllErrors,
  onChange, onBlur, onToggleVisibility
}) => {
  const isPasswordField = type === 'password';
  const showError = (isTouched || showAllErrors) && error;
  
  return (
    <div className="mb-4 px-2">
      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
        {icon && <FontAwesomeIcon icon={icon} className="w-3.5 h-3.5 mr-2 text-gray-400" />}
        {label}
      </label>
      
      <div className="relative">
        <input
          type={isPasswordField ? (isPasswordVisible ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          onBlur={() => onBlur(field)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
            showError
              ? 'border-red-500 focus:border-red-500 bg-red-50'
              : isValid && value
              ? 'border-green-500 focus:border-green-500'
              : 'border-gray-200 focus:border-[#3626a7] hover:border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-[#3626a7]/20`}
        />
        
        {showToggleIcon && (
          <button
            type="button"
            onClick={() => onToggleVisibility(field)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
          </button>
        )}
        
        {isValid && !error && value && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500">
            <FaCheck className="w-4 h-4" />
          </div>
        )}
      </div>
      
      {showError && (
        <p className="mt-1.5 ml-1 text-xs text-red-600 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
});

const CleanRegisterPage = () => {
  const isLogged = useAuthCheck(); 
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLogged) navigate("/profile");
  }, [isLogged, navigate]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '', 
    email: '',
    phone: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [ui, setUi] = useState({
    showPassword: false,
    showConfirmPassword: false,
    isSubmitting: false,
    showAllErrors: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const maskPhone = useCallback((value) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2")
      .substring(0, 15);
  }, []);

  const maskDate = useCallback((value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .substring(0, 10);
  }, []);

  const validateField = useCallback((field, value) => {
    switch(field) {
      case 'firstName': return !value.trim() ? 'First name required' : value.length < 2 ? 'Minimum of 2 letters!' : '';
      case 'lastName': return !value.trim() ? 'Last name required' : value.length < 2 ? 'Minimum of 2 letters!' : '';
      case 'username': return !value.trim() ? 'Username required' : value.length < 3 ? 'Minimum of 3 characters' : '';
      case 'email': return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'E-mail invalid' : '';
      case 'password': 
        if (!value) return 'Password required';
        if (value.length < 8) return 'Minimum of 8 characters!';
        if (!/[A-Z]/.test(value)) return 'It needs a capital letter!';
        if (!/[0-9]/.test(value)) return 'Password need a number.';
        return '';
      case 'confirmPassword': return value !== formData.password ? "The passwords don't match" : "";
      case 'phone': 
        const cleanPhone = value.replace(/\D/g, '');
        return cleanPhone.length > 0 && cleanPhone.length < 10 ? 'Incomplete phone number' : '';
      case 'birthDate':
        if (!value) return '';
        if (value.length < 10) return 'Invalid date format';
        const parts = value.split('/');
        const date = new Date(parts[2], parts[1] - 1, parts[0]);
        if (isNaN(date.getTime()) || date > new Date()) return 'Invalid date';
        return '';
      default: return '';
    }
  }, [formData.password]);

  const handleChange = (field, value) => {
    let processedValue = value;
    if (field === 'phone') processedValue = maskPhone(value);
    if (field === 'birthDate') processedValue = maskDate(value);
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    if (touched[field] || ui.showAllErrors) {
      setErrors(prev => ({ ...prev, [field]: validateField(field, processedValue) }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, formData[field]) }));
  };

  const isFormValid = useMemo(() => {
    const required = ['firstName', 'lastName', 'username', 'email', 'password', 'confirmPassword'];
    const hasEmptyRequired = required.some(f => !formData[f].trim());
    const hasErrors = Object.values(errors).some(e => e !== '');
    return !hasEmptyRequired && !hasErrors && formData.agreeTerms;
  }, [formData, errors]);

  const registerAndLogin = async (data) => {
    const cleanPhone = data.phone.replace(/\D/g, "");
    let backendDate = null;
    if (data.birthDate && data.birthDate.length === 10) {
        const [d, m, y] = data.birthDate.split('/');
        backendDate = `${y}-${m}-${d}`;
    }

    const regRes = await fetch(`${BASE_URL}/api/users/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: cleanPhone,
        birthdate: backendDate
      }),
    });

    if (!regRes.ok) {
      const errorData = await regRes.json();
      throw new Error(errorData.detail || "Erro no registro.");
    }

    const result = await regRes.json();
    localStorage.setItem("access", result.access);
    localStorage.setItem("refresh", result.refresh);
    return result.user;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setUi(prev => ({ ...prev, showAllErrors: true }));
      return;
    }

    setUi(prev => ({ ...prev, isSubmitting: true }));

    try {
      await registerAndLogin(formData);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao cadastrar.");
    } finally {
      setUi(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  if (isLogged) return null;

  return (
    <div className="md:pt-[170px] pt-[100px] min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#3626a7] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img src={Logo} className="w-8 h-8 brightness-0 invert" alt="Logo" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar Conta</h1>
          <p className="text-gray-500 text-sm">Junte-se a nós em poucos segundos</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-2">
          <div className="grid grid-cols-2 gap-0">
            <InputField label="First name" field="firstName" value={formData.firstName} placeholder="João" 
              error={errors.firstName} isTouched={touched.firstName} onChange={handleChange} onBlur={handleBlur} showAllErrors={ui.showAllErrors} />
            <InputField label="Last name" field="lastName" value={formData.lastName} placeholder="Silva" 
              error={errors.lastName} isTouched={touched.lastName} onChange={handleChange} onBlur={handleBlur} showAllErrors={ui.showAllErrors} />
          </div>

          <InputField label="Username" icon={faUser} field="username" value={formData.username} placeholder="ex: joaosilva22" 
            error={errors.username} isTouched={touched.username} onChange={handleChange} onBlur={handleBlur} showAllErrors={ui.showAllErrors} 
          />

          <InputField label="E-mail" icon={faEnvelope} type="email" field="email" value={formData.email} placeholder="seu@email.com" 
            error={errors.email} isTouched={touched.email} onChange={handleChange} onBlur={handleBlur} showAllErrors={ui.showAllErrors} />


          <InputField 
            label="Password" 
            icon={faLock} 
            type="password" 
            field="password" 
            value={formData.password}
            placeholder="********"
            showToggleIcon={true} 
            isPasswordVisible={ui.showPassword}
            onToggleVisibility={() => setUi(p => ({...p, showPassword: !p.showPassword}))}
            error={errors.password} 
            isTouched={touched.password} 
            onChange={handleChange} 
            onBlur={handleBlur} 
            showAllErrors={ui.showAllErrors} 
          />

          <InputField label="Confirm password" icon={faLock} type="password" field="confirmPassword" value={formData.confirmPassword} placeholder="********" showToggleIcon={true}
            isPasswordVisible={ui.showConfirmPassword} onToggleVisibility={() => setUi(p => ({...p, showConfirmPassword: !p.showConfirmPassword}))}
            error={errors.confirmPassword} isTouched={touched.confirmPassword} onChange={handleChange} onBlur={handleBlur} showAllErrors={ui.showAllErrors} />

          <div className="px-2 py-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="hidden" checked={formData.agreeTerms} 
                onChange={(e) => setFormData(p => ({...p, agreeTerms: e.target.checked}))} />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.agreeTerms ? 'bg-[#3626a7] border-[#3626a7]' : 'border-gray-300'}`}>
                {formData.agreeTerms && <FaCheck className="text-white text-[10px]" />}
              </div>
              <span className="text-xs text-gray-500">
                Aceito os <a href="#" className="text-[#3626a7] font-semibold underline">Termos e Condições</a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || ui.isSubmitting}
            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              isFormValid && !ui.isSubmitting 
              ? 'bg-[#3626a7] text-white hover:bg-[#2a1f8c] shadow-lg active:scale-95' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {ui.isSubmitting ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : 'Create my account'}
            {!ui.isSubmitting && <FontAwesomeIcon icon={faArrowRight} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CleanRegisterPage;
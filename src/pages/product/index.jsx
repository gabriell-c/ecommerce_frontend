import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Shipping from '../../components/shipping'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, Zoom } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  faStar,
  faStarHalfAlt,
  faShoppingCart,
  faHeart,
  faUndo,
  faShieldAlt,
  faBoxOpen,
  faXmark,
  faTruck,
  faCheckCircle,
  faExpand,
  faChevronRight,
  faMinus,
  faPlus,
  faTrophy,
  faHeadset,
  faCreditCard,
  faLeaf,
  faRecycle,
  faBolt,
} from '@fortawesome/free-solid-svg-icons';
import { Alert, IconButton, Snackbar, CircularProgress, Chip } from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/zoom';
import { BASE_URL } from '../../config';

const ProductOverview = () => {
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [productsAPI, setProductsAPI] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [activeTab, setActiveTab] = useState('1');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [selectedImage, setSelectedImage] = useState(0);
    const [zoomEnabled, setZoomEnabled] = useState(true);
    
    const { slug } = useParams();
    const mainSwiperRef = useRef(null);

    const colors = {
        primary: '#3626a7',
        secondary: '#0d0106',
        accent: '#ff331f',
        background: '#f8f9ff',
        surface: '#ffffff',
        success: '#10b981',
        warning: '#f59e0b'
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/api/products/`);
                const data = await response.json();
                const product = data.find(p => p.slug === slug);
                setProductsAPI(product);
            } catch (err) {
                console.error('Error fetching product:', err);
                showSnackbar('Erro ao carregar produto', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleAddToCart = async () => {
        if (!productsAPI) return;
        
        const token = localStorage.getItem('access');
        if (!token) {
            showSnackbar(
                <>
                    <Link to="/login" className="underline font-bold text-[var(--color2)]">Faça login</Link> para adicionar ao carrinho!
                </>, 
                "error"
            );
            return
        }

        setAddingToCart(true);
        try {
            const response = await fetch(`${BASE_URL}/api/cart/items/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product: productsAPI.id,
                    quantity: quantity,
                }),
            });

            if (response.ok) {
                showSnackbar(`${productsAPI.name} adicionado ao carrinho!`, 'success');
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                showSnackbar('Erro ao adicionar item', 'error');
            }
        } catch (err) {
            showSnackbar('Erro de conexão', 'error');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating || 4.5);
        const hasHalfStar = (rating % 1) >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<FontAwesomeIcon key={i} icon={faStar} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />);
            } else {
                stars.push(<FontAwesomeIcon key={i} icon={faStar} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />);
            }
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-100 flex items-center justify-center mx-auto mb-6">
                        <CircularProgress style={{ color: colors.primary }} />
                    </div>
                    <p className="text-gray-600 font-medium">Carregando produto...</p>
                </div>
            </div>
        );
    }

    if (!productsAPI) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-gray-100 flex items-center justify-center mx-auto mb-6">
                        <FontAwesomeIcon icon={faXmark} className="text-red-500 text-3xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
                    <p className="text-gray-600 mb-8">
                        O produto que você está procurando não existe ou foi removido.
                    </p>
                    <Link 
                        to="/products" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Voltar para Produtos
                    </Link>
                </div>
            </div>
        );
    }

    const mainImage = productsAPI.images?.find(img => img.main) || productsAPI.images?.[0];
    const isOutOfStock = !productsAPI.stock || productsAPI.stock <= 0;

    return (
        <div className="md:pt-[136px] pt-[73px]  min-h-screen bg-gradient-to-b from-white to-gray-50">
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        borderRadius: '12px',
                        fontWeight: 500,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        backgroundColor: snackbar.severity === 'success' ? colors.primary : undefined
                    }}
                    action={
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => setSnackbar({ ...snackbar, open: false })}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </IconButton>
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 text-xs" />
                        <Link to="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Produtos
                        </Link>
                        {productsAPI.category && (
                            <>
                                <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 text-xs" />
                                <span className="text-gray-900 font-medium">
                                    {productsAPI.category_name || 'Categoria'}
                                </span>
                            </>
                        )}
                        <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 text-xs" />
                        <span className="text-gray-500 truncate">{productsAPI.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
                            <div className="aspect-square relative">
                                <Swiper
                                    ref={mainSwiperRef}
                                    spaceBetween={10}
                                    navigation={true}
                                    thumbs={{ swiper: thumbsSwiper }}
                                    modules={[Navigation, Thumbs, Zoom]}
                                    zoom={zoomEnabled}
                                    className="!pb-10"
                                >
                                    {productsAPI.images?.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="swiper-zoom-container">
                                                <img
                                                    src={`${BASE_URL}${img.image}`}
                                                    alt={`${productsAPI.name} - Imagem ${index + 1}`}
                                                    className="w-full h-full object-contain p-8"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                <div className="absolute top-4 right-4 z-10 flex gap-2">
                                    
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center ${
                                            isFavorite 
                                                ? 'bg-red-500 text-white' 
                                                : 'bg-white/90 text-gray-600 hover:text-red-500'
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={faHeart} className={isFavorite ? 'fill-current' : ''} />
                                    </button>
                                </div>

                                {isOutOfStock ? (
                                    <div className="absolute top-4 left-4">
                                        <Chip 
                                            label="ESGOTADO" 
                                            size="small"
                                            className="!bg-gradient-to-r !from-red-500 !to-orange-500 !text-white !font-bold"
                                        />
                                    </div>
                                ) : productsAPI.stock <= 10 ? (
                                    <div className="absolute top-4 left-4 z-1">
                                        <Chip 
                                            label={`ÚLTIMAS ${productsAPI.stock} UNIDADES`} 
                                            size="small"
                                            className="!bg-gradient-to-r !from-orange-500 !to-amber-500 !text-white !font-bold"
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="px-4">
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={12}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="!p-2"
                            >
                                {productsAPI.images?.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <button
                                            onClick={() => {
                                                setSelectedImage(index);
                                                mainSwiperRef.current?.swiper.slideTo(index);
                                            }}
                                            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                                                selectedImage === index 
                                                    ? 'border-blue-500 scale-105 shadow-lg' 
                                                    : 'border-transparent hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={`${BASE_URL}${img.image}`}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                        </button>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4">
                            {productsAPI.is_new && (
                                <Chip 
                                    icon={<FontAwesomeIcon icon={faBolt} className="!text-xs" />} 
                                    label="NOVO" 
                                    size="small" 
                                    className="!bg-gradient-to-r !from-blue-500 !to-purple-500 !text-white"
                                />
                            )}
                            {productsAPI.is_featured && (
                                <Chip 
                                    icon={<FontAwesomeIcon icon={faTrophy} className="!text-xs" />} 
                                    label="DESTAQUE" 
                                    size="small" 
                                    className="!bg-gradient-to-r !from-amber-500 !to-orange-500 !text-white"
                                />
                            )}
                            {productsAPI.free_shipping && (
                                <Chip 
                                    icon={<FontAwesomeIcon icon={faTruck} className="!text-xs" />} 
                                    label="FRETE GRÁTIS" 
                                    size="small" 
                                    className="!bg-gradient-to-r !from-green-500 !to-emerald-500 !text-white"
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {productsAPI.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    {renderStars(productsAPI.rating || 4.5)}
                                    <span className="text-gray-600 font-medium">
                                        {productsAPI.rating || 4.5}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-500">
                                        {productsAPI.review_count || 24} avaliações
                                    </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    !isOutOfStock 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {!isOutOfStock ? `${productsAPI.stock} em estoque` : 'Esgotado'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                                    R$ {Number(productsAPI.price).toFixed(2).replace('.', ',')}
                                </span>
                                {productsAPI.original_price && (
                                    <span className="text-xl text-gray-500 line-through">
                                        R$ {Number(productsAPI.original_price).toFixed(2).replace('.', ',')}
                                    </span>
                                )}
                                {productsAPI.discount && (
                                    <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-bold">
                                        -{productsAPI.discount}%
                                    </span>
                                )}
                            </div>
                            
                            {productsAPI.installments > 1 && (
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCreditCard} className="text-green-500" />
                                    <span className="text-gray-700 font-medium">
                                        Em até {productsAPI.installments}x de R$ {Number(productsAPI.price / productsAPI.installments).toFixed(2).replace('.', ',')} sem juros
                                    </span>
                                </div>
                            )}
                        </div>

                        <Shipping />


                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantidade</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-white disabled:opacity-30 transition-all"
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <span className="w-16 text-center text-xl font-bold text-gray-900">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(Math.min(productsAPI.stock || 10, quantity + 1))}
                                            disabled={quantity >= (productsAPI.stock || 10)}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-white disabled:opacity-30 transition-all"
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {productsAPI.stock || 10} unidades disponíveis
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isOutOfStock || addingToCart}
                                        className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                                            !isOutOfStock
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:opacity-90'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {addingToCart ? (
                                            <>
                                                <CircularProgress size={20} color="inherit" />
                                                Adicionando...
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faShoppingCart} />
                                                {!isOutOfStock ? 'Adicionar ao Carrinho' : 'Esgotado'}
                                            </>
                                        )}
                                    </button>
                                    
                                    <button 
                                        disabled={isOutOfStock}
                                        className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Comprar Agora
                                    </button>
                                </div>

                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-200">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                                    <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500 text-xl" />
                                </div>
                                <span className="font-medium text-sm">Garantia</span>
                                <span className="text-xs text-gray-500">12 meses</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-200">
                                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                                    <FontAwesomeIcon icon={faUndo} className="text-green-500 text-xl" />
                                </div>
                                <span className="font-medium text-sm">Devolução</span>
                                <span className="text-xs text-gray-500">30 dias</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-200">
                                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
                                    <FontAwesomeIcon icon={faBoxOpen} className="text-purple-500 text-xl" />
                                </div>
                                <span className="font-medium text-sm">Entrega</span>
                                <span className="text-xs text-gray-500">Todo Brasil</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-200">
                                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                                    <FontAwesomeIcon icon={faHeadset} className="text-orange-500 text-xl" />
                                </div>
                                <span className="font-medium text-sm">Suporte</span>
                                <span className="text-xs text-gray-500">24/7</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 bg-white rounded-3xl border border-gray-200 overflow-hidden">
                    <TabContext value={activeTab}>
                        <div className="border-b border-gray-200">
                            <TabList 
                                onChange={handleTabChange} 
                                aria-label="product details tabs"
                                sx={{
                                    '& .MuiTab-root': {
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: '#6b7280',
                                        textTransform: 'none',
                                        padding: '1rem 2rem',
                                        minHeight: '64px'
                                    },
                                    '& .Mui-selected': {
                                        color: colors.primary,
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: colors.primary,
                                        height: 3
                                    }
                                }}
                            >
                                <Tab label="Descrição" value="1" />
                                <Tab label="Especificações" value="2" />
                                <Tab label="Avaliações" value="3" />
                                <Tab label="Garantia" value="4" />
                            </TabList>
                        </div>

                        <div className="p-8">
                            <TabPanel value="1" className="!p-0">
                                <div className="space-y-6">
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        {productsAPI.description || 'Descrição não disponível.'}
                                    </p>
                                    
                                    {productsAPI.features && (
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-4">Características Principais</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {productsAPI.features.split(',').map((feature, index) => (
                                                    <div key={index} className="flex items-center gap-3">
                                                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                                                        <span className="text-gray-700">{feature.trim()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabPanel>

                            <TabPanel value="2" className="!p-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="text-xl font-bold text-gray-900">Informações Técnicas</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Marca</span>
                                                <span className="font-medium">{productsAPI.brand || 'Não especificado'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Modelo</span>
                                                <span className="font-medium">{productsAPI.model || 'Não especificado'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Peso</span>
                                                <span className="font-medium">{productsAPI.weight || 'Não especificado'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Dimensões</span>
                                                <span className="font-medium">{productsAPI.dimensions || 'Não especificado'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h4 className="text-xl font-bold text-gray-900">Garantia & Suporte</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                                                <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500" />
                                                <div>
                                                    <p className="font-medium">Garantia do Fabricante</p>
                                                    <p className="text-sm text-gray-600">12 meses contra defeitos de fabricação</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                                                <FontAwesomeIcon icon={faHeadset} className="text-green-500" />
                                                <div>
                                                    <p className="font-medium">Suporte Técnico</p>
                                                    <p className="text-sm text-gray-600">Disponível 24/7 via chat, email e telefone</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>

                            <TabPanel value="3" className="!p-0">
                                <div className="text-center py-8">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                        <FontAwesomeIcon icon={faStar} className="text-gray-400 text-2xl" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">Este produto ainda não tem avaliações</h4>
                                    <p className="text-gray-600">Seja o primeiro a avaliar este produto!</p>
                                    <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90">
                                        Avaliar Produto
                                    </button>
                                </div>
                            </TabPanel>

                            <TabPanel value="4" className="!p-0">
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                                        <h4 className="text-2xl font-bold text-gray-900 mb-4">Política de Garantia</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1" />
                                                <div>
                                                    <p className="font-medium text-gray-900">Garantia de 12 meses</p>
                                                    <p className="text-gray-600">Cobertura completa contra defeitos de fabricação</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <FontAwesomeIcon icon={faUndo} className="text-blue-500 mt-1" />
                                                <div>
                                                    <p className="font-medium text-gray-900">Troca Fácil</p>
                                                    <p className="text-gray-600">Processo simplificado de troca em até 30 dias</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <FontAwesomeIcon icon={faHeadset} className="text-purple-500 mt-1" />
                                                <div>
                                                    <p className="font-medium text-gray-900">Suporte Dedicado</p>
                                                    <p className="text-gray-600">Equipe especializada para resolver qualquer problema</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                        </div>
                    </TabContext>
                </div>

                <div className="mt-8 flex items-center justify-center gap-3 text-sm text-gray-600">
                    <FontAwesomeIcon icon={faLeaf} className="text-green-500" />
                    <span>Produto eco-friendly • Embalagem sustentável</span>
                    <FontAwesomeIcon icon={faRecycle} className="text-green-500" />
                </div>
            </div>
        </div>
    );
};

export default ProductOverview;
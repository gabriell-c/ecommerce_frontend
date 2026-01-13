import { useState, useEffect } from 'react';
import { BASE_URL } from '../../config';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faStar,
    faStarHalfAlt,
    faShoppingBag,
    faSearch,
    faChevronRight,
    faHeart,
    faEye,
    faXmark
} from '@fortawesome/free-solid-svg-icons';
import { Alert, IconButton } from '@mui/material';

const Products = () => {
    const [productsAPI, setProductsAPI] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [wishlist, setWishlist] = useState([]);
    const [snackbars, setSnackbars] = useState([]);
    const [addingId, setAddingId] = useState(null); 


    const colors = {
        primary: '#3626a7',
        secondary: '#0d0106',
        accent: '#ff331f',
        background: '#f8f9ff',
        surface: '#ffffff',
        muted: '#6b7280',
        success: '#10b981'
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/api/products/`);
            const data = await response.json();
            setProductsAPI(data);
            setFilteredProducts(data);
            
            const uniqueCategories = ['all', ...new Set(data.map(product => product.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (category) => {
        setActiveCategory(category);
        if (category === 'all') {
            setFilteredProducts(productsAPI);
        } else {
            const filtered = productsAPI.filter(product => product.category === category);
            setFilteredProducts(filtered);
        }
    };

    const handleSort = (sortType) => {
        setSortBy(sortType);
        let sorted = [...filteredProducts];
        
        switch (sortType) {
            case 'price-low':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                sorted = [...productsAPI].filter(p => 
                    activeCategory === 'all' || p.category === activeCategory
                );
        }
        setFilteredProducts(sorted);
    };

    const toggleWishlist = (productId) => {
        setWishlist(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <FontAwesomeIcon 
                    key={`full-${i}`} 
                    icon={faStar} 
                    className="w-3 h-3 text-yellow-400" 
                />
            );
        }
        
        if (hasHalfStar) {
            stars.push(
                <FontAwesomeIcon 
                    key="half" 
                    icon={faStarHalfAlt} 
                    className="w-3 h-3 text-yellow-400" 
                />
            );
        }
        
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <FontAwesomeIcon 
                    key={`empty-${i}`} 
                    icon={faStar} 
                    className="w-3 h-3 text-gray-300" 
                />
            );
        }
        
        return stars;
    };

    const addSnackbar = (message, severity) => {
        const id = Date.now();
        setSnackbars((prev) => [...prev, { id, message, severity }]);
        setTimeout(() => {
        setSnackbars((prev) => prev.filter((s) => s.id !== id));
        }, 10000);
    };



    const handleAddToCart = async (product) => {
        const token = localStorage.getItem("access");
        if (!token) {
            addSnackbar(
                <>
                    <Link to="/login" className="underline font-bold text-[var(--color2)]">Faça login</Link> para adicionar ao carrinho!
                </>, 
                "error"
            );
            return;
        }

        setAddingId(product.id);
        try {
            const response = await fetch(`${BASE_URL}/api/cart/items/`, {
                method: "POST",
                headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                product: product.id,
                quantity: 1,
                }),
            });

            if (response.ok) {
                addSnackbar(`${product.name} adicionado com sucesso!`, "success");
                window.dispatchEvent(new Event("cartUpdate"));
            } else {
                addSnackbar("Erro ao adicionar item.", "error");
            }
        } catch (err) {
        addSnackbar("Erro de conexão com o servidor.", "error");
        } finally {
        setAddingId(null);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-100 flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <FontAwesomeIcon icon={faShoppingBag} className="text-blue-500 text-2xl" />
                    </div>
                    <p className="text-gray-600 font-medium">Carregando produtos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none ">
                {snackbars.map((snack) => (
                    <div key={snack.id} className="pointer-events-auto animate-slide-in">
                    <Alert
                        className="!bg-gradient-to-r from-[var(--color3)] to-[var(--color5)] "
                        severity={snack.severity}
                        variant="filled"
                        fontWeight="bold"
                        style={{ 
                            backgroundColor: snack.severity === 'success' ? colors.color3 : undefined,
                            borderRadius: '12px',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                            
                        }}
                        action={
                        <IconButton size="small" color="inherit" onClick={() => setSnackbars(prev => prev.filter(s => s.id !== snack.id))}>
                            <FontAwesomeIcon icon={faXmark} size="xs" />
                        </IconButton>
                        }
                    >
                        {snack.message}
                    </Alert>
                    </div>
                ))}
                </div>





                
            
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                    {filteredProducts.map((product) => {
                        const isOnWishlist = wishlist.includes(product.id);
                        const mainImage = product.images.find(img => img.main) || product.images[0];
                        const isAdding = addingId === product.id;
                        return (
                            <div 
                                key={product.id}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                            >
                                <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                                    <Link to={`/product/${product.slug}`}>
                                        <img
                                            className="w-full h-64 object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                                            src={`${BASE_URL}${mainImage?.image}`}
                                            alt={product.name}
                                        />
                                    </Link>
                                    
                                    {product.discount && (
                                        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            -{product.discount}%
                                        </div>
                                    )}
                                    
                                    {product.is_new && (
                                        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                            NOVO
                                        </div>
                                    )}

                                    <button
                                        onClick={() => toggleWishlist(product.id)}
                                        className={`absolute top-4 ${product.discount ? 'left-12' : 'left-4'} w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${isOnWishlist 
                                            ? 'bg-red-500/10 text-red-500' 
                                            : 'bg-white/80 text-gray-600 hover:text-red-500'
                                        }`}
                                    >
                                        <FontAwesomeIcon 
                                            icon={faHeart} 
                                            className={isOnWishlist ? 'fill-current' : ''}
                                        />
                                    </button>

                                    <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className="mb-2 truncate">
                                        <span className="text-xs font-medium text-[var(--color3)] bg-purple-50 px-3 py-1 rounded-full">
                                            {product.category_name}
                                        </span>
                                    </div>

                                    <Link to={`/product/${product.slug}`}>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    {product.description && (
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                            {product.description}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center gap-1">
                                            {renderStars(product.rating || 4.5)}
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            ({product.reviews_count || 24})
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            {product.original_price ? (
                                                <>
                                                    <span className="text-2xl font-bold text-gray-900">
                                                        R$ {Number(product.price).toFixed(2).replace('.', ',')}
                                                    </span>
                                                    <span className="text-sm text-gray-500 line-through ml-2">
                                                        R$ {Number(product.original_price).toFixed(2).replace('.', ',')}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-2xl font-bold text-gray-900">
                                                    R$ {Number(product.price).toFixed(2).replace('.', ',')}
                                                </span>
                                            )}
                                            {product.installment_price && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    ou {product.installment_count}x de R$ {Number(product.installment_price).toFixed(2).replace('.', ',')}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={isAdding}
                                        className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-md group-hover:scale-110 transition-transform">
                                            <FontAwesomeIcon icon={faShoppingBag} />
                                        </button>
                                    </div>
                                </div>

                                {product.stock <= 10 && product.stock > 0 && (
                                    <div className="px-6 pb-6">
                                        <div className="text-xs text-amber-600 font-medium bg-amber-50 px-3 py-2 rounded-lg">
                                            ⚠️ Apenas {product.stock} unidades disponíveis
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-6">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Nenhum produto encontrado
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Tente ajustar seus filtros ou explorar outras categorias
                        </p>
                        <button
                            onClick={() => handleFilter('all')}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                        >
                            Ver todos os produtos
                        </button>
                    </div>
                )}

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                            Mostrando <span className="font-semibold text-gray-900">{filteredProducts.length}</span> de{' '}
                            <span className="font-semibold text-gray-900">{productsAPI.length}</span> produtos
                        </div>
                        {productsAPI.length > filteredProducts.length && (
                            <button
                                onClick={() => {
                                    setActiveCategory('all');
                                    setFilteredProducts(productsAPI);
                                }}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
                            >
                                Limpar filtros
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            
        </div>
    );
};

export default Products;
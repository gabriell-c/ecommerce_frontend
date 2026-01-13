import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFilter,
    faSearch,
    faTimes,
    faShoppingBag,
    faHeart,
    faEye,
    faStar,
    faStarHalfAlt,
    faTruck,
    faShieldAlt,
    faArrowLeft,
    faChevronRight,
    faSortAmountDown,
    faSortAmountUp,
    faXmark
} from '@fortawesome/free-solid-svg-icons';
import { Alert, IconButton } from "@mui/material";
import { BASE_URL } from "../../config";

const CategoryPage = () => {
    const { category: categorySlug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataFetched, setDataFetched] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [sortOpen, setSortOpen] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [addingId, setAddingId] = useState(null); 
    const [snackbars, setSnackbars] = useState([]); 
    
    const colors = {
        primary: '#3626a7',
        secondary: '#0d0106',
        accent: '#ff331f',
        background: '#f8f9ff',
        surface: '#ffffff',
        muted: '#6b7280',
        success: '#10b981'
    };

    const [filters, setFilters] = useState({
        search: new URLSearchParams(location.search).get("search") || "",
        category: "",
        min_price: "",
        max_price: "",
        order: ""
    });

    useEffect(() => {
        const querySearch = new URLSearchParams(location.search).get("search") || "";
        setFilters(prev => ({ ...prev, search: querySearch }));
    }, [location.search]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [resProducts, resCategories] = await Promise.all([
                    fetch(`${BASE_URL}/api/products/`),
                    fetch(`${BASE_URL}/api/category/`)
                ]);

                const productsData = await resProducts.json();
                const categoriesData = await resCategories.json();

                setAllProducts(productsData);
                setCategoriesList(categoriesData);
                setDataFetched(true);
                
                if (productsData.length > 0) {
                    const prices = productsData.map(p => parseFloat(p.price));
                    const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100;
                    setPriceRange([0, maxPrice]);
                }
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [BASE_URL]);

    const currentCategoryObj = useMemo(() => {
        return categoriesList.find(c => c.slug === categorySlug);
    }, [categoriesList, categorySlug]);

    const filteredProducts = useMemo(() => {
        if (!currentCategoryObj) return [];

        let result = allProducts.filter(p => String(p.category) === String(currentCategoryObj.id));

        const currentSearch = (filters.search || "").trim();
        if (currentSearch !== "") {
            const fuse = new Fuse(result, {
                keys: [{ name: 'name', weight: 2 }, { name: 'description', weight: 0.1 }],
                threshold: 0.4,
                distance: 50,
                includeScore: true,
                ignoreLocation: true
            });
            
            const fuzzyResults = fuse.search(currentSearch);
            result = fuzzyResults
                .filter(res => res.score < 0.35)
                .map(res => res.item);
        }

        result = result.filter(product => {
            const price = parseFloat(product.price);
            return price >= priceRange[0] && price <= priceRange[1];
        });

        result = result.filter((product) => {
            const price = parseFloat(product.price);
            const minStr = (filters.min_price || "").toString().trim();
            const matchMin = (minStr !== "" && !isNaN(parseFloat(minStr))) ? price >= parseFloat(minStr) : true;
            const maxStr = (filters.max_price || "").toString().trim();
            const matchMax = (maxStr !== "" && !isNaN(parseFloat(maxStr))) ? price <= parseFloat(maxStr) : true;
            return matchMin && matchMax;
        });

        return result.sort((a, b) => {
            if (filters.order === "price_asc") return parseFloat(a.price) - parseFloat(b.price);
            if (filters.order === "price_desc") return parseFloat(b.price) - parseFloat(a.price);
            if (filters.order === "name_asc") return a.name.localeCompare(b.name);
            if (filters.order === "name_desc") return b.name.localeCompare(a.name);
            if (filters.order === "popular") return (b.rating || 0) - (a.rating || 0);
            return 0;
        });
    }, [allProducts, filters, currentCategoryObj, priceRange]);

    const resetFilters = () => {
        setFilters(prev => ({ ...prev, search: "", min_price: "", max_price: "", order: "" }));
        setPriceRange([0, 5000]);
    };

    const handleSort = (order) => {
        setFilters(prev => ({ ...prev, order }));
        setSortOpen(false);
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
        const fullStars = Math.floor(rating || 4);
        const hasHalfStar = (rating % 1) >= 0.5;
        
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
        }, 3000);
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
            return
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

    if (!loading && dataFetched && !currentCategoryObj) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="relative">
                        <div className="text-9xl font-black text-gray-100 mb-4">404</div>
                        <div className="relative -mt-24">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Categoria não encontrada</h1>
                            <p className="text-gray-600 mb-8">
                                A categoria <span className="font-bold text-[#3626a7]">"{categorySlug}"</span> não existe em nosso catálogo.
                            </p>
                            <div className="space-y-4">
                                <Link 
                                    to="/products" 
                                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                    Voltar para Produtos
                                </Link>
                                <p className="text-sm text-gray-500">
                                    Ou <Link to="/" className="text-blue-600 hover:underline">voltar para a página inicial</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded-lg w-1/4 mb-6"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-12"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100">
                                    <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="md:pt-[170px] pt-[100px] min-h-screen bg-gradient-to-b from-white to-gray-50">

            <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
            {snackbars.map((snack) => (
                <div key={snack.id} className="pointer-events-auto animate-slide-in">
                <Alert
                    className="!bg-[var(--color-green-500)]"
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


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative">
                        <button
                            onClick={() => setSortOpen(!sortOpen)}
                            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 w-full md:w-auto"
                        >
                            <FontAwesomeIcon icon={faSortAmountDown} />
                            <span className="font-medium">
                                {filters.order === "price_asc" ? "Preço: Menor → Maior" :
                                 filters.order === "price_desc" ? "Preço: Maior → Menor" :
                                 filters.order === "name_asc" ? "Nome A-Z" :
                                 filters.order === "name_desc" ? "Nome Z-A" :
                                 filters.order === "popular" ? "Mais Populares" :
                                 "Ordenar por"}
                            </span>
                            <FontAwesomeIcon icon={faChevronRight} className={`transition-transform ${sortOpen ? 'rotate-90' : ''}`} />
                        </button>
                        
                        {sortOpen && (
                            <div className="absolute z-50 top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-2">
                                <button
                                    onClick={() => handleSort("")}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                                >
                                    Padrão
                                </button>
                                <button
                                    onClick={() => handleSort("price_asc")}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faSortAmountUp} />
                                    Preço: Menor → Maior
                                </button>
                                <button
                                    onClick={() => handleSort("price_desc")}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faSortAmountDown} />
                                    Preço: Maior → Menor
                                </button>
                                <button
                                    onClick={() => handleSort("name_asc")}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                                >
                                    Nome A-Z
                                </button>
                                <button
                                    onClick={() => handleSort("name_desc")}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                                >
                                    Nome Z-A
                                </button>
                                <button
                                    onClick={() => handleSort("popular")}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                                >
                                    Mais Populares
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="md:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                    >
                        <FontAwesomeIcon icon={faFilter} />
                        <span className="font-medium">Filtros</span>
                    </button>
                </div>

                <div className="flex gap-8">
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900">Filtros</h3>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Limpar tudo
                                </button>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Faixa de Preço</h4>
                                <div className="space-y-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="100"
                                        value={priceRange[1]}
                                        
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color3)]"
                                    />
                                    <div className="flex justify-between">
                                        <div className="text-sm">
                                            <span className="font-semibold">R$ {priceRange[0].toFixed(2)}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-semibold">R$ {priceRange[1].toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Categorias Relacionadas</h4>
                                <div className="space-y-2">
                                    {categoriesList
                                        .filter(c => c.id !== currentCategoryObj.id)
                                        .slice(0, 5)
                                        .map(category => (
                                            <Link
                                                key={category.id}
                                                to={`/category/${category.slug}`}
                                                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group"
                                            >
                                                <span className="text-gray-700 group-hover:text-blue-600">{category.name}</span>
                                                <FontAwesomeIcon 
                                                    icon={faChevronRight} 
                                                    className="text-gray-400 group-hover:text-blue-600 text-xs"
                                                />
                                            </Link>
                                        ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <h4 className="font-semibold text-gray-900 mb-4">Vantagens</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faTruck} className="text-blue-600 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Frete Grátis</p>
                                            <p className="text-xs text-gray-500">Acima de R$ 100</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faShieldAlt} className="text-green-600 text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Garantia</p>
                                            <p className="text-xs text-gray-500">30 dias</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Mostrando <span className="font-semibold text-gray-900">{filteredProducts.length}</span> de{' '}
                                <span className="font-semibold text-gray-900">{allProducts.filter(p => String(p.category) === String(currentCategoryObj.id)).length}</span> produtos
                            </p>
                            <div className="flex items-center gap-4">
                                {(filters.search || filters.order || priceRange[1] < 5000) && (
                                    <button
                                        onClick={resetFilters}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                        Limpar filtros
                                    </button>
                                )}
                            </div>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                                    <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-2xl" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum produto encontrado</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    {filters.search ? `Não encontramos produtos para "${filters.search}"` : 
                                     'Tente ajustar os filtros ou explore outras categorias'}
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={resetFilters}
                                        className="px-6 py-2 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800"
                                    >
                                        Limpar Filtros
                                    </button>
                                    <Link
                                        to="/products"
                                        className="px-6 py-2 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
                                    >
                                        Ver Todos
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => {
                                    const mainImg = product.images.find(img => img.main)?.image || product.images[0]?.image;
                                    const isOnWishlist = wishlist.includes(product.id);
                                    const isNew = product.created_at > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); 
                                    const isAdding = addingId === product.id;
                                    return (
                                        <div 
                                            key={product.id} 
                                            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-white">
                                                <Link to={`/product/${product.slug}`}>
                                                    <img 
                                                        className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110" 
                                                        src={`${BASE_URL}${mainImg}`} 
                                                        alt={product.name} 
                                                    />
                                                </Link>
                                                
                                                <div className="absolute top-4 left-4 space-y-2">
                                                    {isNew && (
                                                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                            NOVO
                                                        </div>
                                                    )}
                                                    {product.stock <= 10 && (
                                                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                            ÚLTIMAS UNIDADES
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => toggleWishlist(product.id)}
                                                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                                                        isOnWishlist 
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
                                                <div className="mb-3">
                                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                        {categoriesList.find(c => c.id === product.category)?.name}
                                                    </span>
                                                </div>
                                                
                                                <Link to={`/product/${product.slug}`}>
                                                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                
                                                {product.description && (
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
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
                                                        <span className="text-2xl font-bold text-gray-900">
                                                            R$ {Number(product.price).toFixed(2).replace('.', ',')}
                                                        </span>
                                                        {product.original_price && (
                                                            <p className="text-sm text-gray-500 line-through">
                                                                R$ {Number(product.original_price).toFixed(2).replace('.', ',')}
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
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)}></div>
                    <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
                        <div className="p-6 h-full overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FontAwesomeIcon icon={faTimes} size="lg" />
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">Faixa de Preço</h4>
                                    <div className="space-y-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="5000"
                                            step="100"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between">
                                            <div className="text-sm">
                                                <span className="font-semibold">R$ {priceRange[0].toFixed(2)}</span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-semibold">R$ {priceRange[1].toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">Ordenar por</h4>
                                    <div className="space-y-2">
                                        {[
                                            { value: "", label: "Padrão" },
                                            { value: "price_asc", label: "Preço: Menor → Maior" },
                                            { value: "price_desc", label: "Preço: Maior → Menor" },
                                            { value: "name_asc", label: "Nome A-Z" },
                                            { value: "name_desc", label: "Nome Z-A" },
                                            { value: "popular", label: "Mais Populares" }
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    handleSort(option.value);
                                                    setShowMobileFilters(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 rounded-lg ${filters.order === option.value ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
                                <div className="flex gap-3">
                                    <button
                                        onClick={resetFilters}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
                                    >
                                        Limpar
                                    </button>
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Fuse from "fuse.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartPlus,
    faCircleNotch,
    faXmark,
    faSearch,
    faFilter,
    faSortAmountDown,
    faSortAmountUp,
    faTimes,
    faStar,
    faHeart,
    faEye,
    faChevronRight,
    faChevronLeft,
    faTag,
    faCheck,
    faBolt,
    faFire,
    faCrown,
    faBars,
    faSlidersH
} from "@fortawesome/free-solid-svg-icons";
import { Alert, IconButton, Chip, Drawer } from "@mui/material";
import { BASE_URL } from "../../config";

const ProductsPage = () => {
    const location = useLocation();
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addingId, setAddingId] = useState(null);
    const [snackbars, setSnackbars] = useState([]);
    const [sortOpen, setSortOpen] = useState(false);
    const [wishlist, setWishlist] = useState(new Set());
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [activeSort, setActiveSort] = useState("");
    const [showMobileSort, setShowMobileSort] = useState(false);

    const colors = {
        primary: '#3626a7',
        secondary: '#0d0106',
        accent: '#ff331f',
        background: '#f8f9ff',
        surface: '#ffffff',
        success: '#10b981',
        warning: '#f59e0b'
    };

    const [filters, setFilters] = useState({
        search: new URLSearchParams(location.search).get("search") || "",
        min_price: "",
        max_price: "",
        order: ""
    });

    const addSnackbar = (message, severity) => {
        const id = Date.now();
        setSnackbars((prev) => [...prev, { id, message, severity }]);
        setTimeout(() => {
            setSnackbars(prev => prev.filter(s => s.id !== id));
        }, 3000);
    };

    const toggleWishlist = (productId) => {
        setWishlist(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
                addSnackbar("Removido dos favoritos", "info");
            } else {
                newSet.add(productId);
                addSnackbar("Adicionado aos favoritos", "success");
            }
            return newSet;
        });
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
                addSnackbar(`${product.name} adicionado ao carrinho!`, "success");
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

    useEffect(() => {
        const querySearch = new URLSearchParams(location.search).get("search") || "";
        setFilters(prev => ({ ...prev, search: querySearch }));
    }, [location.search]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/api/products/`);
                const data = await res.json();
                setAllProducts(data);

                const unique = [];
                const seen = new Set();
                data.forEach(p => {
                    if (!seen.has(p.category)) {
                        seen.add(p.category);
                        unique.push({ 
                            id: p.category, 
                            name: p.category_name,
                            productCount: data.filter(item => item.category === p.category).length
                        });
                    }
                });
                setCategories(unique);

                if (data.length > 0) {
                    const prices = data.map(p => parseFloat(p.price));
                    const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100;
                    setPriceRange([0, maxPrice]);
                }
            } catch (err) {
                console.error("Erro:", err);
                addSnackbar("Erro ao carregar produtos", "error");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [BASE_URL]);

    const filteredProducts = useMemo(() => {
        let result = [...allProducts];
        const currentSearch = filters.search?.trim() || "";
        
        if (currentSearch !== "") {
            const fuse = new Fuse(allProducts, {
                keys: [
                    { name: 'name', weight: 2 },
                    { name: 'description', weight: 0.5 },
                    { name: 'category_name', weight: 0.3 }
                ],
                threshold: 0.4,
                includeScore: true,
                minMatchCharLength: 2
            });
            const fuseResults = fuse.search(currentSearch);
            result = fuseResults.map(res => res.item);
        }

        return result
            .filter((product) => {
                const price = parseFloat(product.price);
                const matchPriceRange = price >= priceRange[0] && price <= priceRange[1];
                const matchCategory = selectedCategories.size === 0 || selectedCategories.has(product.category.toString());
                const minStr = (filters.min_price || "").toString().trim();
                const matchMin = (minStr !== "" && !isNaN(parseFloat(minStr))) ? price >= parseFloat(minStr) : true;
                const maxStr = (filters.max_price || "").toString().trim();
                const matchMax = (maxStr !== "" && !isNaN(parseFloat(maxStr))) ? price <= parseFloat(maxStr) : true;
                return matchCategory && matchPriceRange && matchMin && matchMax;
            })
            .sort((a, b) => {
                if (filters.order === "price_asc") return parseFloat(a.price) - parseFloat(b.price);
                if (filters.order === "price_desc") return parseFloat(b.price) - parseFloat(a.price);
                if (filters.order === "name_asc") return a.name.localeCompare(b.name);
                if (filters.order === "name_desc") return b.name.localeCompare(a.name);
                if (filters.order === "popular") return (b.rating || 0) - (a.rating || 0);
                if (filters.order === "newest") return new Date(b.created_at) - new Date(a.created_at);
                return 0;
            });
    }, [allProducts, filters, priceRange, selectedCategories]);

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    const resetFilters = () => {
        setFilters({ search: "", min_price: "", max_price: "", order: "" });
        setPriceRange([0, 5000]);
        setSelectedCategories(new Set());
        setActiveSort("");
    };

    const renderStars = (rating) => {
        if (!rating) return null;
        
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <FontAwesomeIcon 
                        key={i} 
                        icon={faStar} 
                        className="w-3 h-3 text-yellow-400 fill-current" 
                    />
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <FontAwesomeIcon 
                        key={i} 
                        icon={faStar} 
                        className="w-3 h-3 text-yellow-400 fill-current opacity-50" 
                    />
                );
            } else {
                stars.push(
                    <FontAwesomeIcon 
                        key={i} 
                        icon={faStar} 
                        className="w-3 h-3 text-gray-300" 
                    />
                );
            }
        }
        return stars;
    };

    const sortOptions = [
        { value: "", label: "Padrão", icon: faBolt },
        { value: "price_asc", label: "Preço: Menor → Maior", icon: faSortAmountUp },
        { value: "price_desc", label: "Preço: Maior → Menor", icon: faSortAmountDown },
        { value: "popular", label: "Mais Populares", icon: faFire },
        { value: "newest", label: "Mais Recentes", icon: faCrown },
        { value: "name_asc", label: "Nome A-Z", icon: faTag },
        { value: "name_desc", label: "Nome Z-A", icon: faTag }
    ];

    const activeSortOption = sortOptions.find(opt => opt.value === filters.order) || sortOptions[0];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
           

            <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
                {snackbars.map((snack) => (
                    <div key={snack.id} className="pointer-events-auto products-page-slide-in">
                        <Alert
                            severity={snack.severity}
                            variant="filled"
                            sx={{
                                borderRadius: '12px',
                                fontWeight: 500,
                                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                backgroundColor: snack.severity === 'success' ? colors.primary : 
                                               snack.severity === 'warning' ? colors.warning : undefined
                            }}
                            action={
                                <IconButton
                                    size="small"
                                    color="inherit"
                                    onClick={() => setSnackbars(prev => prev.filter(s => s.id !== snack.id))}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </IconButton>
                            }
                        >
                            {snack.message}
                        </Alert>
                    </div>
                ))}
            </div>

            

            <div className="md:pt-[170px] pt-[100px] max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Limpar tudo
                                </button>
                            </div>

                            <div className="mb-8">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faTag} className="text-blue-500 text-sm" />
                                    Faixa de Preço
                                </h4>
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
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm">
                                            <span className="font-semibold text-gray-900">R$ {priceRange[0].toFixed(2)}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-semibold text-gray-900">R$ {priceRange[1].toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faBolt} className="text-purple-500 text-sm" />
                                    Categorias
                                </h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {categories.map(category => (
                                        <button
                                            key={category.id}
                                            onClick={() => toggleCategory(category.id.toString())}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-50 ${
                                                selectedCategories.has(category.id.toString()) 
                                                    ? 'bg-blue-50 border border-blue-100' 
                                                    : 'border border-gray-100'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                                                    selectedCategories.has(category.id.toString())
                                                        ? 'bg-blue-500 text-white'
                                                        : 'border border-gray-300'
                                                }`}>
                                                    {selectedCategories.has(category.id.toString()) && (
                                                        <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{category.name}</span>
                                            </div>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                {category.productCount}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faFire} className="text-orange-500 text-sm" />
                                    Mais Procurados
                                </h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, order: "newest" }))}
                                        className={`w-full text-left p-3 rounded-xl transition-all hover:bg-gray-50 ${
                                            filters.order === "newest" ? 'bg-blue-50 border border-blue-100' : 'border border-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <FontAwesomeIcon icon={faBolt} className="text-yellow-500" />
                                            <span className="text-sm font-medium text-gray-700">Novidades</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, order: "popular" }))}
                                        className={`w-full text-left p-3 rounded-xl transition-all hover:bg-gray-50 ${
                                            filters.order === "popular" ? 'bg-blue-50 border border-blue-100' : 'border border-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <FontAwesomeIcon icon={faCrown} className="text-purple-500" />
                                            <span className="text-sm font-medium text-gray-700">Mais Populares</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="lg:hidden mb-6">
                            <div className="flex items-center justify-between gap-3">
                                <button
                                    onClick={() => setMobileFiltersOpen(true)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                                >
                                    <FontAwesomeIcon icon={faFilter} />
                                    <span className="font-medium">Filtros</span>
                                    {(selectedCategories.size > 0 || priceRange[1] < 5000) && (
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                </button>

                                <button
                                    onClick={() => setShowMobileSort(true)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                                >
                                    <FontAwesomeIcon icon={faSortAmountDown} />
                                    <span className="font-medium">Ordenar</span>
                                    {filters.order && (
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="hidden lg:flex flex-col md:flex-row gap-4 mb-8">
                            <div className="flex-1 flex items-center gap-4">
                                <div className="relative">
                                    <button
                                        onClick={() => setSortOpen(!sortOpen)}
                                        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={filters.order.includes('price_desc') ? faSortAmountUp : faSortAmountDown} />
                                        <span>
                                            {filters.order === "price_asc" ? "Preço: Menor → Maior" :
                                             filters.order === "price_desc" ? "Preço: Maior → Menor" :
                                             filters.order === "name_asc" ? "Nome A-Z" :
                                             filters.order === "name_desc" ? "Nome Z-A" :
                                             filters.order === "popular" ? "Mais Populares" :
                                             filters.order === "newest" ? "Mais Recentes" :
                                             "Ordenar por"}
                                        </span>
                                        <FontAwesomeIcon icon={faChevronRight} className={`transition-transform ${sortOpen ? 'rotate-90' : ''}`} />
                                    </button>
                                    
                                    {sortOpen && (
                                        <div className="absolute z-50 top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-2">
                                            {sortOptions.map(option => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => { 
                                                        setFilters(prev => ({ ...prev, order: option.value })); 
                                                        setSortOpen(false); 
                                                    }}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <FontAwesomeIcon icon={option.icon} />
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-900">{filteredProducts.length}</span> de{' '}
                                    <span className="font-semibold text-gray-900">{allProducts.length}</span> produtos
                                </div>
                                {(filters.search || filters.order || priceRange[1] < 5000 || selectedCategories.size > 0) && (
                                    <button
                                        onClick={resetFilters}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                        Limpar
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mb-6 lg:hidden">
                            {(selectedCategories.size > 0 || filters.order || priceRange[1] < 5000) && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedCategories.size > 0 && (
                                        <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                            {selectedCategories.size} categoria(s)
                                        </span>
                                    )}
                                    {filters.order && (
                                        <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                                            {activeSortOption.label}
                                        </span>
                                    )}
                                    {priceRange[1] < 5000 && (
                                        <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                            Até R$ {priceRange[1].toFixed(2)}
                                        </span>
                                    )}
                                    <button
                                        onClick={resetFilters}
                                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Limpar tudo
                                    </button>
                                </div>
                            )}
                        </div>

                        <main>
                            {loading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-xl md:rounded-2xl p-4 border border-gray-100 animate-pulse">
                                            <div className="aspect-square bg-gray-200 rounded-lg md:rounded-xl mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 md:py-24 bg-white rounded-xl md:rounded-2xl border-2 border-dashed border-gray-200 text-center px-4 products-page-scale-in">
                                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 md:mb-6">
                                        <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-xl md:text-2xl" />
                                    </div>
                                    <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">Nenhum produto encontrado</h3>
                                    <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-md mx-auto">
                                        {filters.search 
                                            ? `Não encontramos resultados para "${filters.search}"` 
                                            : 'Tente ajustar os filtros para encontrar o que procura.'}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                        <button
                                            onClick={resetFilters}
                                            className="px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90"
                                        >
                                            Limpar Filtros
                                        </button>
                                        <Link
                                            to="/categories"
                                            className="px-5 md:px-6 py-2.5 md:py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
                                        >
                                            Explorar Categorias
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                    {filteredProducts.map((product, index) => {
                                        const mainImg = product.images.find(img => img.main)?.image || product.images[0]?.image;
                                        const isAdding = addingId === product.id;
                                        const isInWishlist = wishlist.has(product.id);
                                        const isNew = product.created_at > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

                                        return (
                                            <div 
                                                key={product.id}
                                                className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 md:hover:-translate-y-1 products-page-fade-in"
                                                style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}
                                            >
                                                <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                                                    <Link to={`/product/${product.slug}`}>
                                                        <img
                                                            className="w-full h-full object-contain p-3 md:p-4 transition-transform duration-500 group-hover:scale-105 md:group-hover:scale-110"
                                                            src={`${BASE_URL}${mainImg}`}
                                                            alt={product.name}
                                                        />
                                                    </Link>
                                                    
                                                    <div className="absolute top-2 md:top-4 left-2 md:left-4 space-y-1 md:space-y-2">
                                                        {isNew && (
                                                            <div className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-bold">
                                                                NOVO
                                                            </div>
                                                        )}
                                                        {product.stock <= 10 && product.stock > 0 && (
                                                            <div className="px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-xs font-bold">
                                                                {product.stock} UNID.
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => toggleWishlist(product.id)}
                                                        className={`absolute top-2 md:top-4 right-2 md:right-4 w-8 h-8 md:w-10 md:h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                                                            isInWishlist 
                                                                ? 'bg-red-500/20 text-red-500' 
                                                                : 'bg-white/80 text-gray-600 hover:text-red-500'
                                                        }`}
                                                    >
                                                        <FontAwesomeIcon 
                                                            icon={faHeart} 
                                                            className={`${isInWishlist ? 'fill-current' : ''} text-sm md:text-base`}
                                                        />
                                                    </button>

                                                    {product.discount > 0 && (
                                                        <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4">
                                                            <div className="px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-xs md:text-sm font-bold shadow">
                                                                -{product.discount}%
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-3 md:p-5">
                                                    <div className="hidden md:block mb-2">
                                                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                                            {product.category_name}
                                                        </span>
                                                    </div>

                                                    <Link to={`/product/${product.slug}`}>
                                                        <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 md:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                            {product.name}
                                                        </h3>
                                                    </Link>

                                                    <div className="mb-2 md:mb-3">
                                                        <div className="flex items-center gap-1 md:gap-2">
                                                            <div className="flex items-center gap-0.5 md:gap-1">
                                                                {renderStars(product.rating || 4.5)}
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                {(product.rating || 4.5).toFixed(1)} ({product.rating_count || 0})
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 md:mb-4">
                                                        <div className="flex items-center gap-1 md:gap-2">
                                                            <span className="text-lg md:text-xl font-bold text-gray-900">
                                                                R$ {Number(product.price).toFixed(2).replace('.', ',')}
                                                            </span>
                                                            {product.original_price && (
                                                                <span className="text-xs md:text-sm text-gray-500 line-through">
                                                                    R$ {Number(product.original_price).toFixed(2).replace('.', ',')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {product.installments && (
                                                            <p className="text-xs text-gray-600 mt-0.5">
                                                                ou {product.installments}x de R$ {(product.price / product.installments).toFixed(2).replace('.', ',')}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        disabled={isAdding}
                                                        className={`w-full py-2 md:py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base ${
                                                            isAdding
                                                                ? 'bg-blue-100 text-blue-600'
                                                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 active:scale-95'
                                                        }`}
                                                    >
                                                        {isAdding ? (
                                                            <>
                                                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-xs md:text-sm" />
                                                                <span>Adicionando...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FontAwesomeIcon icon={faCartPlus} className="text-xs md:text-sm" />
                                                                <span>Adicionar</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </main>

                        {filteredProducts.length > 0 && filteredProducts.length < allProducts.length && (
                            <div className="mt-8 md:mt-12 text-center">
                                <button className="px-6 md:px-8 py-2.5 md:py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm md:text-base">
                                    Carregar mais produtos
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Drawer
                anchor="left"
                open={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '85%',
                        maxWidth: '320px',
                        padding: '1.5rem'
                    }
                }}
            >
                <div className="h-full overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
                        <button
                            onClick={() => setMobileFiltersOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FontAwesomeIcon icon={faTimes} size="lg" />
                        </button>
                    </div>

                    <div className="mb-8">
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

                    <div className="mb-8">
                        <h4 className="font-semibold text-gray-900 mb-4">Categorias</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => toggleCategory(category.id.toString())}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-50 ${
                                        selectedCategories.has(category.id.toString()) 
                                            ? 'bg-blue-50 border border-blue-100' 
                                            : 'border border-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                                            selectedCategories.has(category.id.toString())
                                                ? 'bg-blue-500 text-white'
                                                : 'border border-gray-300'
                                        }`}>
                                            {selectedCategories.has(category.id.toString()) && (
                                                <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {category.productCount}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-200">
                        <div className="flex gap-3">
                            <button
                                onClick={resetFilters}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 text-sm"
                            >
                                Limpar
                            </button>
                            <button
                                onClick={() => setMobileFiltersOpen(false)}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 text-sm"
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            </Drawer>

            <Drawer
                anchor="bottom"
                open={showMobileSort}
                onClose={() => setShowMobileSort(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px',
                        padding: '1.5rem'
                    }
                }}
            >
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Ordenar por</h3>
                        <button
                            onClick={() => setShowMobileSort(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FontAwesomeIcon icon={faTimes} size="lg" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {sortOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => { 
                                    setFilters(prev => ({ ...prev, order: option.value })); 
                                    setShowMobileSort(false); 
                                }}
                                className={`w-full text-left p-4 rounded-xl transition-all ${
                                    filters.order === option.value 
                                        ? 'bg-blue-50 border border-blue-100' 
                                        : 'hover:bg-gray-50 border border-gray-100'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={option.icon} className="text-gray-400" />
                                    <span className="font-medium text-gray-700">{option.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default ProductsPage;
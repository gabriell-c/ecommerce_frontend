import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faShoppingBag, 
    faPlus, 
    faMinus, 
    faTrashAlt, 
    faLock, 
    faCircleNotch,
    faTruck,
    faShieldAlt,
    faCreditCard,
    faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../../config';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRemoving, setIsRemoving] = useState(null);
    const [productsAPI, setProductsAPI] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/products/`);
            if (response.ok) {
                const data = await response.json();
                setProductsAPI(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const colors = {
        primary: '#3626a7',
        secondary: '#0d0106',
        background: '#f8f9ff',
        surface: '#ffffff',
        accent: '#ff331f',
        success: '#10b981',
        muted: '#6b7280'
    };

    const token = localStorage.getItem('access');

    const fetchCart = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/cart/my-cart/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCart(data);
            }
        } catch (error) {
            console.error("Erro ao carregar carrinho", error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            const response = await fetch(`${BASE_URL}/api/cart/items/${itemId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: newQuantity })
            });
            if (response.ok) fetchCart();
        } catch (error) {
            console.error("Erro ao atualizar", error);
        }
    };

    const removeItem = async (itemId) => {
        setIsRemoving(itemId);
        try {
            const response = await fetch(`${BASE_URL}/api/cart/items/${itemId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setTimeout(() => {
                    fetchCart();
                    setIsRemoving(null);
                }, 300);
            } else {
                setIsRemoving(null);
            }
        } catch (error) {
            console.error("Erro ao remover", error);
            setIsRemoving(null);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            // Executa as duas buscas ao mesmo tempo para ganhar performance
            await Promise.all([fetchCart(), fetchProducts()]);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f9ff] to-[#f0f2ff]">
                <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-6">
                        <FontAwesomeIcon 
                            icon={faCircleNotch} 
                            spin 
                            size="2xl" 
                            style={{ color: colors.primary }} 
                        />
                    </div>
                </div>
                <p className="text-gray-500 font-medium">Carregando seu carrinho...</p>
            </div>
        );
    }

    const items = cart?.items || [];

    const BRL = (value) => {
        const formatador = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',   
            minimumFractionDigits: 2, 
        });
        return formatador.format(value || 0);
    };

    // Cálculo do total com segurança para lista vazia
    const totalCart = items.length > 0 
        ? items.reduce((total, item) => total + (item.subtotal || 0), 0)
        : 0;

    return (
        <div className="md:pt-[136px] pt-[73px] w-full min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#f0f2ff]">
            <div className="top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <Link 
                            to="/products" 
                            className="group flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                                <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
                            </div>
                            <span className="font-medium hidden sm:block">Continuar comprando</span>
                        </Link>
                        
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Meu Carrinho
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                {items.length} {items.length === 1 ? 'item' : 'itens'}
                            </p>
                        </div>
                        
                        <div className="w-10"></div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative mb-8">
                            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-xl flex items-center justify-center">
                                <FontAwesomeIcon 
                                    icon={faShoppingBag} 
                                    size="4x" 
                                    className="text-gray-300"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                <span className="text-white text-2xl">?</span>
                            </div>
                        </div>
                        
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                            Seu carrinho está vazio
                        </h2>
                        <p className="text-gray-500 text-center max-w-md mb-8">
                            Parece que você ainda não adicionou nenhum produto ao carrinho. 
                            Vamos encontrar algo especial para você!
                        </p>
                        
                        <Link 
                            to="/products" 
                            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <span className="relative z-10">Explorar Produtos</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                            <FontAwesomeIcon 
                                icon={faArrowRight} 
                                className="ml-3 relative z-10 group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="space-y-4">
                                {items.map((item) => {
                                    const produtoEncontrado = productsAPI.find(u => Number(u.id) === Number(item.product));

                                    return(
                                    <div 
                                        key={item.id}
                                        className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 ${
                                            isRemoving === item.id ? 'opacity-50 scale-95' : ''
                                        }`}
                                    >
                                        <div className="flex flex-col sm:flex-row gap-6">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 overflow-hidden">
                                                    <img 
                                                        src={`${BASE_URL}${item.product_image}`}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-contain p-3 transform hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                {item.quantity > 1 && (
                                                    <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                                                        <span className="text-white text-xs font-bold">
                                                            {item.quantity}x
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                    <div className="flex-grow">
                                                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight hover:text-[var(--color3)]">
                                                            <Link to={`/product/${produtoEncontrado?.slug || '#'}`} >
                                                                {item.product_name}
                                                            </Link>
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mb-4">
                                                            Código: {item.id}
                                                        </p>
                                                        
                                                        <div className="flex items-center gap-4">
                                                            <div className="inline-flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                                                                <button 
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-700 hover:text-gray-900"
                                                                >
                                                                    <FontAwesomeIcon icon={faMinus} size="xs" />
                                                                </button>
                                                                <span className="w-12 text-center font-bold text-gray-900">
                                                                    {item.quantity}
                                                                </span>
                                                                <button 
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-all text-gray-700 hover:text-gray-900"
                                                                >
                                                                    <FontAwesomeIcon icon={faPlus} size="xs" />
                                                                </button>
                                                            </div>
                                                            
                                                            <div onClick={() => removeItem(item.id)} className="flex justify-center items-center p-4">
                                                                <button 
                                                                    disabled={isRemoving === item.id}
                                                                    className="delete-btn w-12 h-12 rounded-full bg-gray-900 border-none font-semibold flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 overflow-hidden relative hover:bg-red-500 hover:w-36 hover:rounded-[50px]"
                                                                >
                                                                    <svg 
                                                                        viewBox="0 0 448 512" 
                                                                        className="delete-btn__icon w-3 transition-all duration-300"
                                                                    >
                                                                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" 
                                                                            className="fill-white"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="mb-2">
                                                            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">
                                                                Preço unitário
                                                            </span>
                                                            <span className="text-lg font-bold text-gray-900">
                                                                {BRL(item.product_price)}
                                                            </span>
                                                        </div>
                                                        <div className="pt-4 border-t">
                                                            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">
                                                                Subtotal
                                                            </span>
                                                            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--color3)] to-[var(--color5)] bg-clip-text text-transparent">
                                                                {BRL(item.subtotal)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-28">
                                <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                            <FontAwesomeIcon icon={faCreditCard} />
                                            Resumo do Pedido
                                        </h2>
                                    </div>

                                    <div className="p-6">
                                        <div className="space-y-4 mb-6">
                                            <div className="flex justify-between items-center py-3">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span className="font-semibold text-gray-900">
                                                    {BRL(totalCart)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center py-3 border-t border-gray-100">
                                                <span className="text-gray-600">Descontos</span>
                                                <span className="font-semibold text-green-600">
                                                    R$ 0,00
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 mb-6 border border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="text-sm text-gray-500 block mb-1">Total</span>
                                                    <span className="text-2xl font-bold text-gray-900">
                                                        {BRL(totalCart)}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs text-gray-400 block mb-1">
                                                        {items.length} {items.length === 1 ? 'item' : 'itens'}
                                                    </span>
                                                    <span className="text-sm text-green-600 font-semibold">
                                                        Economize R$ 0,00
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            className="group relative w-full bg-gradient-to-r from-[var(--color3)] to-[var(--color5)] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color5)] to-[var(--color3)] opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                <FontAwesomeIcon icon={faLock} />
                                                Finalizar Compra
                                                <FontAwesomeIcon 
                                                    icon={faArrowRight} 
                                                    className="group-hover:translate-x-1 transition-transform"
                                                />
                                            </span>
                                        </button>

                                        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                                                <FontAwesomeIcon icon={faShieldAlt} />
                                                <span>Compra 100% segura</span>
                                            </div>
                                            <p className="text-xs text-gray-400">
                                                Seus dados estão protegidos com criptografia SSL
                                            </p>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <p className="text-sm text-gray-500 mb-3 text-center">Métodos de pagamento</p>
                                            <div className="flex justify-center gap-4">
                                                <div className="w-12 h-8 bg-gradient-to-r from-blue-50 to-white rounded-md border border-gray-200 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-blue-600">VISA</span>
                                                </div>
                                                <div className="w-12 h-8 bg-gradient-to-r from-red-50 to-white rounded-md border border-gray-200 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-red-600">MC</span>
                                                </div>
                                                <div className="w-12 h-8 bg-gradient-to-r from-green-50 to-white rounded-md border border-gray-200 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-green-600">PIX</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link 
                                    to="/products" 
                                    className="mt-4 block text-center text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors group"
                                >
                                    <span className="group-hover:underline">Adicionar mais itens</span>
                                    <FontAwesomeIcon 
                                        icon={faArrowRight} 
                                        className="ml-2 group-hover:translate-x-1 transition-transform"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
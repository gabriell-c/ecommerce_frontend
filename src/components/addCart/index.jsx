import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCircleNotch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { BASE_URL } from '../../config';

const AddToCartButton = ({ productId, productName }) => {
    const [loading, setLoading] = useState(false);
    const [snackbars, setSnackbars] = useState([]);

    const colors = {
        color3: '#3626a7',
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access');

        if (!token) {
            addSnackbar('Por favor, faça login!', 'error');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/cart/items/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product: productId, quantity: 1 })
            });

            if (response.ok) {
                addSnackbar(`${productName} adicionado ao carrinho!`, 'success');
            } else {
                addSnackbar('Erro ao adicionar item.', 'error');
            }
        } catch (error) {
            addSnackbar('Erro de conexão.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const addSnackbar = (message, severity) => {
        const id = Date.now();
        setSnackbars((prev) => [...prev, { id, message, severity }]);
        
        setTimeout(() => {
            removeSnackbar(id);
        }, 3000);
    };

    const removeSnackbar = (id) => {
        setSnackbars((prev) => prev.filter(snack => snack.id !== id));
    };

    return (
        <>
            <button
                onClick={handleAddToCart}
                disabled={loading}
                className="w-full py-3 flex items-center justify-center gap-2 font-bold rounded-xl text-white transition-all active:scale-95 disabled:opacity-70 shadow-lg"
                style={{ backgroundColor: colors.color3 }}
            >
                
                {loading ? (
                    <FontAwesomeIcon icon={faCircleNotch} spin />
                ) : (
                    <>
                        <FontAwesomeIcon icon={faCartPlus} />
                        <span>ADICIONAR</span>
                    </>
                )}
            </button>

            <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
                {snackbars.map((snack, index) => (
                    <div key={snack.id} className="pointer-events-auto animate-fade-in-right">
                        <Alert 
                            severity={snack.severity}
                            variant="filled"
                            style={{ 
                                backgroundColor: snack.severity === 'success' ? colors.color3 : undefined,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                            action={
                                <IconButton
                                    size="small"
                                    color="inherit"
                                    onClick={() => removeSnackbar(snack.id)}
                                >
                                    <FontAwesomeIcon icon={faXmark} size="xs" />
                                </IconButton>
                            }
                        >
                            {snack.message}
                        </Alert>
                    </div>
                ))}
            </div>

           
        </>
    );
};

export default AddToCartButton;
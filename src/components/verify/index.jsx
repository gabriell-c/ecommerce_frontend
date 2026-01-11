import { useState, useEffect } from 'react';

export default function useAuthCheck() {
    const getAuthState = () => {
        const token = localStorage.getItem("access");
        return !!(token && token !== "undefined" && token !== "null");
    };

    const [isLogged, setIsLogged] = useState(getAuthState());

    useEffect(() => {
        const checkStorage = () => {
            setIsLogged(getAuthState());
        };

        window.addEventListener('storage', checkStorage);

        window.addEventListener('authChange', checkStorage);

        window.addEventListener('focus', checkStorage);

        return () => {
            window.removeEventListener('storage', checkStorage);
            window.removeEventListener('authChange', checkStorage);
            window.removeEventListener('focus', checkStorage);
        };
    }, []);

    return isLogged;
}
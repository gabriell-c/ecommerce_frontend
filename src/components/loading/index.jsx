import React, { useState, useEffect } from 'react';

const Loading = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setVisible(false);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
        
        <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 border-r-orange-500 rounded-full animate-spin"></div>
      </div>

      <span className="mt-6 text-[10px] font-bold tracking-[0.5em] text-gray-400 uppercase">
        Carregando
      </span>
    </div>
  );
};

export default Loading;
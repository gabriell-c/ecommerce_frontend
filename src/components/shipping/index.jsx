import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';

const ProductOverview = () => {
  const [shippingZipCode, setShippingZipCode] = useState('');
  const [shippingQuote, setShippingQuote] = useState(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  const formatCEP = (value) => {
    const cep = value.replace(/\D/g, '');
    if (cep.length <= 5) return cep;
    return `${cep.substring(0, 5)}-${cep.substring(5, 8)}`;
  };

  const handleCEPChange = (e) => {
    const formattedValue = formatCEP(e.target.value);
    setShippingZipCode(formattedValue);
  };

  const calculateShipping = () => {
    const cep = shippingZipCode.replace(/\D/g, '');
    
    if (cep.length !== 8) {
      setShippingQuote({ 
        error: "Por favor, digite um CEP válido com 8 dígitos." 
      });
      return;
    }

    setLoadingShipping(true);
    
    setTimeout(() => {
      const prefixo = cep[0];
      let servicos = [];

      if (prefixo === '0' || prefixo === '1') {
        servicos = [
          { 
            id: 1, 
            name: "Express Local", 
            deadline: "1 a 2 dias úteis", 
            price: "12,90",
            description: "Entrega rápida para sua região"
          },
          { 
            id: 2, 
            name: "Padrão", 
            deadline: "3 a 5 dias úteis", 
            price: "8,50",
            description: "Entrega econômica"
          }
        ];
      } else if (['2', '3'].includes(prefixo)) {
        servicos = [
          { 
            id: 1, 
            name: "Express Sudeste", 
            deadline: "3 a 4 dias úteis", 
            price: "24,90",
            description: "Entregas rápidas para o Sudeste"
          },
          { 
            id: 2, 
            name: "Padrão", 
            deadline: "6 a 8 dias úteis", 
            price: "18,00",
            description: "Cobertura regional"
          }
        ];
      } else {
        servicos = [
          { 
            id: 1, 
            name: "Express Nacional", 
            deadline: "5 a 7 dias úteis", 
            price: "35,00",
            description: "Entrega expressa para todo Brasil"
          },
          { 
            id: 2, 
            name: "Padrão", 
            deadline: "10 a 12 dias úteis", 
            price: "26,50",
            description: "Entrega para todo o território nacional"
          }
        ];
      }

      setShippingQuote({ services: servicos });
      setLoadingShipping(false);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      calculateShipping();
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 rounded-lg">
            <FontAwesomeIcon 
              icon={faTruck} 
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#3626a7]" 
            />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              Calcular Frete
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Consulte prazos e valores para sua região
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digite seu CEP
              </label>
              <input
                type="text"
                placeholder="00000-000"
                value={shippingZipCode}
                onChange={handleCEPChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-[#3626a7] focus:outline-none focus:ring-2 focus:ring-[#3626a7] focus:ring-opacity-20"
                maxLength={9}
              />
            </div>
            
            <div className="flex flex-col justify-end">
              <button
                onClick={calculateShipping}
                disabled={loadingShipping || !shippingZipCode}
                className="px-6 py-3 bg-[#3626a7] text-white rounded-lg sm:rounded-xl font-medium hover:bg-[#2a1f8c] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 whitespace-nowrap"
              >
                {loadingShipping ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculando...
                  </span>
                ) : 'Calcular'}
              </button>
            </div>
          </div>

          {shippingQuote && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg sm:rounded-xl animate-in fade-in duration-300">
              {shippingQuote.error ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">{shippingQuote.error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    Opções de entrega:
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shippingQuote.services?.map((service) => (
                      <div 
                        key={service.id} 
                        className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#3626a7] transition-colors duration-200"
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-bold text-gray-800 text-lg">
                              {service.name}
                            </h5>
                            <span className="text-xl font-bold text-[#3626a7]">
                              R$ {service.price}
                            </span>
                          </div>
                          
                          {service.description && (
                            <p className="text-gray-600 text-sm mb-3">
                              {service.description}
                            </p>
                          )}
                          
                          <div className="mt-auto">
                            <p className="text-sm text-gray-600 italic">
                              📅 Entrega em {service.deadline}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-gray-700">
                  <span className="text-lg">✈️</span>
                  <span className="text-sm">Todo Brasil</span>
                </div>
              </div>
              
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-gray-700">
                  <span className="text-lg">📦</span>
                  <span className="text-sm">10 dias úteis</span>
                </div>
              </div>
              
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-gray-700">
                  <span className="text-lg">🔒</span>
                  <span className="text-sm">Compra segura</span>
                </div>
              </div>
              
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-gray-700">
                  <span className="text-lg">💬</span>
                  <span className="text-sm">Suporte</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <p className="text-sm text-gray-700 text-center sm:text-left">
                🎁 <strong>Frete grátis</strong> em compras acima de R$ 300
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductOverview;
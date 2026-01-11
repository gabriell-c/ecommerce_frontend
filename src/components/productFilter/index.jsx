import React from "react";
import { useLocation } from "react-router-dom";

const ProductFilters = ({ categories, onChange }) => {

  const location = useLocation();
  const urlPath = location.pathname;

  const keyCategory = urlPath.includes('category');

  const handleFilterChange = (e) => {
    const form = e.target.closest("form");
    const formData = new FormData(form);
    
    const rawMin = formData.get("min_price");
    const rawMax = formData.get("max_price");

    const updatedFilters = {
      category: formData.get("category"),
      min_price: rawMin.replace(",", "."), 
      max_price: rawMax.replace(",", "."),
      order: formData.get("order"),
    };
    
    onChange(updatedFilters);
  };

  return (
    <form className="grid lg:flex sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
        {!keyCategory && (
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
                <select name="category" onChange={handleFilterChange} className="bg-gray-50 border-none rounded-xl p-3.5 text-sm font-bold focus:ring-2 focus:ring-[#3626a7] cursor-pointer">
                <option value="">Todas as Categorias</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
                </select>
            </div>
        )}
      

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mínimo (R$)</label>
        <input 
          name="min_price" 
          type="text" 
          placeholder="0,00" 
          onChange={handleFilterChange} 
          className="bg-gray-50 border-none rounded-xl p-3.5 text-sm font-bold focus:ring-2 focus:ring-[#3626a7]" 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Máximo (R$)</label>
        <input 
          name="max_price" 
          type="text" 
          placeholder="9999,00" 
          onChange={handleFilterChange} 
          className="bg-gray-50 border-none rounded-xl p-3.5 text-sm font-bold focus:ring-2 focus:ring-[#3626a7]" 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ordenar</label>
        <select name="order" onChange={handleFilterChange} className="bg-gray-50 border-none rounded-xl p-3.5 text-sm font-bold focus:ring-2 focus:ring-[#3626a7] cursor-pointer">
          <option value="">Padrão</option>
          <option value="price_asc">Menor Preço</option>
          <option value="price_desc">Maior Preço</option>
        </select>
      </div>
    </form>
  );
};

export default ProductFilters;
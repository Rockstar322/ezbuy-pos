import React from 'react';
import { Scale, ShoppingBag, CupSoda, Cookie, Milk, Box, Check } from 'lucide-react';

export const BENTO_CATEGORIES = [
  {
    id: 'A Granel / Peso',
    name: 'A Granel / Peso',
    shortName: 'A Granel',
    bgColor: '#34D399', // Verde Menta
    bgTailwind: 'bg-[#34D399]',
    icon: Scale,
  },
  {
    id: 'Abarrotes',
    name: 'Abarrotes',
    shortName: 'Abarrotes',
    bgColor: '#FBBF24', // Ámbar Suave
    bgTailwind: 'bg-[#FBBF24]',
    icon: ShoppingBag,
  },
  {
    id: 'Bebidas y Licores',
    name: 'Bebidas y Licores',
    shortName: 'Bebidas',
    bgColor: '#F87171', // Coral Suave
    bgTailwind: 'bg-[#F87171]',
    icon: CupSoda,
  },
  {
    id: 'Snacks y Galletas',
    name: 'Snacks y Galletas',
    shortName: 'Snacks',
    bgColor: '#A3E635', // Verde Lima
    bgTailwind: 'bg-[#A3E635]',
    icon: Cookie,
  },
  {
    id: 'Lácteos y Embutidos',
    name: 'Lácteos y Embutidos',
    shortName: 'Lácteos',
    bgColor: '#FB923C', // Naranja Pastel
    bgTailwind: 'bg-[#FB923C]',
    icon: Milk,
  },
  {
    id: 'Enlatados y Conservas',
    name: 'Enlatados y Conservas',
    shortName: 'Conservas',
    bgColor: '#94A3B8', // Gris Azulado Claro
    bgTailwind: 'bg-[#94A3B8]',
    icon: Box,
  },
];

export function BentoCategories({ selectedCategory, onSelectCategory }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Categorías de Tienda
        </h3>
        {selectedCategory !== 'Todos' && (
          <button
            type="button"
            onClick={() => onSelectCategory('Todos')}
            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Ver todos los productos
          </button>
        )}
      </div>

      {/* Grid de 3 Columnas Bento Pastel */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3">
        {BENTO_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(isSelected ? 'Todos' : cat.id)}
              className="group flex flex-col items-center text-center focus:outline-none transition-transform active:scale-95 cursor-pointer"
            >
              {/* Tarjeta Bento con Bordes Redondeados rounded-2xl y Barra Blanca */}
              <div
                style={{ backgroundColor: cat.bgColor }}
                className={`relative w-full aspect-square max-w-[110px] rounded-2xl flex flex-col items-center justify-center p-3 shadow-sm group-hover:shadow-md transition-all ${
                  isSelected ? 'ring-3 ring-emerald-600 ring-offset-2 scale-102 shadow-lg' : ''
                }`}
              >
                {/* Ícono Vectorial Blanco al Centro */}
                <Icon className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-[1.8] drop-shadow-sm mb-1.5" />

                {/* Pequeña barra horizontal decorativa blanca debajo */}
                <div className="w-8 h-1 bg-white/80 rounded-full shadow-xs"></div>

                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Título de la Categoría debajo en texto limpio */}
              <span
                className={`text-[11px] sm:text-xs font-bold mt-1.5 line-clamp-1 leading-tight ${
                  isSelected ? 'text-emerald-700' : 'text-slate-700 group-hover:text-slate-900'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

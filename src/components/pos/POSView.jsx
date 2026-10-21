import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Zap, 
  Scale, 
  Plus, 
  Camera, 
  Barcode, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Check,
  ShoppingBag,
  Box,
  CupSoda,
  Cookie,
  Milk,
  Package
} from 'lucide-react';
import { BentoCategories } from './BentoCategories';
import { CartSummary } from './CartSummary';
import { BarcodeStickerModal } from './BarcodeStickerModal';
import { formatCurrency } from '../../utils/receiptGenerator';
import { soundFX } from '../../utils/audio';

export function POSView({
  products = [],
  cart = [],
  onAddToCart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onProceedCheckout,
  discount,
  onSetDiscount,
  viewMode = 'auto',
  lastScanned,
  isLaserActive,
  isScanningActive,
  onSimulateBarcode,
  onOpenGranel,
  onOpenCamera,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showDemoAccordion, setShowDemoAccordion] = useState(false);
  const [isStickerModalOpen, setIsStickerModalOpen] = useState(false);

  // Filtrado de productos por categoría y buscador
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.barcode.includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Productos a granel disponibles para el modal
  const granelProducts = useMemo(() => {
    return products.filter((p) => p.isGranel || p.category === 'A Granel / Peso');
  }, [products]);

  // Selección de ícono vectorial limpio según tipo o categoría (sin emojis)
  const renderProductVectorIcon = (product) => {
    if (product.isGranel || product.category === 'A Granel / Peso') {
      return <Scale className="w-5 h-5 text-emerald-600 stroke-[1.8]" />;
    }
    if (product.category === 'Bebidas y Licores') {
      return <CupSoda className="w-5 h-5 text-rose-500 stroke-[1.8]" />;
    }
    if (product.category === 'Snacks y Galletas') {
      return <Cookie className="w-5 h-5 text-lime-600 stroke-[1.8]" />;
    }
    if (product.category === 'Lácteos y Embutidos') {
      return <Milk className="w-5 h-5 text-orange-500 stroke-[1.8]" />;
    }
    if (product.category === 'Enlatados y Conservas') {
      return <Box className="w-5 h-5 text-slate-500 stroke-[1.8]" />;
    }
    return <Package className="w-5 h-5 text-amber-500 stroke-[1.8]" />;
  };

  const handleProductCardClick = (product) => {
    if (product.isGranel) {
      if (onOpenGranel) onOpenGranel();
    } else {
      soundFX.playScanBeep();
      onAddToCart(product);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Buscador en Píldora (Search Pill Blanco con Sombra Suave) */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-slate-400 stroke-[2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ingrese nombre de producto o escanee código"
            className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm pl-11 pr-11 py-3 rounded-full border border-slate-200/90 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15 transition-all"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenCamera}
              className="absolute right-3 w-7 h-7 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Escanear con cámara"
            >
              <Camera className="w-4 h-4 stroke-[1.8]" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Tarjetas de Categorías (Estilo Bento Pastel / Vibrante Limpio en 3 Columnas) */}
      <BentoCategories
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (cat === 'A Granel / Peso') {
            if (onOpenGranel) onOpenGranel();
          }
        }}
      />

      {/* 3. Acordeón Discreto: "⚡ Probar Escaneo Rápido (Demo de Códigos de Fábrica)" */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowDemoAccordion(!showDemoAccordion)}
          className="w-full p-2.5 px-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>⚡ Probar Escaneo Rápido (Códigos de Fábrica Demo)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
            <span>{showDemoAccordion ? 'Ocultar' : 'Probar'}</span>
            {showDemoAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showDemoAccordion && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: 'Conserva de Atún Primor', price: 'S/ 5.00', code: '7750100001234' },
              { name: 'Cerveza Pilsen Callao', price: 'S/ 6.00', code: '7750200005678' },
              { name: 'Galleta Soda San Jorge', price: 'S/ 1.50', code: '7750300009012' },
              { name: 'Arroz Faraón 1kg', price: 'S/ 4.00', code: '7750400003456' },
            ].map((d) => (
              <button
                key={d.code}
                type="button"
                onClick={() => {
                  soundFX.playScanBeep();
                  onSimulateBarcode(d.code);
                }}
                className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all shadow-2xs group"
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 truncate">
                  {d.name}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                  <span className="text-slate-400">{d.code}</span>
                  <span className="text-emerald-700 font-extrabold">{d.price}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Layout Principal: Catálogo Limpio + Ticket de Venta */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Catálogo de Productos (Blanco Puro con Acentos Esmeralda) */}
        <div className="col-span-1 lg:col-span-7 xl:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-600">
              Productos disponibles ({filteredProducts.length})
            </span>

            {/* Accesos rápidos de Venta a Granel y Generar Sticker */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onOpenGranel}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl flex items-center space-x-1 border border-emerald-200 transition-colors cursor-pointer"
              >
                <Scale className="w-3 h-3" />
                <span>Pesar a Granel</span>
              </button>

              <button
                type="button"
                onClick={() => setIsStickerModalOpen(true)}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-xl flex items-center space-x-1 transition-colors"
              >
                <Barcode className="w-3 h-3" />
                <span>Stickers</span>
              </button>
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= product.minStock;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOutOfStock && handleProductCardClick(product)}
                  className={`relative p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all select-none ${
                    isOutOfStock
                      ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                      : 'bg-white border-slate-200/90 hover:border-emerald-500 hover:shadow-md cursor-pointer group'
                  }`}
                >
                  <div>
                    {/* Header de la tarjeta: Ícono vectorial en contenedor suave + Badge de Stock */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-emerald-50 border border-slate-100 group-hover:border-emerald-200 flex items-center justify-center transition-colors">
                        {renderProductVectorIcon(product)}
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isOutOfStock
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : isLowStock
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {product.stock} {product.unit}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-slate-900 line-clamp-2 leading-tight">
                      {product.name}
                    </h4>

                    <p className="text-[10px] font-mono text-slate-400 mt-1 truncate">
                      {product.barcode}
                    </p>
                  </div>

                  {/* Footer de Tarjeta: Precio en Soles + Botón "+" */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                    <span className="font-mono text-sm font-extrabold text-emerald-700">
                      {formatCurrency(product.salePrice)}
                    </span>

                    <div className="w-7 h-7 rounded-xl bg-emerald-50 group-hover:bg-emerald-700 text-emerald-700 group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <Plus className="w-4 h-4 stroke-[2.2]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Ticket de Venta en Vivo */}
        <div className="col-span-1 lg:col-span-5 xl:col-span-4">
          <div className="sticky top-16">
            <CartSummary
              cart={cart}
              onUpdateQty={onUpdateQty}
              onRemoveItem={onRemoveItem}
              onClearCart={onClearCart}
              onProceedCheckout={onProceedCheckout}
              discount={discount}
              onSetDiscount={onSetDiscount}
            />
          </div>
        </div>
      </div>

      {/* Modal de Stickers de Códigos */}
      <BarcodeStickerModal
        isOpen={isStickerModalOpen}
        onClose={() => setIsStickerModalOpen(false)}
        products={products}
      />
    </div>
  );
}

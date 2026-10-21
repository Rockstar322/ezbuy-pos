import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Trash2, 
  Scale,
  Barcode,
  Zap,
  Box,
  CupSoda,
  Cookie,
  Milk
} from 'lucide-react';
import { ProductModal } from './ProductModal';
import { QuickStockScannerModal } from './QuickStockScannerModal';
import { formatCurrency } from '../../utils/receiptGenerator';

export function InventoryView({ products = [], onSaveProduct, onDeleteProduct }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isQuickStockOpen, setIsQuickStockOpen] = useState(false);

  // Estadísticas del Semáforo
  const stats = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let totalValuation = 0;

    products.forEach((p) => {
      totalValuation += (p.costPrice || 0) * (p.stock || 0);
      if (p.stock <= 0) {
        outOfStock++;
      } else if (p.stock <= p.minStock) {
        lowStock++;
      } else {
        inStock++;
      }
    });

    return { inStock, lowStock, outOfStock, totalValuation };
  }, [products]);

  const categories = useMemo(() => {
    return ['all', ...new Set(products.map((p) => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.barcode.includes(q);
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

      let matchesStock = true;
      if (stockFilter === 'in_stock') matchesStock = p.stock > p.minStock;
      if (stockFilter === 'low_stock') matchesStock = p.stock > 0 && p.stock <= p.minStock;
      if (stockFilter === 'out_of_stock') matchesStock = p.stock <= 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, categoryFilter, stockFilter]);

  const renderProductIcon = (product) => {
    if (product.isGranel || product.category === 'A Granel / Peso') {
      return <Scale className="w-4 h-4 text-emerald-600" />;
    }
    if (product.category === 'Bebidas y Licores') {
      return <CupSoda className="w-4 h-4 text-rose-500" />;
    }
    if (product.category === 'Snacks y Galletas') {
      return <Cookie className="w-4 h-4 text-lime-600" />;
    }
    if (product.category === 'Lácteos y Embutidos') {
      return <Milk className="w-4 h-4 text-orange-500" />;
    }
    if (product.category === 'Enlatados y Conservas') {
      return <Box className="w-4 h-4 text-slate-500" />;
    }
    return <Package className="w-4 h-4 text-amber-500" />;
  };

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Tarjetas de Resumen & Semáforo de Abastecimiento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Catálogo */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500">Total Catálogo</p>
            <p className="text-xl font-black font-mono text-slate-900 mt-0.5">{products.length}</p>
            <p className="text-[10px] text-slate-400">Valoriz: {formatCurrency(stats.totalValuation)}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200">
            <Package className="w-4 h-4" />
          </div>
        </div>

        {/* Verde: En Stock */}
        <div 
          onClick={() => setStockFilter(stockFilter === 'in_stock' ? 'all' : 'in_stock')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            stockFilter === 'in_stock'
              ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-emerald-800">En Stock (Normal)</p>
              <p className="text-xl font-black font-mono text-emerald-700 mt-0.5">{stats.inStock}</p>
              <p className="text-[10px] text-emerald-600">Nivel Óptimo</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Ámbar: Stock Bajo */}
        <div 
          onClick={() => setStockFilter(stockFilter === 'low_stock' ? 'all' : 'low_stock')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            stockFilter === 'low_stock'
              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-amber-800">Stock Bajo</p>
              <p className="text-xl font-black font-mono text-amber-700 mt-0.5">{stats.lowStock}</p>
              <p className="text-[10px] text-amber-600">Reabastecer pronto</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Rojo: Agotado */}
        <div 
          onClick={() => setStockFilter(stockFilter === 'out_of_stock' ? 'all' : 'out_of_stock')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            stockFilter === 'out_of_stock'
              ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-rose-800">Agotados</p>
              <p className="text-xl font-black font-mono text-rose-700 mt-0.5">{stats.outOfStock}</p>
              <p className="text-[10px] text-rose-600">Sin existencias</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros, Búsqueda y Botones de Acción */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Buscador */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o código de barras..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Selector de Categoría */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">Todas las Categorías</option>
          {categories.filter((c) => c !== 'all').map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Botones de Acción: Recepción Rápida y Nuevo Producto */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsQuickStockOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Escanear código que viene atrás del producto sin imprimir etiquetas"
          >
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>Recepción Rápida (Escanear Código)</span>
          </button>

          <button
            type="button"
            onClick={handleCreate}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Tabla de Inventario de Alta Fidelidad en Fondo Blanco */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">Producto & Código</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3 font-mono">Costo / Venta</th>
                <th className="py-3 px-3 text-center">Semáforo</th>
                <th className="py-3 px-3 font-mono text-center">Stock Actual</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No se encontraron productos con los filtros seleccionados
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  const isLowStock = p.stock > 0 && p.stock <= p.minStock;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Nombre y Código */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                            {renderProductIcon(p)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 text-xs leading-snug">{p.name}</p>
                            <p className="font-mono text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Barcode className="w-3 h-3 text-slate-400" />
                              <span>{p.barcode}</span>
                              {p.isGranel && (
                                <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1 rounded">A Granel</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="py-3 px-3 text-slate-600">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-semibold">
                          {p.category}
                        </span>
                      </td>

                      {/* Costo vs Venta */}
                      <td className="py-3 px-3 font-mono">
                        <p className="text-emerald-700 font-extrabold">{formatCurrency(p.salePrice)}</p>
                        <p className="text-[10px] text-slate-400">Costo: {formatCurrency(p.costPrice)}</p>
                      </td>

                      {/* Semáforo */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isOutOfStock
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : isLowStock
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <span>
                            {isOutOfStock ? 'Agotado' : isLowStock ? 'Stock Bajo' : 'En Stock'}
                          </span>
                        </span>
                      </td>

                      {/* Stock Actual */}
                      <td className="py-3 px-3 text-center font-mono">
                        <span className="font-black text-sm text-slate-900">
                          {p.stock}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-1">
                          {p.unit}
                        </span>
                        <p className="text-[9px] text-slate-400">Mín: {p.minStock}</p>
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Editar producto"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`¿Eliminar ${p.name}?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={onSaveProduct}
      />

      {/* Modal Recepción Rápida por Código de Fábrica */}
      <QuickStockScannerModal
        isOpen={isQuickStockOpen}
        onClose={() => setIsQuickStockOpen(false)}
        products={products}
        onAddStock={(prodId, qty) => {
          const target = products.find((p) => p.id === prodId);
          if (target) {
            onSaveProduct({
              ...target,
              stock: target.stock + qty,
            });
          }
        }}
        onRegisterNewProduct={(newProd) => {
          onSaveProduct(newProd);
        }}
      />
    </div>
  );
}

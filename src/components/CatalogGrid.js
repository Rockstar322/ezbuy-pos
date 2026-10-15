'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

export default function CatalogGrid({
  products,
  onAddToCart,
  onSepararStock,
  selectedCategory,
  onResetFilter
}) {
  const [sortBy, setSortBy] = useState('destacados');

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'precio-asc') return a.precio - b.precio;
    if (sortBy === 'precio-desc') return b.precio - a.precio;
    if (sortBy === 'stock-desc') return b.stock - a.stock;
    if (sortBy === 'nombre-asc') return a.nombre.localeCompare(b.nombre);
    // Default: destacados first, then higher stock
    return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0);
  });

  return (
    <div>
      {/* Top Controls Bar for Grid */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        padding: '12px 18px',
        backgroundColor: 'rgba(20, 29, 48, 0.5)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Mostrando <strong style={{ color: '#ffffff' }}>{products.length}</strong> productos
          {selectedCategory !== 'todos' && (
            <span> en esta categoría</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Ordenar por:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="destacados">⭐ Destacados y Populares</option>
            <option value="precio-asc">💵 Precio: Menor a Mayor</option>
            <option value="precio-desc">💰 Precio: Mayor a Menor</option>
            <option value="stock-desc">📦 Mayor Stock Disponible</option>
            <option value="nombre-asc">🔤 Nombre: A - Z</option>
          </select>
        </div>
      </div>

      {/* Grid of products */}
      {sortedProducts.length > 0 ? (
        <div className="product-grid">
          {sortedProducts.map((prod) => (
            <ProductCard
              key={prod.id || prod.codigoBarra}
              product={prod}
              onAddToCart={onAddToCart}
              onSepararStock={onSepararStock}
            />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'rgba(20, 29, 48, 0.4)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-medium)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
            No se encontraron productos
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>
            Prueba ajustando el término de búsqueda o seleccionando otra categoría.
          </p>
          <button onClick={onResetFilter} className="btn btn-secondary btn-sm">
            Mostrar Todos los Productos
          </button>
        </div>
      )}
    </div>
  );
}

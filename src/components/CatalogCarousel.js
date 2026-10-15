'use client';

import { useRef } from 'react';
import ProductCard from './ProductCard';

export default function CatalogCarousel({
  products,
  categories,
  onAddToCart,
  onSepararStock,
  onSelectCategory
}) {
  // Group products by category slug
  const groupedProducts = categories.map((cat) => {
    const prods = products.filter((p) => p.categoria === cat.slug);
    return {
      ...cat,
      items: prods
    };
  }).filter((group) => group.items.length > 0);

  const scrollTrack = (categoryId, direction) => {
    const el = document.getElementById(`track-${categoryId}`);
    if (el) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      <div style={{
        padding: '14px 18px',
        backgroundColor: 'rgba(249, 115, 22, 0.08)',
        border: '1px solid rgba(249, 115, 22, 0.25)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>◫</span>
          <div>
            <strong style={{ color: '#ffffff' }}>Vista Carrusel Activa</strong>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Explora el catálogo navegando horizontalmente por cada categoría
            </div>
          </div>
        </div>
        <span className="badge badge-orange">
          {groupedProducts.length} Secciones
        </span>
      </div>

      {groupedProducts.map((group) => (
        <section
          key={group.id}
          style={{
            backgroundColor: 'rgba(20, 29, 48, 0.4)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px 20px',
            border: '1px solid var(--border-subtle)',
            position: 'relative'
          }}
        >
          {/* Category Header Row with Nav Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontSize: '1.8rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)'
              }}>
                {group.icono}
              </span>
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {group.nombre}
                  <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                    {group.items.length} productos
                  </span>
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Desliza para ver más productos de esta categoría
                </div>
              </div>
            </div>

            {/* Left and Right Carousel Arrow Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => scrollTrack(group.slug, 'left')}
                className="btn btn-secondary btn-icon"
                title="Deslizar a la izquierda"
                style={{ width: '38px', height: '38px', fontSize: '1rem' }}
              >
                ◀
              </button>
              <button
                onClick={() => scrollTrack(group.slug, 'right')}
                className="btn btn-secondary btn-icon"
                title="Deslizar a la derecha"
                style={{ width: '38px', height: '38px', fontSize: '1rem' }}
              >
                ▶
              </button>
            </div>
          </div>

          {/* Carousel Track */}
          <div
            id={`track-${group.slug}`}
            className="carousel-track"
          >
            {group.items.map((prod) => (
              <div key={prod.id} className="carousel-item">
                <ProductCard
                  product={prod}
                  onAddToCart={onAddToCart}
                  onSepararStock={onSepararStock}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

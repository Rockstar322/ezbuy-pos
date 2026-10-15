'use client';

import { useState } from 'react';

export default function ProductTableView({
  products = [],
  onOpenCreateProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleProductActive,
  onOpenGalleryView,
  onBackToStore
}) {
  const [activeSubTab, setActiveSubTab] = useState('productos'); // 'productos' | 'modificadores'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filtered = products.filter((p) => {
    const matchSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigoBarra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.marca && p.marca.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = selectedCategory === 'todos' || p.categoria === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      color: '#1e293b',
      padding: '24px 32px',
      fontFamily: 'var(--font-main)'
    }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Top Breadcrumb & Return Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onBackToStore}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              ← Volver a la Tienda
            </button>

            <button
              onClick={onOpenGalleryView}
              style={{
                backgroundColor: '#4f46e5',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              🖼️ Ver en Galería por Categorías (Imagen 1)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Dueño: sebastian@ferrepro.pe</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#ea580c',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              S
            </div>
          </div>
        </div>

        {/* Header (Exact Image 2 layout) */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>
              Productos
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Crea, edita y organiza productos además de gestionar su stock, precios y canales fácilmente.
            </p>
          </div>

          {/* Big Orange Button: + Crear (Matching Image 2) */}
          <button
            onClick={() => onOpenCreateProduct('')}
            style={{
              backgroundColor: '#ea580c',
              color: '#ffffff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>+</span>
            <span>Crear</span>
          </button>
        </div>

        {/* Sub-tabs: Productos | Modificadores y adicionales (Matching Image 2) */}
        <div style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setActiveSubTab('productos')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeSubTab === 'productos' ? '3px solid #ea580c' : '3px solid transparent',
              padding: '8px 4px 12px 4px',
              fontWeight: 700,
              fontSize: '0.92rem',
              color: activeSubTab === 'productos' ? '#ea580c' : '#64748b',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveSubTab('modificadores')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeSubTab === 'modificadores' ? '3px solid #ea580c' : '3px solid transparent',
              padding: '8px 4px 12px 4px',
              fontWeight: 700,
              fontSize: '0.92rem',
              color: activeSubTab === 'modificadores' ? '#ea580c' : '#64748b',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            Modificadores y adicionales
          </button>
        </div>

        {/* Search Input Bar (Matching Image 2) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ position: 'relative', flex: '1 1 340px', maxWidth: '480px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o marca..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.88rem',
                outline: 'none',
                color: '#0f172a'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Filtrar categoría:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '0.85rem'
              }}
            >
              <option value="todos">Todas las Categorías</option>
              <option value="tuberia-conexiones">Tubería y Gasfitería</option>
              <option value="herramientas-electricas">Herramientas Eléctricas</option>
              <option value="herramientas-manuales">Herramientas Manuales</option>
              <option value="materiales-construccion">Construcción y Cemento</option>
              <option value="electricidad">Electricidad</option>
              <option value="pinturas-acabados">Pinturas y Acabados</option>
              <option value="tornilleria-fijacion">Tornillería y Cerrajería</option>
            </select>
          </div>
        </div>

        {/* Data Table (Exact Image 2 layout) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.84rem'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}>
                  <th style={{ padding: '14px 16px' }}>Nombre</th>
                  <th style={{ padding: '14px 12px' }}>SKU</th>
                  <th style={{ padding: '14px 12px' }}>Descripción</th>
                  <th style={{ padding: '14px 12px' }}>Precio</th>
                  <th style={{ padding: '14px 12px' }}>Tipo de Entrega</th>
                  <th style={{ padding: '14px 12px' }}>Stock Actual</th>
                  <th style={{ padding: '14px 12px' }}>Marca / Cat.</th>
                  <th style={{ padding: '14px 12px', textAlign: 'center' }}>Habilitado</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((p) => (
                    <tr
                      key={p.id || p.codigoBarra}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      {/* Nombre con Thumbnail */}
                      <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={p.imagen}
                          alt={p.nombre}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            backgroundColor: '#e2e8f0'
                          }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>
                            {p.nombre}
                          </div>
                          {p.tag && (
                            <span style={{
                              fontSize: '0.65rem',
                              backgroundColor: '#fff7ed',
                              color: '#ea580c',
                              border: '1px solid #fdba74',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontWeight: 700
                            }}>
                              {p.tag}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* SKU */}
                      <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                        {p.codigoBarra}
                      </td>

                      {/* Descripción */}
                      <td style={{
                        padding: '12px',
                        color: '#64748b',
                        maxWidth: '220px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {p.descripcion || p.ficha || '—'}
                      </td>

                      {/* Precio */}
                      <td style={{ padding: '12px', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                        S/ {Number(p.precio).toFixed(2)}
                      </td>

                      {/* Tipo de Entrega (Pills Pickup y Delivery como en Imagen 2) */}
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={{
                            backgroundColor: '#e0e7ff',
                            color: '#4338ca',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 700
                          }}>
                            Pickup
                          </span>
                          <span style={{
                            backgroundColor: '#fed7aa',
                            color: '#c2410c',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 700
                          }}>
                            Delivery
                          </span>
                        </div>
                      </td>

                      {/* Stock */}
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          fontWeight: 700,
                          color: p.stock > 10 ? '#10b981' : p.stock > 0 ? '#f59e0b' : '#ef4444'
                        }}>
                          {p.stock} {p.unidadMedida}s
                        </span>
                      </td>

                      {/* Marca / Categoría */}
                      <td style={{ padding: '12px', color: '#475569' }}>
                        <div>{p.marca || '—'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{p.categoriaNombre}</div>
                      </td>

                      {/* Switch Habilitado (Orange toggle switch ON/OFF) */}
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={p.activo !== false}
                            onChange={() => onToggleProductActive(p.id)}
                            style={{
                              width: '36px',
                              height: '20px',
                              accentColor: '#ea580c',
                              cursor: 'pointer'
                            }}
                          />
                        </label>
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => onEditProduct(p)}
                            title="Editar este producto"
                            style={{
                              backgroundColor: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            title="Eliminar este producto"
                            style={{
                              backgroundColor: '#fee2e2',
                              border: '1px solid #fca5a5',
                              color: '#dc2626',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      No se encontraron productos con el filtro aplicado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer: Results count & Pagination (Exact Image 2 footer) */}
          <div style={{
            padding: '14px 20px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.82rem',
            color: '#64748b'
          }}>
            <div>
              Se encontraron <strong>{filtered.length}</strong> resultados
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    border: pg === currentPage ? 'none' : '1px solid #cbd5e1',
                    backgroundColor: pg === currentPage ? '#ea580c' : '#ffffff',
                    color: pg === currentPage ? '#ffffff' : '#0f172a',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                ›
              </button>

              <span style={{ marginLeft: '10px' }}>
                {itemsPerPage} / página
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function CategoryGalleryView({
  products = [],
  categories = [],
  onOpenCreateProduct,
  onOpenCreateCategory,
  onOpenTableView,
  onToggleCategoryActive,
  onToggleProductActive,
  onEditProduct,
  onBackToStore
}) {
  const [activeNavPill, setActiveNavPill] = useState('contenido'); // 'contenido' | 'diseno' | 'config'
  const [rightListSearch, setRightListSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const toggleCollapse = (catSlug) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catSlug]: !prev[catSlug]
    }));
  };

  const filteredRightProducts = products.filter(p =>
    p.nombre.toLowerCase().includes(rightListSearch.toLowerCase()) ||
    p.codigoBarra.toLowerCase().includes(rightListSearch.toLowerCase())
  );

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      color: '#1e293b',
      fontFamily: 'var(--font-main)'
    }}>
      {/* ─── Top Admin Bar ──────────────────────────────────────────────── */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Left: Back & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={onBackToStore}
              title="Volver a la Tienda Pública"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.2rem',
                fontWeight: 700
              }}
            >
              ‹
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
                FerrePro <span style={{ color: '#ea580c' }}>El Maestro</span>
              </span>
              <span style={{
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                Panel Visual
              </span>
            </div>
          </div>

          {/* Right: User / Profile info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                sebastian@ferrepro.pe
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Rol: Dueño Administrador
              </div>
            </div>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#ea580c',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem'
            }}>
              S
            </div>
          </div>
        </div>

        {/* Sub-bar with Navigation Pills and Actions (Exact Image 1 layout) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Pills Tabs: Contenido | Diseño | Configuración */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setActiveNavPill('contenido')}
              style={{
                backgroundColor: activeNavPill === 'contenido' ? '#4f46e5' : '#f1f5f9',
                color: activeNavPill === 'contenido' ? '#ffffff' : '#64748b',
                border: 'none',
                padding: '7px 18px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Contenido
            </button>
            <button
              onClick={() => setActiveNavPill('diseno')}
              style={{
                backgroundColor: activeNavPill === 'diseno' ? '#4f46e5' : '#f1f5f9',
                color: activeNavPill === 'diseno' ? '#ffffff' : '#64748b',
                border: 'none',
                padding: '7px 18px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Diseño de la web
            </button>
            <button
              onClick={() => setActiveNavPill('config')}
              style={{
                backgroundColor: activeNavPill === 'config' ? '#4f46e5' : '#f1f5f9',
                color: activeNavPill === 'config' ? '#ffffff' : '#64748b',
                border: 'none',
                padding: '7px 18px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Configuración
            </button>

            {/* Orange Button: + Crear Categoría */}
            <button
              onClick={onOpenCreateCategory}
              style={{
                backgroundColor: '#ea580c',
                color: '#ffffff',
                border: 'none',
                padding: '7px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)',
                marginLeft: '6px'
              }}
            >
              <span>+</span>
              <span>Crear Categoría</span>
            </button>
          </div>

          {/* Right Action Pills: Ver productos | Ver modificadores */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onOpenTableView}
              style={{
                backgroundColor: '#3730a3',
                color: '#ffffff',
                border: 'none',
                padding: '7px 16px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Abrir la tabla completa de productos (Diseño Imagen 2)"
            >
              <span>📋</span>
              <span>Ver productos (Tabla Completa)</span>
            </button>

            <button
              style={{
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                padding: '7px 14px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Ver modificadores / filtros
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Two-Column Layout (Matching Image 1) ────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '24px',
        padding: '24px',
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        {/* Left Column: Categorized Gallery Rows with "+ Nuevo producto" Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {categories.map((cat) => {
            const catProducts = products.filter(p => p.categoria === cat.slug);
            const isCollapsed = Boolean(collapsedCategories[cat.slug]);

            return (
              <div
                key={cat.id || cat.slug}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  overflow: 'hidden'
                }}
              >
                {/* Category Header Row (Exact Image 1 header) */}
                <div style={{
                  padding: '16px 20px',
                  borderBottom: isCollapsed ? 'none' : '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#fafbfc'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#94a3b8', cursor: 'grab', fontSize: '1.1rem' }} title="Reordenar">
                      :::
                    </span>
                    <h3 style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>{cat.icono || '📦'}</span>
                      <span>{cat.nombre}</span>
                      <span style={{
                        fontSize: '0.72rem',
                        color: '#64748b',
                        fontWeight: 600,
                        backgroundColor: '#e2e8f0',
                        padding: '1px 8px',
                        borderRadius: '10px'
                      }}>
                        {catProducts.length}
                      </span>
                    </h3>
                  </div>

                  {/* Header Controls: Toggle switch, edit, duplicate, collapse */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Orange Toggle Switch ON/OFF */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={cat.activa !== false}
                        onChange={() => onToggleCategoryActive(cat.slug)}
                        style={{
                          width: '36px',
                          height: '20px',
                          accentColor: '#ea580c',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: cat.activa !== false ? '#ea580c' : '#94a3b8' }}>
                        {cat.activa !== false ? 'Activa' : 'Inactiva'}
                      </span>
                    </label>

                    {/* Edit icon */}
                    <button
                      onClick={() => onOpenCreateProduct(cat.slug)}
                      title="Agregar producto a esta categoría"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontSize: '0.95rem'
                      }}
                    >
                      ✏️
                    </button>

                    {/* Collapse / Expand Chevron */}
                    <button
                      onClick={() => toggleCollapse(cat.slug)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 700,
                        padding: '4px'
                      }}
                      title={isCollapsed ? 'Expandir' : 'Colapsar'}
                    >
                      {isCollapsed ? '▼' : '▲'}
                    </button>
                  </div>
                </div>

                {/* Horizontal Product Cards & "+ Nuevo producto" Card */}
                {!isCollapsed && (
                  <div style={{
                    padding: '20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '16px',
                    alignItems: 'stretch'
                  }}>
                    {/* Existing Products in this category */}
                    {catProducts.map((prod) => (
                      <div
                        key={prod.id || prod.codigoBarra}
                        onClick={() => onEditProduct(prod)}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                      >
                        {/* Image */}
                        <div style={{
                          height: '115px',
                          backgroundColor: '#f1f5f9',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <img
                            src={prod.imagen}
                            alt={prod.nombre}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          {prod.tag && (
                            <span style={{
                              position: 'absolute',
                              top: '6px',
                              right: '6px',
                              backgroundColor: '#ea580c',
                              color: '#fff',
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}>
                              {prod.tag}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div style={{
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          flex: 1,
                          gap: '6px'
                        }}>
                          <div>
                            <h4 style={{
                              fontSize: '0.84rem',
                              fontWeight: 700,
                              color: '#0f172a',
                              lineHeight: 1.25,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              marginBottom: '3px'
                            }}>
                              {prod.nombre}
                            </h4>

                            {/* Price in Bright Orange (Matching Image 1) */}
                            <div style={{
                              fontSize: '0.95rem',
                              fontWeight: 800,
                              color: '#ea580c',
                              fontFamily: 'var(--font-mono)'
                            }}>
                              S/ {Number(prod.precio).toFixed(2)}
                            </div>
                          </div>

                          <div>
                            <div style={{
                              fontSize: '0.72rem',
                              color: '#64748b',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {prod.descripcion || 'Sin descripción'}
                            </div>

                            <div style={{
                              fontSize: '0.68rem',
                              color: '#94a3b8',
                              fontFamily: 'var(--font-mono)',
                              marginTop: '4px',
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}>
                              <span>SKU: {prod.codigoBarra}</span>
                              <span style={{ color: prod.stock > 0 ? '#10b981' : '#ef4444' }}>
                                {prod.stock} {prod.unidadMedida}s
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* The Special "+ Nuevo producto" Card (Exact Image 1 design) */}
                    <div
                      onClick={() => onOpenCreateProduct(cat.slug)}
                      style={{
                        backgroundColor: '#fffaf5',
                        border: '2px dashed #fb923c',
                        borderRadius: '12px',
                        padding: '24px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        cursor: 'pointer',
                        minHeight: '200px',
                        transition: 'all 0.2s'
                      }}
                      title={`Crear nuevo producto en la categoría ${cat.nombre}`}
                    >
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: '#fed7aa',
                        color: '#ea580c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        marginBottom: '10px'
                      }}>
                        +
                      </div>
                      <div style={{
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        color: '#ea580c',
                        marginBottom: '4px'
                      }}>
                        Nuevo producto
                      </div>
                      <div style={{
                        fontSize: '0.72rem',
                        color: '#9a3412',
                        lineHeight: 1.3,
                        maxWidth: '140px'
                      }}>
                        Presiona para crear o ingresar producto manual
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side Panel: "Lista de productos" (Matching Image 1 right drawer) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          padding: '20px',
          position: 'sticky',
          top: '130px',
          height: 'calc(100vh - 160px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              Lista de productos
            </h3>
            <button
              onClick={() => onOpenCreateProduct('')}
              style={{
                backgroundColor: '#ea580c',
                color: '#ffffff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>+</span>
              <span>Crear</span>
            </button>
          </div>
          <p style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '14px' }}>
            Busca, selecciona o edita productos en tu catálogo
          </p>

          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={rightListSearch}
              onChange={(e) => setRightListSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.82rem',
                outline: 'none',
                backgroundColor: '#f8fafc',
                color: '#0f172a'
              }}
            />
          </div>

          {/* Scrollable list of compact product items */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingRight: '4px'
          }}>
            {filteredRightProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => onEditProduct(p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    backgroundColor: '#e2e8f0'
                  }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {p.nombre}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                    SKU: {p.codigoBarra}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: '#ea580c',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    S/ {Number(p.precio).toFixed(2)}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: p.activo !== false ? '#10b981' : '#94a3b8' }}>
                    {p.activo !== false ? '✓ Activo' : '✕ Inactivo'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick jump to full table */}
          <button
            onClick={onOpenTableView}
            style={{
              marginTop: '12px',
              padding: '10px',
              backgroundColor: '#f1f5f9',
              color: '#4f46e5',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            Abrir Vista Tabla Completa →
          </button>
        </div>
      </div>
    </div>
  );
}

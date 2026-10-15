'use client';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  cartCount,
  onOpenCart,
  activeTab,
  setActiveTab,
  selectedCategory,
  onSelectCategory,
  categorias = []
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(8, 12, 20, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Top Announcement Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #ea580c 0%, #f97316 50%, #d97706 100%)',
        color: '#ffffff',
        padding: '6px 16px',
        fontSize: '0.8rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1rem' }}>🚚</span>
          <span>Despacho el mismo día en Lima y envíos a provincia por agencia</span>
          <span style={{ opacity: 0.7 }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>🇵🇪 Pagos:</span>
            <span style={{ background: '#7c3aed', padding: '1px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>Yape</span>
            <span style={{ background: '#0284c7', padding: '1px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>Plin</span>
            <span style={{ background: '#059669', padding: '1px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>Tarjetas Culqi</span>
            <span style={{ background: '#334155', padding: '1px 6px', borderRadius: '4px', fontSize: '0.72rem' }}>Contra Entrega</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a
            href="https://wa.me/51987654321?text=Hola%20Ferreter%C3%ADa%20El%20Maestro,%20quiero%20consultar%20stock"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              background: 'rgba(0,0,0,0.25)',
              padding: '2px 8px',
              borderRadius: '6px'
            }}
          >
            <span>💬 WhatsApp Venta Rápida: <strong>987 654 321</strong></span>
          </a>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container" style={{ padding: '12px 20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('tienda')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-orange)',
              fontSize: '1.4rem'
            }}>
              🛠️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: '#ffffff'
                }}>
                  FERRE<span style={{ color: 'var(--primary)' }}>PRO</span>
                </span>
                <span className="badge badge-orange" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                  EL MAESTRO
                </span>
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontWeight: 600
              }}>
                Ferretería & Construcción Industrial
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{
            flex: '1 1 320px',
            maxWidth: '520px',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              fontSize: '1rem',
              pointerEvents: 'none'
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar tubos PVC, cemento, herramientas, cables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{
                paddingLeft: '40px',
                paddingRight: searchTerm ? '38px' : '14px',
                height: '44px',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(20, 29, 48, 0.85)',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {/* View Switcher: Grid vs Carousel */}
            {activeTab === 'tienda' && (
              <div style={{
                display: 'inline-flex',
                background: 'rgba(20, 29, 48, 0.9)',
                padding: '3px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  title="Vista Cuadrícula Clásica"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                    color: viewMode === 'grid' ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>▦</span> Grid
                </button>
                <button
                  onClick={() => setViewMode('carousel')}
                  title="Vista Carrusel por Categorías"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: viewMode === 'carousel' ? 'var(--primary)' : 'transparent',
                    color: viewMode === 'carousel' ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>◫</span> Carrusel
                </button>
              </div>
            )}

            {/* Galería Visual Categorías (Imagen 1) */}
            <button
              onClick={() => setActiveTab(activeTab === 'galeria' ? 'tienda' : 'galeria')}
              className={activeTab === 'galeria' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: activeTab === 'galeria' ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
              }}
              title="Vista Galería por Categorías estilo Don Tito (Imagen 1)"
            >
              <span>🖼️</span>
              <span>Galería Visual</span>
            </button>

            {/* Apartado de Productos Tabla (Imagen 2) */}
            <button
              onClick={() => setActiveTab(activeTab === 'productos_tabla' ? 'tienda' : 'productos_tabla')}
              className={activeTab === 'productos_tabla' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: activeTab === 'productos_tabla' ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
              }}
              title="Apartado de Productos: Tabla y Creación Manual (Imagen 2)"
            >
              <span>📋</span>
              <span>Productos (Tabla)</span>
            </button>

            {/* Smartphone Warehouse View Switcher */}
            <button
              onClick={() => setActiveTab(activeTab === 'almacen' ? 'tienda' : 'almacen')}
              className={activeTab === 'almacen' ? 'btn btn-cyan btn-sm' : 'btn btn-secondary btn-sm'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: activeTab === 'almacen' ? '1px solid var(--secondary)' : '1px solid var(--border-medium)',
              }}
              title="Modo Smartphone para control de stock en pasadizo"
            >
              <span>📱</span>
              <span style={{ display: 'inline' }}>Almacén Móvil</span>
            </button>

            {/* Maestro / Admin Panel Switcher */}
            <button
              onClick={() => setActiveTab(activeTab === 'maestro' ? 'tienda' : 'maestro')}
              className={activeTab === 'maestro' ? 'btn btn-purple btn-sm' : 'btn btn-secondary btn-sm'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: activeTab === 'maestro' ? '1px solid var(--purple)' : '1px solid var(--border-medium)',
              }}
              title="Panel Maestro & Cargas Masivas de Guias"
            >
              <span>🛡️</span>
              <span>Maestro</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="btn btn-primary"
              style={{
                position: 'relative',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>🛒</span>
              <span style={{ fontWeight: 700 }}>Carrito</span>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.6)',
                  animation: 'pulseGlow 2s infinite'
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

export default function ProductCard({ product, onAddToCart, onSepararStock }) {
  const isLowStock = product.stock > 0 && product.stock <= (product.stockMinimo || 10);
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        height: '100%'
      }}
    >
      {/* Product Image Area */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '190px',
        backgroundColor: '#0c1322',
        overflow: 'hidden'
      }}>
        {/* Real Product Image with Fallback Pattern */}
        <img
          src={product.imagen}
          alt={product.nombre}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => {
            // Elegant placeholder pattern if image fails
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Floating Tag */}
        {product.tag && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(234, 88, 12, 0.92)',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
          }}>
            {product.tag}
          </div>
        )}

        {/* Brand Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(8px)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: 'var(--radius-sm)',
        }}>
          {product.marca}
        </div>

        {/* Stock pill in corner */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '12px',
        }}>
          {isOutOfStock ? (
            <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
              🔴 Agotado
            </span>
          ) : isLowStock ? (
            <span className="badge badge-orange" style={{ animation: 'pulseGlow 2s infinite' }}>
              ⚠️ ¡Solo {product.stock} {product.unidadMedida}s!
            </span>
          ) : (
            <span className="badge badge-green">
              🟢 Stock: {product.stock} {product.unidadMedida}s
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div style={{
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div>
          {/* Barcode / SKU */}
          <div style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>SKU: {product.codigoBarra}</span>
            <span>•</span>
            <span style={{ color: 'var(--secondary)' }}>{product.categoriaNombre}</span>
          </div>

          {/* Product Name */}
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 700,
            lineHeight: 1.35,
            color: '#ffffff',
            marginBottom: '6px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.nombre}
          </h3>

          {/* Short Description */}
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '10px'
          }}>
            {product.descripcion}
          </p>

          {/* Specs Snippet */}
          {product.ficha && (
            <div style={{
              fontSize: '0.74rem',
              color: 'var(--text-dim)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--border-subtle)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              📋 {product.ficha}
            </div>
          )}
        </div>

        {/* Pricing & Actions */}
        <div style={{
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>S/ </span>
              <span style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'var(--font-mono)'
              }}>
                {Number(product.precio).toFixed(2)}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                / {product.unidadMedida}
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              IGV incluido
            </span>
          </div>

          {/* Dual Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px'
          }}>
            <button
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className="btn btn-primary btn-sm"
              style={{
                opacity: isOutOfStock ? 0.5 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                padding: '8px 10px',
                fontSize: '0.82rem'
              }}
              title="Agregar al carrito"
            >
              <span>🛒 Agregar</span>
            </button>

            <button
              onClick={() => onSepararStock(product)}
              disabled={isOutOfStock}
              className="btn btn-secondary btn-sm"
              style={{
                opacity: isOutOfStock ? 0.5 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                padding: '8px 8px',
                fontSize: '0.8rem',
                borderColor: 'rgba(249, 115, 22, 0.3)',
                color: '#fb923c'
              }}
              title="Separar stock para cliente que llama por teléfono"
            >
              <span>📞 Separar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

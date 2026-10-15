'use client';

import { useState } from 'react';

const IMAGENES_SUGERIDAS = [
  { label: 'Tubería PVC', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
  { label: 'Herramientas Eléctricas', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80' },
  { label: 'Herramientas Manuales', url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&auto=format&fit=crop&q=80' },
  { label: 'Cemento y Obra', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80' },
  { label: 'Cables Eléctricos', url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&auto=format&fit=crop&q=80' },
  { label: 'Pintura y Brochas', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80' },
];

export default function CreateProductModal({
  isOpen,
  onClose,
  onSaveProduct,
  categories = [],
  initialCategory = '',
  editProduct = null
}) {
  if (!isOpen) return null;

  const modalKey = editProduct ? `edit-${editProduct.id || editProduct._id || editProduct.codigoBarra}` : `new-${initialCategory}`;

  return (
    <CreateProductModalContent
      key={modalKey}
      onClose={onClose}
      onSaveProduct={onSaveProduct}
      categories={categories}
      initialCategory={initialCategory}
      editProduct={editProduct}
    />
  );
}

function CreateProductModalContent({
  onClose,
  onSaveProduct,
  categories = [],
  initialCategory = '',
  editProduct = null
}) {
  const [formData, setFormData] = useState(() => {
    if (editProduct) {
      return {
        nombre: editProduct.nombre || '',
        codigoBarra: editProduct.codigoBarra || '',
        categoria: editProduct.categoria || categories[0]?.slug || '',
        marca: editProduct.marca || '',
        precio: editProduct.precio || '',
        stock: editProduct.stock ?? 20,
        stockMinimo: editProduct.stockMinimo ?? 5,
        unidadMedida: editProduct.unidadMedida || 'unidad',
        tipoEntrega: editProduct.tipoEntrega || 'Ambos (Pickup y Delivery)',
        descripcion: editProduct.descripcion || '',
        ficha: editProduct.ficha || '',
        imagen: editProduct.imagen || IMAGENES_SUGERIDAS[0].url,
        activo: editProduct.activo ?? true,
        tag: editProduct.tag || ''
      };
    }
    return {
      nombre: '',
      codigoBarra: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
      categoria: initialCategory || categories[0]?.slug || 'tuberia-conexiones',
      marca: '',
      precio: '',
      stock: 25,
      stockMinimo: 5,
      unidadMedida: 'unidad',
      tipoEntrega: 'Ambos (Pickup y Delivery)',
      descripcion: '',
      ficha: '',
      imagen: IMAGENES_SUGERIDAS[0].url,
      activo: true,
      tag: ''
    };
  });

  const imagenesSugeridas = IMAGENES_SUGERIDAS;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.precio) return;

    const catObj = categories.find(c => c.slug === formData.categoria) || categories[0];

    const nuevoProducto = {
      id: editProduct ? editProduct.id : `prod-${Date.now()}`,
      nombre: formData.nombre.trim(),
      codigoBarra: formData.codigoBarra.trim() || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
      categoria: formData.categoria || catObj.slug,
      categoriaNombre: catObj?.nombre || 'General',
      marca: formData.marca.trim() || 'Genérico',
      precio: parseFloat(formData.precio) || 0,
      stock: parseInt(formData.stock) || 0,
      stockMinimo: parseInt(formData.stockMinimo) || 5,
      unidadMedida: formData.unidadMedida,
      tipoEntrega: formData.tipoEntrega,
      descripcion: formData.descripcion.trim(),
      ficha: formData.ficha.trim(),
      imagen: formData.imagen,
      activo: formData.activo,
      tag: formData.tag.trim(),
      destacado: Boolean(formData.tag)
    };

    onSaveProduct(nuevoProducto);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '740px',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              backgroundColor: 'rgba(249, 115, 22, 0.15)',
              color: 'var(--primary)',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              📦
            </span>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                {editProduct ? 'Editar Producto' : 'Ingresar Nuevo Producto Manualmente'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Completa los datos del producto para agregarlo al catálogo y control de stock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ width: '34px', height: '34px' }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Main Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                Nombre del Producto *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Tubo PVC SAP 1/2&quot; x 5m Clase 10 Pavco"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                Código / SKU *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. TUB-001"
                value={formData.codigoBarra}
                onChange={(e) => setFormData({ ...formData, codigoBarra: e.target.value })}
                className="input-field"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          {/* Category, Brand & Measure */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                Categoría *
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="input-field"
                style={{ backgroundColor: '#131d33' }}
              >
                {categories.map((c) => (
                  <option key={c.id || c.slug} value={c.slug}>
                    {c.icono || '📁'} {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                Marca del Fabricante
              </label>
              <input
                type="text"
                placeholder="Ej. Pavco, Stanley, DeWalt"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                Unidad de Medida
              </label>
              <select
                value={formData.unidadMedida}
                onChange={(e) => setFormData({ ...formData, unidadMedida: e.target.value })}
                className="input-field"
                style={{ backgroundColor: '#131d33' }}
              >
                <option value="unidad">Unidad (u)</option>
                <option value="varilla">Varilla (tubo/fierro)</option>
                <option value="bolsa">Bolsa (cemento/yeso)</option>
                <option value="rollo">Rollo (cable/manguera)</option>
                <option value="lata">Lata / Galón (pintura/pegamento)</option>
                <option value="caja">Caja (tornillos/clavos)</option>
                <option value="juego">Juego / Set de piezas</option>
                <option value="m³">Metro Cúbico (m³ arena/piedra)</option>
                <option value="millar">Millar (ladrillos)</option>
              </select>
            </div>
          </div>

          {/* Pricing, Stock & Delivery */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                Precio de Venta (S/) *
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', fontWeight: 800 }}>
                  S/
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  className="input-field"
                  style={{ paddingLeft: '34px', fontWeight: 700, fontSize: '1rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                Stock Inicial en Almacén
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="input-field"
                style={{ fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                Tipo de Entrega
              </label>
              <select
                value={formData.tipoEntrega}
                onChange={(e) => setFormData({ ...formData, tipoEntrega: e.target.value })}
                className="input-field"
                style={{ backgroundColor: '#131d33' }}
              >
                <option value="Ambos (Pickup y Delivery)">Pickup & Delivery</option>
                <option value="Solo Pickup (Recojo en tienda)">Solo Pickup (Tienda)</option>
                <option value="Solo Delivery a obra">Solo Delivery (Obra)</option>
              </select>
            </div>
          </div>

          {/* Description & Technical Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                Descripción Corta
              </label>
              <textarea
                rows="2"
                placeholder="Breve descripción del producto para el cliente..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="input-field"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                Ficha Técnica / Especificación
              </label>
              <textarea
                rows="2"
                placeholder="Ej. Norma NTP 399.002 | Presión máx. 10 bar..."
                value={formData.ficha}
                onChange={(e) => setFormData({ ...formData, ficha: e.target.value })}
                className="input-field"
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Image & Quick selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
              URL de Imagen del Producto
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={formData.imagen}
              onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
              className="input-field"
              style={{ fontSize: '0.85rem' }}
            />

            {/* Quick Suggestions Chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sugerir foto:</span>
              {imagenesSugeridas.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, imagen: sug.url })}
                  className="btn btn-secondary btn-sm"
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    backgroundColor: formData.imagen === sug.url ? 'rgba(249, 115, 22, 0.25)' : 'rgba(255,255,255,0.05)',
                    borderColor: formData.imagen === sug.url ? 'var(--primary)' : 'transparent'
                  }}
                >
                  {sug.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Switches: Habilitado & Tag */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: 'rgba(20, 29, 48, 0.6)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  Habilitado (Visible en tienda y catálogo)
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Insignia / Etiqueta:</span>
              <input
                type="text"
                placeholder="Ej. Más Vendido, Oferta"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="input-field"
                style={{ width: '150px', padding: '6px 10px', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          {/* Buttons Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.95rem' }}
            >
              <span>{editProduct ? '💾 Guardar Cambios' : '➕ Crear y Guardar Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

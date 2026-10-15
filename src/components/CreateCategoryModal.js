'use client';

import { useState } from 'react';

export default function CreateCategoryModal({ isOpen, onClose, onSaveCategory }) {
  const [nombre, setNombre] = useState('');
  const [icono, setIcono] = useState('🛠️');
  const [descripcion, setDescripcion] = useState('');

  if (!isOpen) return null;

  const iconosSugeridos = ['🚰', '⚡', '🔨', '🧱', '🎨', '💡', '🔩', '🔒', '🧤', '🪜', '🧰', '🪵'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const slug = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const nuevaCat = {
      id: `cat-${slug}-${Date.now()}`,
      slug,
      nombre: nombre.trim(),
      icono,
      descripcion: descripcion.trim(),
      total: 0,
      activa: true
    };

    onSaveCategory(nuevaCat);
    onClose();
    setNombre('');
    setDescripcion('');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '500px',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
            ➕ Crear Nueva Categoría
          </h2>
          <button onClick={onClose} className="btn btn-secondary btn-icon" style={{ width: '32px', height: '32px' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Grifería & Sanitarios, Cerrajería, etc."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
              Ícono Representativo
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '1.6rem', padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }}>
                {icono}
              </span>
              {iconosSugeridos.map((ic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcono(ic)}
                  className="btn btn-secondary btn-icon"
                  style={{
                    width: '36px',
                    height: '36px',
                    fontSize: '1.2rem',
                    backgroundColor: icono === ic ? 'rgba(249, 115, 22, 0.3)' : 'rgba(255,255,255,0.05)',
                    borderColor: icono === ic ? 'var(--primary)' : 'transparent'
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
              Descripción (Opcional)
            </label>
            <input
              type="text"
              placeholder="Breve detalle de los productos incluidos..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
              Crear Categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
  },
  descripcion: {
    type: String,
    default: '',
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'El stock no puede ser negativo'],
  },
  stockMinimo: {
    type: Number,
    default: 5,
    min: 0,
  },
  imagen: {
    type: String,
    default: '',
  },
  imagenes: [{
    type: String,
  }],
  codigoBarra: {
    type: String,
    default: '',
    index: true,
  },
  unidadMedida: {
    type: String,
    enum: ['unidad', 'varilla', 'metro', 'kilogramo', 'litro', 'lata', 'rollo', 'bolsa', 'caja', 'par', 'juego', 'm³', 'millar', 'pack'],
    default: 'unidad',
  },
  marca: {
    type: String,
    default: '',
    trim: true,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: [true, 'La categoría es obligatoria'],
  },
  destacado: {
    type: Boolean,
    default: false,
  },
  activo: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Índices para búsqueda eficiente
ProductoSchema.index({ nombre: 'text', descripcion: 'text', marca: 'text' });
ProductoSchema.index({ categoria: 1, activo: 1 });
ProductoSchema.index({ precio: 1 });
ProductoSchema.index({ stock: 1 });

export default mongoose.models.Producto || mongoose.model('Producto', ProductoSchema);

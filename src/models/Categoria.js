import mongoose from 'mongoose';

const CategoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la categoría es obligatorio'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  descripcion: {
    type: String,
    default: '',
  },
  imagen: {
    type: String,
    default: '',
  },
  activa: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Genera slug automáticamente antes de guardar
CategoriaSchema.pre('validate', function (next) {
  if (this.nombre && !this.slug) {
    this.slug = this.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quita acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.models.Categoria || mongoose.model('Categoria', CategoriaSchema);

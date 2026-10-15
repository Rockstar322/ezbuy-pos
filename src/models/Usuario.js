import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
  },
  rol: {
    type: String,
    enum: ['maestro', 'dueno', 'trabajador'],
    required: true,
    default: 'trabajador',
  },
  activo: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Evita re-compilar el modelo en hot-reload
export default mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);

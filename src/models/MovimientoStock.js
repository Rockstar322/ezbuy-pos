import mongoose from 'mongoose';

const MovimientoStockSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  tipo: {
    type: String,
    enum: ['entrada', 'salida', 'ajuste'],
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1'],
  },
  stockAnterior: {
    type: Number,
    required: true,
  },
  stockNuevo: {
    type: Number,
    required: true,
  },
  motivo: {
    type: String,
    enum: ['venta', 'restock', 'ajuste_manual', 'devolucion', 'carga_masiva', 'pedido_online'],
    required: true,
  },
  nota: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Índices para consultas frecuentes
MovimientoStockSchema.index({ producto: 1, createdAt: -1 });
MovimientoStockSchema.index({ usuario: 1, createdAt: -1 });
MovimientoStockSchema.index({ tipo: 1 });
MovimientoStockSchema.index({ createdAt: -1 });

export default mongoose.models.MovimientoStock || mongoose.model('MovimientoStock', MovimientoStockSchema);

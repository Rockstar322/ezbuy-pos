/**
 * Script de seed para poblar la base de datos con datos de ejemplo.
 * 
 * Uso: node --experimental-modules src/scripts/seed.mjs
 * 
 * IMPORTANTE: Configura MONGODB_URI antes de ejecutar.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── Configuración ───────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Define MONGODB_URI como variable de entorno');
  process.exit(1);
}

// ─── Esquemas (duplicados aquí para independencia del script) ─
const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  rol: { type: String, enum: ['maestro', 'dueno', 'trabajador'] },
  activo: { type: Boolean, default: true },
}, { timestamps: true });

const CategoriaSchema = new mongoose.Schema({
  nombre: String,
  slug: { type: String, unique: true },
  descripcion: String,
  imagen: String,
  activa: { type: Boolean, default: true },
}, { timestamps: true });

const ProductoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  stock: Number,
  stockMinimo: { type: Number, default: 5 },
  imagen: String,
  imagenes: [String],
  codigoBarra: String,
  unidadMedida: String,
  marca: String,
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  destacado: { type: Boolean, default: false },
  activo: { type: Boolean, default: true },
}, { timestamps: true });

const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);
const Categoria = mongoose.models.Categoria || mongoose.model('Categoria', CategoriaSchema);
const Producto = mongoose.models.Producto || mongoose.model('Producto', ProductoSchema);

// ─── Datos de Seed ───────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await Promise.all([
      Usuario.deleteMany({}),
      Categoria.deleteMany({}),
      Producto.deleteMany({}),
    ]);
    console.log('🗑️  Datos anteriores eliminados');

    // ── Usuarios ──
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const usuarios = await Usuario.insertMany([
      {
        nombre: 'Administrador Maestro',
        email: 'maestro@ferreteria.com',
        password: hashedPassword,
        rol: 'maestro',
      },
      {
        nombre: 'Juan Pérez (Dueño)',
        email: 'dueno@ferreteria.com',
        password: hashedPassword,
        rol: 'dueno',
      },
      {
        nombre: 'Carlos López (Trabajador)',
        email: 'trabajador@ferreteria.com',
        password: hashedPassword,
        rol: 'trabajador',
      },
    ]);
    console.log(`👥 ${usuarios.length} usuarios creados`);

    // ── Categorías ──
    const categorias = await Categoria.insertMany([
      {
        nombre: 'Herramientas Manuales',
        slug: 'herramientas-manuales',
        descripcion: 'Martillos, llaves, alicates, destornilladores y más',
      },
      {
        nombre: 'Herramientas Eléctricas',
        slug: 'herramientas-electricas',
        descripcion: 'Taladros, sierras, amoladoras y equipos eléctricos',
      },
      {
        nombre: 'Materiales de Construcción',
        slug: 'materiales-construccion',
        descripcion: 'Cemento, arena, ladrillos, fierro y más',
      },
      {
        nombre: 'Tubería y Conexiones',
        slug: 'tuberia-conexiones',
        descripcion: 'Tubos PVC, codos, uniones, llaves de paso',
      },
      {
        nombre: 'Pinturas y Acabados',
        slug: 'pinturas-acabados',
        descripcion: 'Pinturas, brochas, rodillos, thinner, masilla',
      },
      {
        nombre: 'Electricidad',
        slug: 'electricidad',
        descripcion: 'Cables, interruptores, tomacorrientes, tableros',
      },
      {
        nombre: 'Tornillería y Fijación',
        slug: 'tornilleria-fijacion',
        descripcion: 'Tornillos, clavos, pernos, tarugos, anclas',
      },
      {
        nombre: 'Seguridad',
        slug: 'seguridad',
        descripcion: 'Candados, cerraduras, chapas, cadenas',
      },
    ]);
    console.log(`📂 ${categorias.length} categorías creadas`);

    // Mapa de categorías para referencia rápida
    const cat = {};
    categorias.forEach((c) => {
      cat[c.slug] = c._id;
    });

    // ── Productos ──
    const productos = await Producto.insertMany([
      // Herramientas Manuales
      {
        nombre: 'Martillo Carpintero 16oz Stanley',
        descripcion: 'Martillo de carpintero con mango de fibra de vidrio, cabeza pulida de acero forjado.',
        precio: 45.90,
        stock: 25,
        stockMinimo: 5,
        codigoBarra: 'HM-001',
        unidadMedida: 'unidad',
        marca: 'Stanley',
        categoria: cat['herramientas-manuales'],
        destacado: true,
      },
      {
        nombre: 'Juego de Llaves Allen 9 Piezas',
        descripcion: 'Set de llaves hexagonales de 1.5mm a 10mm en acero cromo vanadio.',
        precio: 18.50,
        stock: 40,
        stockMinimo: 10,
        codigoBarra: 'HM-002',
        unidadMedida: 'juego',
        marca: 'Tramontina',
        categoria: cat['herramientas-manuales'],
      },
      {
        nombre: 'Alicate Universal 8" Knipex',
        descripcion: 'Alicate de corte diagonal con mango ergonómico antideslizante.',
        precio: 89.00,
        stock: 15,
        stockMinimo: 3,
        codigoBarra: 'HM-003',
        unidadMedida: 'unidad',
        marca: 'Knipex',
        categoria: cat['herramientas-manuales'],
        destacado: true,
      },
      {
        nombre: 'Destornillador Estrella Phillips #2',
        descripcion: 'Destornillador Phillips con punta magnética y mango antideslizante.',
        precio: 12.00,
        stock: 60,
        stockMinimo: 15,
        codigoBarra: 'HM-004',
        unidadMedida: 'unidad',
        marca: 'Stanley',
        categoria: cat['herramientas-manuales'],
      },

      // Herramientas Eléctricas
      {
        nombre: 'Taladro Percutor 13mm Bosch GSB 550',
        descripcion: 'Taladro percutor de 550W, mandril de 13mm, ideal para concreto y madera.',
        precio: 189.00,
        stock: 12,
        stockMinimo: 3,
        codigoBarra: 'HE-001',
        unidadMedida: 'unidad',
        marca: 'Bosch',
        categoria: cat['herramientas-electricas'],
        destacado: true,
      },
      {
        nombre: 'Amoladora Angular 4 1/2" DeWalt',
        descripcion: 'Amoladora de 900W con disco de 4.5 pulgadas para corte y desbaste.',
        precio: 245.00,
        stock: 8,
        stockMinimo: 2,
        codigoBarra: 'HE-002',
        unidadMedida: 'unidad',
        marca: 'DeWalt',
        categoria: cat['herramientas-electricas'],
      },

      // Materiales de Construcción
      {
        nombre: 'Cemento Sol Tipo I 42.5kg',
        descripcion: 'Cemento Portland Tipo I, bolsa de 42.5kg. Ideal para estructuras y acabados.',
        precio: 32.50,
        stock: 200,
        stockMinimo: 50,
        codigoBarra: 'MC-001',
        unidadMedida: 'bolsa',
        marca: 'Sol',
        categoria: cat['materiales-construccion'],
        destacado: true,
      },
      {
        nombre: 'Fierro Corrugado 1/2" x 9m',
        descripcion: 'Varilla de acero corrugado de 1/2 pulgada, 9 metros de largo. Grado 60.',
        precio: 28.00,
        stock: 150,
        stockMinimo: 30,
        codigoBarra: 'MC-002',
        unidadMedida: 'unidad',
        marca: 'Aceros Arequipa',
        categoria: cat['materiales-construccion'],
      },
      {
        nombre: 'Ladrillo King Kong 18 Huecos',
        descripcion: 'Ladrillo de arcilla de 18 huecos para muros portantes.',
        precio: 0.85,
        stock: 5000,
        stockMinimo: 500,
        codigoBarra: 'MC-003',
        unidadMedida: 'unidad',
        marca: 'Pirámide',
        categoria: cat['materiales-construccion'],
      },

      // Tubería
      {
        nombre: 'Tubo PVC 1/2" x 5m Agua Fría',
        descripcion: 'Tubo de PVC para agua fría, clase 10, de 1/2 pulgada por 5 metros.',
        precio: 8.50,
        stock: 80,
        stockMinimo: 20,
        codigoBarra: 'TC-001',
        unidadMedida: 'unidad',
        marca: 'Pavco',
        categoria: cat['tuberia-conexiones'],
      },
      {
        nombre: 'Tubo PVC 3/4" x 5m Agua Fría',
        descripcion: 'Tubo de PVC para agua fría, clase 10, de 3/4 pulgada por 5 metros.',
        precio: 12.00,
        stock: 60,
        stockMinimo: 15,
        codigoBarra: 'TC-002',
        unidadMedida: 'unidad',
        marca: 'Pavco',
        categoria: cat['tuberia-conexiones'],
      },
      {
        nombre: 'Codo PVC 1/2" x 90°',
        descripcion: 'Codo de PVC de 1/2 pulgada a 90 grados para conexiones de agua.',
        precio: 1.20,
        stock: 300,
        stockMinimo: 50,
        codigoBarra: 'TC-003',
        unidadMedida: 'unidad',
        marca: 'Pavco',
        categoria: cat['tuberia-conexiones'],
      },

      // Pinturas
      {
        nombre: 'Pintura Látex Blanca 4L Vencedor',
        descripcion: 'Pintura látex lavable color blanco, acabado mate, rendimiento 40m² por galón.',
        precio: 45.00,
        stock: 30,
        stockMinimo: 8,
        codigoBarra: 'PA-001',
        unidadMedida: 'unidad',
        marca: 'Vencedor',
        categoria: cat['pinturas-acabados'],
        destacado: true,
      },
      {
        nombre: 'Thinner Acrílico 1L',
        descripcion: 'Diluyente acrílico de alta calidad para pinturas y barnices.',
        precio: 15.00,
        stock: 45,
        stockMinimo: 10,
        codigoBarra: 'PA-002',
        unidadMedida: 'litro',
        marca: 'Tekno',
        categoria: cat['pinturas-acabados'],
      },

      // Electricidad
      {
        nombre: 'Cable THW 14 AWG Rojo x 100m',
        descripcion: 'Cable eléctrico unipolar THW calibre 14, rollo de 100 metros.',
        precio: 125.00,
        stock: 20,
        stockMinimo: 5,
        codigoBarra: 'EL-001',
        unidadMedida: 'rollo',
        marca: 'INDECO',
        categoria: cat['electricidad'],
      },
      {
        nombre: 'Interruptor Simple Bticino',
        descripcion: 'Interruptor de luz simple con placa, color blanco, empotrable.',
        precio: 8.90,
        stock: 100,
        stockMinimo: 20,
        codigoBarra: 'EL-002',
        unidadMedida: 'unidad',
        marca: 'Bticino',
        categoria: cat['electricidad'],
      },

      // Tornillería
      {
        nombre: 'Tornillo Drywall 6x1" (Caja x 100)',
        descripcion: 'Tornillos para drywall punta broca, cabeza phillips, caja de 100 unidades.',
        precio: 8.00,
        stock: 150,
        stockMinimo: 30,
        codigoBarra: 'TF-001',
        unidadMedida: 'caja',
        marca: 'Fix',
        categoria: cat['tornilleria-fijacion'],
      },
      {
        nombre: 'Clavo de Acero 2" (kg)',
        descripcion: 'Clavos de acero de 2 pulgadas, venta por kilogramo.',
        precio: 6.50,
        stock: 50,
        stockMinimo: 10,
        codigoBarra: 'TF-002',
        unidadMedida: 'kilogramo',
        marca: 'Prodac',
        categoria: cat['tornilleria-fijacion'],
      },

      // Seguridad
      {
        nombre: 'Candado Laminado 40mm Yale',
        descripcion: 'Candado de acero laminado con 3 llaves, arco endurecido.',
        precio: 35.00,
        stock: 25,
        stockMinimo: 5,
        codigoBarra: 'SE-001',
        unidadMedida: 'unidad',
        marca: 'Yale',
        categoria: cat['seguridad'],
      },
      {
        nombre: 'Cerradura de Sobreponer 3 Golpes',
        descripcion: 'Cerradura de sobreponer con 3 puntos de cierre, incluye 3 llaves.',
        precio: 85.00,
        stock: 3,
        stockMinimo: 5,
        codigoBarra: 'SE-002',
        unidadMedida: 'unidad',
        marca: 'Cantol',
        categoria: cat['seguridad'],
        destacado: true,
      },
    ]);
    console.log(`📦 ${productos.length} productos creados`);

    console.log('\n══════════════════════════════════════════');
    console.log('✅ Seed completado exitosamente');
    console.log('══════════════════════════════════════════');
    console.log('\n📧 Credenciales de acceso:');
    console.log('   Maestro:     maestro@ferreteria.com / admin123');
    console.log('   Dueño:       dueno@ferreteria.com / admin123');
    console.log('   Trabajador:  trabajador@ferreteria.com / admin123');
    console.log('');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();

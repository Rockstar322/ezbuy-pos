import dbConnect from '@/lib/mongodb';
import Producto from '@/models/Producto';
import { verificarAuth } from '@/lib/utils';

/**
 * GET /api/productos
 * Lista productos con filtros, búsqueda y paginación.
 * Acceso: público (web) y autenticado (admin)
 */
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const categoria = searchParams.get('categoria') || '';
    const destacado = searchParams.get('destacado');
    const ordenar = searchParams.get('ordenar') || 'createdAt';
    const orden = searchParams.get('orden') === 'asc' ? 1 : -1;
    const stockBajo = searchParams.get('stockBajo');

    // Construir filtro
    const filtro = { activo: true };

    if (search) {
      filtro.$text = { $search: search };
    }

    if (categoria) {
      filtro.categoria = categoria;
    }

    if (destacado === 'true') {
      filtro.destacado = true;
    }

    if (stockBajo === 'true') {
      filtro.$expr = { $lte: ['$stock', '$stockMinimo'] };
    }

    const skip = (page - 1) * limit;

    const [productos, total] = await Promise.all([
      Producto.find(filtro)
        .populate('categoria', 'nombre slug')
        .sort({ [ordenar]: orden })
        .skip(skip)
        .limit(limit)
        .lean(),
      Producto.countDocuments(filtro),
    ]);

    return Response.json({
      productos,
      paginacion: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return Response.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/productos
 * Crear un nuevo producto.
 * Acceso: maestro, dueño
 */
export async function POST(request) {
  try {
    const resultado = await verificarAuth(['maestro', 'dueno']);
    if (resultado.error) {
      return Response.json(
        { error: resultado.error },
        { status: resultado.status }
      );
    }

    await dbConnect();

    const body = await request.json();
    const producto = await Producto.create(body);

    return Response.json(producto, { status: 201 });
  } catch (error) {
    console.error('Error al crear producto:', error);

    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map((e) => e.message);
      return Response.json(
        { error: 'Datos inválidos', detalles: errores },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}

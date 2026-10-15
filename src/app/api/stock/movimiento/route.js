import dbConnect from '@/lib/mongodb';
import Producto from '@/models/Producto';
import MovimientoStock from '@/models/MovimientoStock';
import { verificarAuth } from '@/lib/utils';

/**
 * POST /api/stock/movimiento
 * Registra un movimiento de stock (entrada, salida o ajuste).
 * Acceso: maestro, dueño, trabajador
 */
export async function POST(request) {
  try {
    const resultado = await verificarAuth(['maestro', 'dueno', 'trabajador']);
    if (resultado.error) {
      return Response.json(
        { error: resultado.error },
        { status: resultado.status }
      );
    }

    await dbConnect();

    const { productoId, tipo, cantidad, motivo, nota } = await request.json();

    // Validaciones
    if (!productoId || !tipo || !cantidad || !motivo) {
      return Response.json(
        { error: 'Faltan campos obligatorios: productoId, tipo, cantidad, motivo' },
        { status: 400 }
      );
    }

    if (!['entrada', 'salida', 'ajuste'].includes(tipo)) {
      return Response.json(
        { error: 'Tipo inválido. Debe ser: entrada, salida o ajuste' },
        { status: 400 }
      );
    }

    if (cantidad <= 0) {
      return Response.json(
        { error: 'La cantidad debe ser mayor a 0' },
        { status: 400 }
      );
    }

    const producto = await Producto.findById(productoId);

    if (!producto) {
      return Response.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    const stockAnterior = producto.stock;
    let stockNuevo;

    switch (tipo) {
      case 'entrada':
        stockNuevo = stockAnterior + cantidad;
        break;
      case 'salida':
        if (stockAnterior < cantidad) {
          return Response.json(
            {
              error: `Stock insuficiente. Stock actual: ${stockAnterior}, solicitado: ${cantidad}`,
            },
            { status: 400 }
          );
        }
        stockNuevo = stockAnterior - cantidad;
        break;
      case 'ajuste':
        stockNuevo = cantidad; // El ajuste establece el stock directamente
        break;
    }

    // Actualizar stock del producto
    producto.stock = stockNuevo;
    await producto.save();

    // Registrar el movimiento
    const movimiento = await MovimientoStock.create({
      producto: productoId,
      usuario: resultado.session.user.id,
      tipo,
      cantidad,
      stockAnterior,
      stockNuevo,
      motivo,
      nota: nota || '',
    });

    return Response.json(
      {
        mensaje: `Stock actualizado correctamente. ${stockAnterior} → ${stockNuevo}`,
        movimiento,
        stockActual: stockNuevo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al registrar movimiento:', error);
    return Response.json(
      { error: 'Error al registrar movimiento de stock' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stock/movimiento
 * Historial de movimientos de stock.
 * Acceso: maestro, dueño
 */
export async function GET(request) {
  try {
    const resultado = await verificarAuth(['maestro', 'dueno']);
    if (resultado.error) {
      return Response.json(
        { error: resultado.error },
        { status: resultado.status }
      );
    }

    await dbConnect();

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const productoId = searchParams.get('productoId');
    const tipo = searchParams.get('tipo');
    const desde = searchParams.get('desde');
    const hasta = searchParams.get('hasta');

    const filtro = {};

    if (productoId) filtro.producto = productoId;
    if (tipo) filtro.tipo = tipo;

    if (desde || hasta) {
      filtro.createdAt = {};
      if (desde) filtro.createdAt.$gte = new Date(desde);
      if (hasta) filtro.createdAt.$lte = new Date(hasta);
    }

    const skip = (page - 1) * limit;

    const [movimientos, total] = await Promise.all([
      MovimientoStock.find(filtro)
        .populate('producto', 'nombre codigoBarra')
        .populate('usuario', 'nombre email rol')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MovimientoStock.countDocuments(filtro),
    ]);

    return Response.json({
      movimientos,
      paginacion: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    return Response.json(
      { error: 'Error al obtener movimientos' },
      { status: 500 }
    );
  }
}

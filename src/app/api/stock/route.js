import dbConnect from '@/lib/mongodb';
import Producto from '@/models/Producto';
import MovimientoStock from '@/models/MovimientoStock';
import { verificarAuth } from '@/lib/utils';

/**
 * GET /api/stock
 * Resumen del stock actual.
 * Acceso: maestro, dueño, trabajador
 */
export async function GET(request) {
  try {
    const resultado = await verificarAuth(['maestro', 'dueno', 'trabajador']);
    if (resultado.error) {
      return Response.json(
        { error: resultado.error },
        { status: resultado.status }
      );
    }

    await dbConnect();

    const { searchParams } = request.nextUrl;
    const soloStockBajo = searchParams.get('stockBajo') === 'true';

    let filtro = { activo: true };
    if (soloStockBajo) {
      filtro.$expr = { $lte: ['$stock', '$stockMinimo'] };
    }

    const productos = await Producto.find(filtro)
      .populate('categoria', 'nombre')
      .select('nombre stock stockMinimo precio categoria unidadMedida codigoBarra')
      .sort({ stock: 1 })
      .lean();

    // Estadísticas generales
    const stats = await Producto.aggregate([
      { $match: { activo: true } },
      {
        $group: {
          _id: null,
          totalProductos: { $sum: 1 },
          valorTotal: { $sum: { $multiply: ['$precio', '$stock'] } },
          productosStockBajo: {
            $sum: {
              $cond: [{ $lte: ['$stock', '$stockMinimo'] }, 1, 0],
            },
          },
          productosSinStock: {
            $sum: {
              $cond: [{ $eq: ['$stock', 0] }, 1, 0],
            },
          },
        },
      },
    ]);

    return Response.json({
      productos,
      estadisticas: stats[0] || {
        totalProductos: 0,
        valorTotal: 0,
        productosStockBajo: 0,
        productosSinStock: 0,
      },
    });
  } catch (error) {
    console.error('Error al obtener stock:', error);
    return Response.json(
      { error: 'Error al obtener stock' },
      { status: 500 }
    );
  }
}

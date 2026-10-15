import dbConnect from '@/lib/mongodb';
import Producto from '@/models/Producto';
import { verificarAuth } from '@/lib/utils';

/**
 * GET /api/productos/[id]
 * Obtener un producto por ID.
 * Acceso: público
 */
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const producto = await Producto.findById(id)
      .populate('categoria', 'nombre slug')
      .lean();

    if (!producto) {
      return Response.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return Response.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return Response.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/productos/[id]
 * Actualizar un producto.
 * Acceso: maestro, dueño
 */
export async function PUT(request, { params }) {
  try {
    const resultado = await verificarAuth(['maestro', 'dueno']);
    if (resultado.error) {
      return Response.json(
        { error: resultado.error },
        { status: resultado.status }
      );
    }

    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const producto = await Producto.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('categoria', 'nombre slug');

    if (!producto) {
      return Response.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return Response.json(producto);
  } catch (error) {
    console.error('Error al actualizar producto:', error);

    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map((e) => e.message);
      return Response.json(
        { error: 'Datos inválidos', detalles: errores },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/productos/[id]
 * Eliminar (soft delete) un producto.
 * Acceso: maestro, dueño
 */
export async function DELETE(request, { params }) {
  try {
    const resultado = await verificarAuth(['maestro', 'dueno']);
    if (resultado.error) {
      return Response.json(
        { error: resultado.error },
        { status: resultado.status }
      );
    }

    await dbConnect();
    const { id } = await params;

    // Soft delete: solo marca como inactivo
    const producto = await Producto.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!producto) {
      return Response.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return Response.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return Response.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}

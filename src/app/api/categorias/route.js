import dbConnect from '@/lib/mongodb';
import Categoria from '@/models/Categoria';
import { verificarAuth } from '@/lib/utils';

/**
 * GET /api/categorias
 * Lista todas las categorías activas.
 * Acceso: público
 */
export async function GET() {
  try {
    await dbConnect();

    const categorias = await Categoria.find({ activa: true })
      .sort({ nombre: 1 })
      .lean();

    return Response.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return Response.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categorias
 * Crear una nueva categoría.
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
    const categoria = await Categoria.create(body);

    return Response.json(categoria, { status: 201 });
  } catch (error) {
    console.error('Error al crear categoría:', error);

    if (error.code === 11000) {
      return Response.json(
        { error: 'Ya existe una categoría con ese nombre' },
        { status: 409 }
      );
    }

    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map((e) => e.message);
      return Response.json(
        { error: 'Datos inválidos', detalles: errores },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Error al crear categoría' },
      { status: 500 }
    );
  }
}

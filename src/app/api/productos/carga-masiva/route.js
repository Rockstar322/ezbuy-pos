import dbConnect from '@/lib/mongodb';
import Producto from '@/models/Producto';
import { verificarAuth } from '@/lib/utils';

/**
 * POST /api/productos/carga-masiva
 * Carga masiva de productos desde un JSON (parseado de CSV en el frontend).
 * Acceso: maestro, dueño
 * 
 * Body esperado:
 * {
 *   productos: [
 *     { nombre, categoria, precio, stock, codigoBarra?, marca?, unidadMedida? },
 *     ...
 *   ]
 * }
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

    const { productos } = await request.json();

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return Response.json(
        { error: 'Debes enviar un array de productos' },
        { status: 400 }
      );
    }

    const resultados = {
      creados: 0,
      actualizados: 0,
      errores: [],
    };

    for (let i = 0; i < productos.length; i++) {
      const item = productos[i];

      try {
        if (!item.nombre || !item.precio || !item.categoria) {
          resultados.errores.push({
            fila: i + 1,
            error: 'Faltan campos obligatorios (nombre, precio, categoria)',
            datos: item,
          });
          continue;
        }

        // Si tiene código de barra, intenta actualizar el existente
        if (item.codigoBarra) {
          const existente = await Producto.findOne({
            codigoBarra: item.codigoBarra,
          });

          if (existente) {
            existente.stock += item.stock || 0;
            existente.precio = item.precio;
            if (item.nombre) existente.nombre = item.nombre;
            await existente.save();
            resultados.actualizados++;
            continue;
          }
        }

        await Producto.create({
          nombre: item.nombre,
          descripcion: item.descripcion || '',
          precio: parseFloat(item.precio),
          stock: parseInt(item.stock) || 0,
          categoria: item.categoria,
          codigoBarra: item.codigoBarra || '',
          marca: item.marca || '',
          unidadMedida: item.unidadMedida || 'unidad',
        });

        resultados.creados++;
      } catch (error) {
        resultados.errores.push({
          fila: i + 1,
          error: error.message,
          datos: item,
        });
      }
    }

    return Response.json({
      mensaje: `Carga completada: ${resultados.creados} creados, ${resultados.actualizados} actualizados, ${resultados.errores.length} errores`,
      resultados,
    });
  } catch (error) {
    console.error('Error en carga masiva:', error);
    return Response.json(
      { error: 'Error en la carga masiva' },
      { status: 500 }
    );
  }
}

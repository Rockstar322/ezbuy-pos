import { auth } from '@/lib/auth';

/**
 * Helper para verificar autenticación y rol en API routes.
 * Retorna la sesión si el usuario tiene el rol requerido,
 * o null si no está autorizado.
 */
export async function verificarAuth(rolesPermitidos = []) {
  const session = await auth();

  if (!session?.user) {
    return { error: 'No autenticado', status: 401 };
  }

  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(session.user.rol)) {
    return { error: 'No autorizado', status: 403 };
  }

  return { session };
}

/**
 * Genera un slug a partir de un string.
 */
export function generarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Formatea un precio en Soles peruanos.
 */
export function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(precio);
}

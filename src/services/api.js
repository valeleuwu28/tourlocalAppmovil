import { API_URL } from '../config';

/**
 * Servicio centralizado para peticiones a la API REST de TourLocal
 */

export async function getDestinos(categoria = 'Todos') {
  const query =
    categoria && categoria !== 'Todos'
      ? `?categoria=${encodeURIComponent(categoria)}`
      : '';
  const res = await fetch(`${API_URL}/api/destinos${query}`);
  if (!res.ok) throw new Error('Error al obtener destinos');
  return res.json();
}

export async function getDestinoById(id) {
  const res = await fetch(`${API_URL}/api/destinos/${id}`);
  if (!res.ok) throw new Error('Error al obtener detalle del destino');
  return res.json();
}

export async function getHorarios() {
  const res = await fetch(`${API_URL}/api/horarios`);
  if (!res.ok) throw new Error('Error al obtener horarios');
  return res.json();
}

export async function getReservas(userId, token) {
  const res = await fetch(`${API_URL}/api/reservas`, {
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': String(userId || '1'),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error('Error al obtener historial de reservas');
  return res.json();
}

export async function createReserva(reservaData, userId, token) {
  const res = await fetch(`${API_URL}/api/reservas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': String(userId || '1'),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(reservaData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Error al crear reserva');
  }
  return res.json();
}

export async function cancelReserva(id, userId, token) {
  const res = await fetch(`${API_URL}/api/reservas/${id}`, {
    method: 'DELETE',
    headers: {
      'X-User-Id': String(userId || '1'),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error('Error al cancelar reserva');
  return res.json();
}

export async function getGuardados(userId) {
  const res = await fetch(`${API_URL}/api/guardados`, {
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': String(userId || '1'),
    },
  });
  if (!res.ok) throw new Error('Error al obtener guardados');
  return res.json();
}

export async function toggleGuardado(id, isSaved, userId) {
  const method = isSaved ? 'DELETE' : 'POST';
  const url = isSaved
    ? `${API_URL}/api/guardados/${id}`
    : `${API_URL}/api/guardados`;

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': String(userId || '1'),
    },
    ...(method === 'POST' ? { body: JSON.stringify({ id }) } : {}),
  });
  if (!res.ok) throw new Error('Error al actualizar guardado');
  return res.json();
}

export default {
  getDestinos,
  getDestinoById,
  getHorarios,
  getReservas,
  createReserva,
  cancelReserva,
  getGuardados,
  toggleGuardado,
};

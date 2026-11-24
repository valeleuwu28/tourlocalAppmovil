const meses = {
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  setiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
};

/**
 * Parsea una fecha (ISO "YYYY-MM-DD" o formato largo en español) y un horario ("10:00 AM", "03:30 PM", "14:00")
 * a un objeto Date de JavaScript.
 */
export function parseTourDateTime(fecha, horario) {
  if (!fecha) return null;
  const fechaStr = String(fecha).trim();
  const horarioStr = typeof horario === 'string' ? horario.trim() : '00:00';

  let year;
  let month;
  let day;

  const isoDate = fechaStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const dateWithoutWeekday = fechaStr.includes(',')
    ? fechaStr.slice(fechaStr.indexOf(',') + 1).trim()
    : fechaStr;

  const spanishDate = dateWithoutWeekday.match(
    /^(\d{1,2})\s+de\s+([\p{L}]+)\s+de\s+(\d{4})/iu
  );

  if (isoDate) {
    [, year, month, day] = isoDate;
    month = Number(month) - 1;
  } else if (spanishDate) {
    [, day, month, year] = spanishDate;
    month = meses[month.toLowerCase()];
  } else {
    // Intentar Date nativo
    const parsed = new Date(fechaStr);
    if (!isNaN(parsed.getTime())) {
      year = parsed.getFullYear();
      month = parsed.getMonth();
      day = parsed.getDate();
    } else {
      return null;
    }
  }

  const timeMatch = horarioStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  let hours = 0;
  let minutes = 0;

  if (timeMatch) {
    hours = Number(timeMatch[1]);
    minutes = Number(timeMatch[2]);
    const period = timeMatch[3]?.toUpperCase();

    if (period) {
      hours = (hours % 12) + (period === 'PM' ? 12 : 0);
    }
  }

  if (month === undefined || isNaN(year) || isNaN(day)) return null;

  return new Date(Number(year), month, Number(day), hours, minutes, 0, 0);
}

/**
 * Determina si la fecha/hora de un tour ya pasó con respecto a la hora actual
 */
export function isTourPast(fecha, horario) {
  const tourDate = parseTourDateTime(fecha, horario);
  if (!tourDate) return false;
  return tourDate.getTime() <= Date.now();
}

/**
 * Determina si un slot/horario específico ya pasó para la fecha seleccionada
 */
export function isSlotPassed(selectedDate, timeStr) {
  if (!selectedDate || !timeStr) return false;

  const now = new Date();
  const sel = new Date(selectedDate);

  const isToday =
    sel.getFullYear() === now.getFullYear() &&
    sel.getMonth() === now.getMonth() &&
    sel.getDate() === now.getDate();

  if (!isToday) {
    const selMidnight = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate()).getTime();
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return selMidnight < nowMidnight;
  }

  // Parsear la hora del slot
  const timeMatch = String(timeStr).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!timeMatch) return false;

  let slotHours = Number(timeMatch[1]);
  const slotMinutes = Number(timeMatch[2]);
  const period = timeMatch[3]?.toUpperCase();

  if (period) {
    slotHours = (slotHours % 12) + (period === 'PM' ? 12 : 0);
  }

  const slotTimeInMinutes = slotHours * 60 + slotMinutes;
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

  return slotTimeInMinutes <= currentTimeInMinutes;
}

/**
 * Determina si una reserva puede ser cancelada:
 * - Debe estar en estado "confirmada" o "pendiente"
 * - La fecha y horario del tour NO deben haber pasado
 */
export function canCancelReservation(reserva) {
  if (!reserva) return false;
  const estadoKey = (reserva.estado || 'confirmada').toLowerCase();
  const estadoValido = estadoKey === 'confirmada' || estadoKey === 'pendiente';
  if (!estadoValido) return false;

  // Si la fecha del tour ya pasó, no se puede cancelar
  return !isTourPast(reserva.fecha, reserva.horario);
}

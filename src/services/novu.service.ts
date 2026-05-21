/**
 * Archivo: novu.service.ts
 * Responsabilidad: Servicio para disparar workflows de Novu.
 * Tipo: servicio
 */

import { Novu } from '@novu/node';

const novu = new Novu(process.env.NOVU_API_KEY || '', {
  backendUrl: 'https://novu.belenquantum.online/api',
});

interface NewReservationPayload {
  guestName: string;
  partySize: number;
  date: string;
  time: string;
  [key: string]: string | number;
}

//-aqui empieza funcion triggerNewReservation y es para notificar al dashboard de nueva reserva-//
/**
 * Dispara el workflow 'new-reservation-dashboard' en Novu.
 * @sideEffect
 */
export async function triggerNewReservation(
  subscriberId: string,
  payload: NewReservationPayload
): Promise<void> {
  await novu.trigger('new-reservation-dashboard', {
    to: {
      subscriberId,
    },
    payload,
  });
}
//-aqui termina funcion triggerNewReservation-//

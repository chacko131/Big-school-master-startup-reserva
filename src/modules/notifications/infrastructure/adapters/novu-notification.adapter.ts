/**
 * Archivo: novu-notification.adapter.ts
 * Responsabilidad: Implementar NotificationProvider usando el SDK de Novu.
 * Tipo: servicio
 */

import { Novu } from '@novu/node';
import { type NotificationProvider, type MemberAcceptedPayload, type IdentifySubscriberPayload, type NewReservationPayload } from "@/modules/notifications/domain/ports/notification-provider.port";

//-aqui empieza clase NovuNotificationAdapter y es para traducir los puertos al SDK de Novu-//
export class NovuNotificationAdapter implements NotificationProvider {
  private readonly client: Novu;
  private readonly logger = console;

  constructor() {
    const apiKey = process.env.NOVU_API_KEY;

    if (apiKey === undefined || apiKey.trim() === '') {
      throw new Error('NOVU_API_KEY is required');
    }

    this.client = new Novu(apiKey, {
      backendUrl: process.env.NOVU_BACKEND_URL || 'https://novu.belenquantum.online/api',
    });
  }

  //-aqui empieza funcion identifySubscriber y es para registrar o actualizar un subscriber en Novu-//
  /**
   * @sideEffect
   */
  async identifySubscriber(payload: IdentifySubscriberPayload): Promise<void> {
    try {
      await this.client.subscribers.identify(payload.subscriberId, {
        email: payload.email,
        firstName: payload.fullName ?? undefined,
      });
    } catch (error: unknown) {
      this.logger.error('Failed to identify subscriber in Novu', {
        subscriberId: payload.subscriberId,
        email: payload.email,
        fullName: payload.fullName,
        error,
      });

      throw error;
    }
  }
  //-aqui termina funcion identifySubscriber-//

  //-aqui empieza funcion notifyMemberAccepted y es para disparar el workflow member-accepted en Novu-//
  /**
   * @sideEffect
   */
  async notifyMemberAccepted(payload: MemberAcceptedPayload): Promise<void> {
    try {
      await this.client.trigger('member-accepted', {
        to: { subscriberId: payload.ownerSubscriberId },
        payload: {
          newMemberName: payload.newMemberName,
          newMemberRole: payload.newMemberRole,
          restaurantName: payload.restaurantName,
        },
      });
    } catch (error: unknown) {
      this.logger.error('Failed to trigger Novu workflow member-accepted', {
        workflow: 'member-accepted',
        ownerSubscriberId: payload.ownerSubscriberId,
        newMemberName: payload.newMemberName,
        newMemberRole: payload.newMemberRole,
        restaurantName: payload.restaurantName,
        error,
      });

      throw error;
    }
  }
  //-aqui termina funcion notifyMemberAccepted-//

  //-aqui empieza funcion notifyNewReservation y es para disparar la notificacion de nueva reserva en Novu-//
  /**
   * @sideEffect
   */
  async notifyNewReservation(payload: NewReservationPayload): Promise<void> {
    console.log("[Novu Adapter Debug] notifyNewReservation invocado con payload:", JSON.stringify(payload, null, 2));
    try {
      const response = await this.client.trigger('new-reservation-dashboard', {
        to: payload.staffSubscriberIds.map((id) => ({ subscriberId: id })),
        payload: {
          guestName: payload.guestName,
          partySize: payload.partySize,
          date: payload.date,
          time: payload.time,
          restaurantName: payload.restaurantName,
          specialRequests: payload.specialRequests,
        },
      });
      console.log("[Novu Adapter Debug] Trigger de Novu completado exitosamente. Respuesta:", JSON.stringify(response.data, null, 2));
    } catch (error: unknown) {
      this.logger.error('[Novu Adapter Debug] Error al disparar trigger de Novu:', error);
      throw error;
    }
  }
  //-aqui termina funcion notifyNewReservation-//
}
//-aqui termina clase NovuNotificationAdapter-//

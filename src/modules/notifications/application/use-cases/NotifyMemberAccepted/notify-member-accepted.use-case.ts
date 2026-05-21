/**
 * Archivo: notify-member-accepted.use-case.ts
 * Responsabilidad: Orquestar el envío de notificación al dueño cuando un miembro acepta la invitación.
 * Tipo: lógica
 */

import { type NotificationProvider } from "@/modules/notifications/domain/ports/notification-provider.port";
import { type NotifyMemberAcceptedInput } from "../../dtos/notify-member-accepted.dto";

//-aqui empieza clase NotifyMemberAccepted y es para notificar al owner cuando un miembro entra al equipo-//
export class NotifyMemberAccepted {
  constructor(private readonly notificationProvider: NotificationProvider) {}

  //-aqui empieza funcion execute y es para disparar la notificacion in-app al owner-//
  /**
   * @sideEffect
   */
  async execute(input: NotifyMemberAcceptedInput): Promise<void> {
    await this.notificationProvider.notifyMemberAccepted({
      ownerSubscriberId: input.ownerSubscriberId,
      newMemberName: input.newMemberName,
      newMemberRole: input.newMemberRole,
      restaurantName: input.restaurantName,
    });
  }
  //-aqui termina funcion execute-//
}
//-aqui termina clase NotifyMemberAccepted-//

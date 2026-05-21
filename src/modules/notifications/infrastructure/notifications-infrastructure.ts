/**
 * Archivo: notifications-infrastructure.ts
 * Responsabilidad: Ensamblar las implementaciones concretas del módulo notifications.
 * Tipo: servicio
 */

import { type NotificationProvider } from "../domain/ports/notification-provider.port";
import { NovuNotificationAdapter } from "./adapters/novu-notification.adapter";

export interface NotificationsInfrastructure {
  notificationProvider: NotificationProvider;
}

//-aqui empieza funcion getNotificationsInfrastructure y es para construir la infraestructura de notificaciones-//
/**
 * Construye la infraestructura de notificaciones con el adaptador Novu.
 * @sideEffect
 */
export function getNotificationsInfrastructure(): NotificationsInfrastructure {
  return {
    notificationProvider: new NovuNotificationAdapter(),
  };
}
//-aqui termina funcion getNotificationsInfrastructure-//

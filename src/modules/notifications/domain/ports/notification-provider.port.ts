/**
 * Archivo: notification-provider.port.ts
 * Responsabilidad: Definir el contrato abstracto que cualquier proveedor de notificaciones debe cumplir.
 * Tipo: lógica
 */

export interface MemberAcceptedPayload {
  ownerSubscriberId: string;
  newMemberName: string;
  newMemberRole: string;
  restaurantName: string;
}

export interface IdentifySubscriberPayload {
  subscriberId: string;
  email: string;
  fullName: string | null;
}

//-aqui empieza interface NotificationProvider y es para abstraer el proveedor de notificaciones-//
export interface NotificationProvider {
  identifySubscriber(payload: IdentifySubscriberPayload): Promise<void>;
  notifyMemberAccepted(payload: MemberAcceptedPayload): Promise<void>;
}
//-aqui termina interface NotificationProvider-//

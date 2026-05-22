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

export interface NewReservationPayload {
  staffSubscriberIds: string[];
  guestName: string;
  partySize: number;
  date: string;
  time: string;
  restaurantName: string;
  specialRequests: string;
}

//-aqui empieza interface NotificationProvider y es para abstraer el proveedor de notificaciones-//
export interface NotificationProvider {
  identifySubscriber(payload: IdentifySubscriberPayload): Promise<void>;
  notifyMemberAccepted(payload: MemberAcceptedPayload): Promise<void>;
  notifyNewReservation(payload: NewReservationPayload): Promise<void>;
}
//-aqui termina interface NotificationProvider-//

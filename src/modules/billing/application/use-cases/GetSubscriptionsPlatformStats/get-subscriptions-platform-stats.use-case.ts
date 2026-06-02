/**
 * Archivo: get-subscriptions-platform-stats.use-case.ts
 * Responsabilidad: Obtener métricas agregadas de suscripciones para el panel de administración.
 * Tipo: lógica
 */

import { type SubscriptionRepository } from "../../../domain/ports/subscription.repository.port";

//-aqui empieza tipo SubscriptionsPlatformStatsResponse-//
export interface SubscriptionsPlatformStatsResponse {
  /** Total de suscripciones registradas en la plataforma. */
  totalSubscriptions: number;
  /** Suscripciones con status "active". */
  totalActive: number;
  /** Suscripciones con status "trialing" o dentro de trial local. */
  totalTrialing: number;
  /** Suscripciones con status "canceled". */
  totalCanceled: number;
  /** Suscripciones con status "past_due" (pago pendiente/fallido). */
  totalPastDue: number;
  /** Suscripciones cuyo periodo actual termina hoy (renovaciones inminentes). */
  totalRenewingToday: number;
  /** TODO: MRR total — requiere campo amountCents en schema o sync desde Stripe. */
  estimatedMrrCents: null;
  /** TODO: Pagos fallidos — requiere tabla de invoices/payments. */
  totalFailedPayments: null;
}
//-aqui termina tipo SubscriptionsPlatformStatsResponse-//

//-aqui empieza funcion helper isSameDay y es para comparar si dos fechas son el mismo día-//
/**
 * Compara si dos fechas caen en el mismo día calendario (UTC).
 * @pure
 */
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}
//-aqui termina funcion helper isSameDay-//

//-aqui empieza clase GetSubscriptionsPlatformStats y es para agregar métricas globales de billing-//
/**
 * Caso de uso para obtener estadísticas globales de suscripciones.
 * Trabaja exclusivamente con datos de la base de datos local.
 *
 * @sideEffect — lectura de base de datos.
 */
export class GetSubscriptionsPlatformStats {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  async execute(): Promise<SubscriptionsPlatformStatsResponse> {
    const subscriptions = await this.subscriptionRepository.findAll();
    const today = new Date();

    let totalActive = 0;
    let totalTrialing = 0;
    let totalCanceled = 0;
    let totalPastDue = 0;
    let totalRenewingToday = 0;

    for (const sub of subscriptions) {
      const status = sub.status;

      switch (status) {
        case "active":
          totalActive++;
          break;
        case "trialing":
          totalTrialing++;
          break;
        case "canceled":
          totalCanceled++;
          break;
        case "past_due":
          totalPastDue++;
          break;
      }

      if (isSameDay(sub.currentPeriodEnd, today)) {
        totalRenewingToday++;
      }
    }

    return {
      totalSubscriptions: subscriptions.length,
      totalActive,
      totalTrialing,
      totalCanceled,
      totalPastDue,
      totalRenewingToday,
      estimatedMrrCents: null,
      totalFailedPayments: null,
    };
  }
}
//-aqui termina clase GetSubscriptionsPlatformStats-//

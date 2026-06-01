/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de suscripciones del panel SaaS.
 * Tipo: UI
 */

import { AdminSubscriptionsView } from "@/components/admin/subscriptions/AdminSubscriptionsView";

interface AdminSubscriptionMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface AdminSubscriptionSourceDefinition {
  title: string;
  description: string;
}

interface AdminSubscriptionPendingItemDefinition {
  title: string;
  description: string;
}

const subscriptionMetricDefinitions: ReadonlyArray<AdminSubscriptionMetricDefinition> = [
  {
    label: "MRR total",
    value: "TODO",
    caption: "pendiente de una agregación global en servidor",
    tone: "primary",
  },
  {
    label: "Planes activos",
    value: "TODO",
    caption: "faltan métricas globales por estado y plan",
    tone: "secondary",
  },
  {
    label: "Pagos fallidos",
    value: "TODO",
    caption: "no existe todavía el agregado global de incidencias de billing",
    tone: "surface",
  },
  {
    label: "Renovaciones hoy",
    value: "TODO",
    caption: "pendiente de una query agregada por fecha de renovación",
    tone: "warning",
  },
] as const;

const availableSources: ReadonlyArray<AdminSubscriptionSourceDefinition> = [
  {
    title: "SubscriptionRepository",
    description:
      "Solo permite leer una suscripción concreta por restaurantId, stripeSubscriptionId o stripeCustomerId.",
  },
  {
    title: "GetCurrentPlanForRestaurant",
    description: "Devuelve el plan de un restaurante concreto. No sirve todavía para un resumen global de admin.",
  },
  {
    title: "PrismaSubscriptionRepository",
    description: "Ya persiste y recupera la suscripción real por restaurante, pero no lista todas las suscripciones.",
  },
  {
    title: "BillingInfrastructure",
    description: "Compone el repositorio y Stripe, pero no expone agregados globales para esta pantalla.",
  },
] as const;

const pendingItems: ReadonlyArray<AdminSubscriptionPendingItemDefinition> = [
  {
    title: "Listado global de suscripciones",
    description: "Falta una fuente agregada para mostrar todos los planes desde el panel admin.",
  },
  {
    title: "KPIs globales de billing",
    description: "MRR, pagos fallidos y renovaciones no están calculados aún para toda la plataforma.",
  },
  {
    title: "Facturas del admin",
    description: "No existe todavía una query de facturas para este panel global.",
  },
] as const;

//-aqui empieza pagina AdminSubscriptionsPage y es para supervisar billing-//
/**
 * Renderiza la vista de suscripciones del panel admin.
 */
export default function AdminSubscriptionsPage() {
  return (
    <AdminSubscriptionsView
      availableSources={availableSources}
      metrics={subscriptionMetricDefinitions}
      pendingItems={pendingItems}
    />
  );
}
//-aqui termina pagina AdminSubscriptionsPage-//

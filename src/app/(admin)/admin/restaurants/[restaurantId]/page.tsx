/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de detalle de un restaurante tenant.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { RestaurantDetailMetricCard, RestaurantDetailMetricDefinition } from "@/components/admin/restaurants/id/RestaurantDetailMetricCard";
import { RestaurantActivityRail } from "@/components/admin/restaurants/id/RestaurantActivityRail";

interface AdminRestaurantDetailPageProps {
  params:
    | {
        restaurantId: string;
      }
    | Promise<{
        restaurantId: string;
      }>;
}

interface RestaurantDetailSectionDefinition {
  title: string;
  description: string;
  value: string;
}

const restaurantDetailMetricDefinitions: ReadonlyArray<RestaurantDetailMetricDefinition> = [
  {
    label: "Estado",
    value: "Activo",
    caption: "tenant en operación normal",
    tone: "primary",
  },
  {
    label: "Plan",
    value: "Growth",
    caption: "suscripción actual",
    tone: "secondary",
  },
  {
    label: "Cobertura",
    value: "92%",
    caption: "uso estimado de las funciones clave",
    tone: "surface",
  },
  {
    label: "Riesgo",
    value: "Bajo",
    caption: "sin alertas críticas en el período",
    tone: "warning",
  },
] as const;

const restaurantDetailSectionDefinitions: ReadonlyArray<RestaurantDetailSectionDefinition> = [
  {
    title: "Timezone",
    value: "Europe/Madrid",
    description: "Alinea los horarios de reservas y avisos operativos.",
  },
  {
    title: "Líder del tenant",
    value: "Julian Rossi",
    description: "Usuario principal con acceso de administración.",
  },
  {
    title: "Último sync",
    value: "Hace 4 minutos",
    description: "Sincronización correcta de reservas y estados.",
  },
] as const;

/**
 * Renderiza el detalle de un restaurante del panel admin.
 */
export default async function AdminRestaurantDetailPage({ params }: AdminRestaurantDetailPageProps) {
  const { restaurantId } = await params;

  return (
    <>
      <section className="rounded-[28px] bg-primary px-6 py-8 text-on-primary shadow-sm md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-primary/70">
              <T>Tenant detail</T>
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              <T>Ficha del restaurante</T>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-on-primary/80">
              <T>Detalle operativo para inspeccionar configuración, actividad y estado interno del tenant seleccionado.</T>
            </p>
          </div>

          <div className="rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary/70">
              <T>ID del tenant</T>
            </p>
            <p className="mt-3 break-all text-sm font-semibold text-on-primary">
              {restaurantId}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {restaurantDetailMetricDefinitions.map((metricDefinition) => (
          <RestaurantDetailMetricCard
            caption={metricDefinition.caption}
            key={metricDefinition.label}
            label={metricDefinition.label}
            tone={metricDefinition.tone}
            value={metricDefinition.value}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.95fr]">
        <div className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Configuración base</T>
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
            <T>Contexto operativo</T>
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {restaurantDetailSectionDefinitions.map((sectionDefinition) => (
              <article className="rounded-2xl bg-surface-container-low p-4" key={sectionDefinition.title}>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                  <T>{sectionDefinition.title}</T>
                </p>
                <p className="mt-2 text-sm font-bold text-on-surface">
                  <T>{sectionDefinition.value}</T>
                </p>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                  <T>{sectionDefinition.description}</T>
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:opacity-90" href="/admin/restaurants">
              <OnboardingIcon name="arrowForward" className="h-4 w-4 rotate-180" />
              <T>Volver al listado</T>
            </Link>
            <button className="inline-flex items-center gap-2 rounded-full border border-outline-variant/20 px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low" type="button">
              <OnboardingIcon name="settings" className="h-4 w-4" />
              <T>Editar datos</T>
            </button>
          </div>
        </div>

        <RestaurantActivityRail />
      </section>
    </>
  );
}

/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de detalle de un restaurante tenant.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { RestaurantActivityRail } from "@/components/admin/restaurants/id/RestaurantActivityRail";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { GetRestaurantAdminDetailsUseCase } from "@/modules/catalog/application/use-cases/get-restaurant-admin-details.use-case";
import { notFound } from "next/navigation";

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



/**
 * Renderiza el detalle de un restaurante del panel admin.
 */
export default async function AdminRestaurantDetailPage({ params }: AdminRestaurantDetailPageProps) {
  const { restaurantId } = await params;
  
  const infrastructure = getCatalogInfrastructure();
  const useCase = new GetRestaurantAdminDetailsUseCase(
    infrastructure.restaurantRepository,
    infrastructure.restaurantSettingsRepository,
    infrastructure.diningTableRepository
  );

  let details;
  try {
    details = await useCase.execute(restaurantId);
  } catch (error) {
    notFound();
  }

  const sections: RestaurantDetailSectionDefinition[] = [
    {
      title: "Timezone",
      value: details.timezone,
      description: "Alinea los horarios de reservas y avisos operativos.",
    },
    {
      title: "Ventana de Cancelación",
      value: details.cancellationWindowHours ? `${details.cancellationWindowHours}h` : "No definida",
      description: "Tiempo límite antes de la reserva para cancelar sin penalización.",
    },
    {
      title: "Tipos de Servicio",
      value: details.services.length > 0 ? details.services.join(", ") : "Sin servicios",
      description: "Momentos del día en que el restaurante opera.",
    },
    {
      title: "Aprobación",
      value: details.reservationApprovalMode === "AUTO" ? "Automática" : "Manual",
      description: "Cómo se aceptan las nuevas solicitudes de reserva.",
    },
    {
      title: "Lista de Espera",
      value: details.waitlistMode === "AUTO" ? "Automática" : "Manual",
      description: "Permite a los comensales apuntarse cuando no hay mesas.",
    },
    {
      title: "Mesas Operativas",
      value: String(details.activeTablesCount),
      description: "Cantidad de mesas configuradas en sala.",
    },
  ];

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



      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.95fr]">
        <div className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Configuración base</T>
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
            <T>Contexto operativo</T>
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {sections.map((sectionDefinition) => (
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

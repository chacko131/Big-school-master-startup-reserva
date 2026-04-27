/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de listado de restaurantes tenant del panel SaaS.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface RestaurantMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface RestaurantTenantDefinition {
  id: string;
  name: string;
  city: string;
  plan: string;
  status: "Activo" | "Onboarding" | "Observación";
  lastSync: string;
}

interface RestaurantTaskDefinition {
  title: string;
  description: string;
}

const restaurantMetricDefinitions: ReadonlyArray<RestaurantMetricDefinition> = [
  {
    label: "Tenants activos",
    value: "128",
    caption: "restaurantes con operación en vivo",
    tone: "primary",
  },
  {
    label: "En onboarding",
    value: "14",
    caption: "restaurantes todavía en configuración",
    tone: "secondary",
  },
  {
    label: "En observación",
    value: "5",
    caption: "tenants con riesgo operativo",
    tone: "surface",
  },
  {
    label: "Crecimiento mensual",
    value: "+12%",
    caption: "nuevos tenants versus mes anterior",
    tone: "warning",
  },
] as const;

const restaurantTenantDefinitions: ReadonlyArray<RestaurantTenantDefinition> = [
  {
    id: "rl-204",
    name: "Casa Luma",
    city: "Madrid",
    plan: "Growth",
    status: "Activo",
    lastSync: "Hace 4 min",
  },
  {
    id: "rl-317",
    name: "Taquería Norte",
    city: "Barcelona",
    plan: "Starter",
    status: "Onboarding",
    lastSync: "Hace 18 min",
  },
  {
    id: "rl-401",
    name: "Mareas del Sur",
    city: "Bogotá",
    plan: "Pro",
    status: "Observación",
    lastSync: "Hace 1 h",
  },
  {
    id: "rl-522",
    name: "Sabor Andino",
    city: "Ciudad de México",
    plan: "Growth",
    status: "Activo",
    lastSync: "Hace 7 min",
  },
] as const;

const restaurantTaskDefinitions: ReadonlyArray<RestaurantTaskDefinition> = [
  {
    title: "Validar tenants nuevos",
    description: "Revisar onboarding incompleto y configuración de reservas.",
  },
  {
    title: "Auditar estados de plan",
    description: "Confirmar planes activos y detectar downgrades inesperados.",
  },
  {
    title: "Revisar sincronización",
    description: "Supervisar si el último sync de cada tenant sigue saludable.",
  },
] as const;

//-aqui empieza funcion getRestaurantStatusClassName y es para pintar el estado de cada tenant-//
/**
 * Devuelve la clase visual para el estado de un restaurante.
 *
 * @pure
 */
function getRestaurantStatusClassName(status: RestaurantTenantDefinition["status"]): string {
  switch (status) {
    case "Activo":
      return "bg-primary/10 text-primary";
    case "Onboarding":
      return "bg-secondary-container text-secondary";
    case "Observación":
      return "bg-warning/10 text-warning";
    default:
      return "bg-surface-container-low text-on-surface";
  }
}
//-aqui termina funcion getRestaurantStatusClassName-//

//-aqui empieza componente RestaurantMetricCard y es para mostrar un resumen del listado de tenants-//
interface RestaurantMetricCardProps {
  label: string;
  value: string;
  caption: string;
  tone: RestaurantMetricDefinition["tone"];
}

/**
 * Renderiza una tarjeta de métrica del listado de restaurantes.
 *
 * @pure
 */
function RestaurantMetricCard({ label, value, caption, tone }: RestaurantMetricCardProps) {
  const toneClassName =
    tone === "primary"
      ? "bg-primary text-on-primary"
      : tone === "secondary"
        ? "bg-secondary-container text-secondary"
        : tone === "surface"
          ? "bg-surface-container-low text-on-surface"
          : "bg-warning-container text-warning";

  return (
    <article className={`rounded-[24px] px-5 py-6 shadow-sm ${toneClassName}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">
        <T>{label}</T>
      </p>
      <p className="mt-3 text-4xl font-black tracking-tight">
        <T>{value}</T>
      </p>
      <p className="mt-2 text-sm leading-5 opacity-80">
        <T>{caption}</T>
      </p>
    </article>
  );
}
//-aqui termina componente RestaurantMetricCard-//

//-aqui empieza componente RestaurantTenantRow y es para mostrar cada tenant del panel-//
interface RestaurantTenantRowProps {
  tenantDefinition: RestaurantTenantDefinition;
}

/**
 * Renderiza una fila de tenant con acceso al detalle.
 *
 * @pure
 */
function RestaurantTenantRow({ tenantDefinition }: RestaurantTenantRowProps) {
  return (
    <article className="grid grid-cols-1 gap-4 rounded-[24px] border border-outline-variant/20 bg-surface-container-low p-5 lg:grid-cols-[1.6fr_0.8fr_0.8fr_0.7fr_auto] lg:items-center">
      <div>
        <p className="text-lg font-black tracking-tight text-primary">
          <T>{tenantDefinition.name}</T>
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
          <T>{tenantDefinition.city}</T>
        </p>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
          <T>Plan</T>
        </p>
        <p className="mt-1 text-sm font-semibold text-on-surface">
          <T>{tenantDefinition.plan}</T>
        </p>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
          <T>Estado</T>
        </p>
        <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${getRestaurantStatusClassName(tenantDefinition.status)}`}>
          <T>{tenantDefinition.status}</T>
        </span>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
          <T>Último sync</T>
        </p>
        <p className="mt-1 text-sm font-semibold text-on-surface">
          <T>{tenantDefinition.lastSync}</T>
        </p>
      </div>
      <Link className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:opacity-90" href={`/admin/restaurants/${tenantDefinition.id}`}>
        <T>Ver ficha</T>
        <OnboardingIcon name="arrowForward" className="h-4 w-4" />
      </Link>
    </article>
  );
}
//-aqui termina componente RestaurantTenantRow-//

//-aqui empieza componente RestaurantTasksRail y es para mostrar tareas operativas-//
/**
 * Renderiza la lista de tareas de supervisión del panel.
 *
 * @pure
 */
function RestaurantTasksRail() {
  return (
    <section className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        <T>Lista de control</T>
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
        <T>Acciones del día</T>
      </h2>

      <div className="mt-6 space-y-4">
        {restaurantTaskDefinitions.map((taskDefinition) => (
          <article className="rounded-2xl bg-surface-container-low p-4" key={taskDefinition.title}>
            <h3 className="text-sm font-bold text-on-surface">
              <T>{taskDefinition.title}</T>
            </h3>
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
              <T>{taskDefinition.description}</T>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente RestaurantTasksRail-//

//-aqui empieza pagina AdminRestaurantsPage y es para listar los tenants de la plataforma-//
/**
 * Renderiza la vista de listado de restaurantes del panel admin.
 */
export default function AdminRestaurantsPage() {
  return (
    <>
      <section className="rounded-[28px] bg-secondary-container px-6 py-8 shadow-sm md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
              <T>Tenants</T>
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-primary md:text-5xl">
              <T>Restaurantes de la plataforma</T>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-on-surface-variant">
              <T>Listado operativo para revisar estado, plan, sincronización y acceso al detalle de cada restaurante tenant.</T>
            </p>
          </div>

          <div className="rounded-[24px] bg-surface-container-low p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              <T>Segmentación</T>
            </p>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              <T>Se priorizan los tenants en onboarding y los que presentan señales tempranas de riesgo operativo.</T>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {restaurantMetricDefinitions.map((metricDefinition) => (
          <RestaurantMetricCard
            caption={metricDefinition.caption}
            key={metricDefinition.label}
            label={metricDefinition.label}
            tone={metricDefinition.tone}
            value={metricDefinition.value}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.45fr_0.9fr]">
        <div className="space-y-4">
          {restaurantTenantDefinitions.map((tenantDefinition) => (
            <RestaurantTenantRow key={tenantDefinition.id} tenantDefinition={tenantDefinition} />
          ))}
        </div>

        <RestaurantTasksRail />
      </section>
    </>
  );
}
//-aqui termina pagina AdminRestaurantsPage-//

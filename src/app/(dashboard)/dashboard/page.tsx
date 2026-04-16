/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la portada operativa del dashboard del restaurante.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";

interface DashboardCardDefinition {
  title: string;
  description: string;
  href: string;
  accent: "primary" | "secondary" | "surface";
}

const dashboardCardDefinitions: ReadonlyArray<DashboardCardDefinition> = [
  {
    title: "Reservas",
    description: "Revisa la ocupación, confirma reservas y controla el flujo operativo del día.",
    href: "/dashboard/reservations",
    accent: "primary",
  },
  {
    title: "Mesas",
    description: "Ajusta la disposición de tu sala y el estado de cada mesa en tiempo real.",
    href: "/dashboard/tables",
    accent: "secondary",
  },
  {
    title: "Configuración",
    description: "Administra las reglas del restaurante, el equipo y las integraciones.",
    href: "/dashboard/settings",
    accent: "surface",
  },
] as const;

//-aqui empieza componente DashboardCard y es para mostrar accesos principales del panel-//
interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  accent: "primary" | "secondary" | "surface";
}

/**
 * Renderiza una tarjeta de acceso rápido del dashboard.
 *
 * @pure
 */
function DashboardCard({ title, description, href, accent }: DashboardCardProps) {
  const containerClassName =
    accent === "primary"
      ? "bg-primary text-on-primary"
      : accent === "secondary"
        ? "bg-secondary-container text-on-secondary-container"
        : "bg-surface-container-low text-on-surface";
  const descriptionClassName = accent === "primary" ? "text-white/70" : accent === "secondary" ? "text-on-secondary-container/80" : "text-on-surface-variant";
  const linkClassName = accent === "primary" ? "text-white" : "text-primary";

  return (
    <article className={`flex flex-col justify-between rounded-[24px] p-6 shadow-sm ${containerClassName}`}>
      <div className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight">
          <T>{title}</T>
        </h2>
        <p className={`text-sm leading-7 ${descriptionClassName}`}>
          <T>{description}</T>
        </p>
      </div>
      <Link className={`mt-8 text-sm font-bold uppercase tracking-[0.18em] ${linkClassName}`} href={href}>
        <T>Entrar</T>
      </Link>
    </article>
  );
}
//-aqui termina componente DashboardCard-//

//-aqui empieza pagina DashboardHomePage y es para ofrecer una portada simple del panel operativo-//
/**
 * Presenta la portada principal del panel operativo del restaurante.
 */
export default function DashboardHomePage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-12 text-on-surface md:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Dashboard operativo</T>
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-primary md:text-6xl">
            <T>Tu restaurante, al día.</T>
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-on-surface-variant">
            <T>
              Aquí empieza la supervisión diaria: reservas, mesas, operaciones y configuración del negocio en un solo punto de control.
            </T>
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {dashboardCardDefinitions.map((dashboardCardDefinition) => (
            <DashboardCard
              key={dashboardCardDefinition.title}
              accent={dashboardCardDefinition.accent}
              description={dashboardCardDefinition.description}
              href={dashboardCardDefinition.href}
              title={dashboardCardDefinition.title}
            />
          ))}
        </section>

        <section className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <T>Siguiente acción</T>
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-primary">
                <T>Supervisa tu operación y ajusta la sala cuando lo necesites.</T>
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-on-surface-variant">
                <T>
                  Usa esta vista como centro de mando para seguir el ritmo del restaurante sin perder contexto entre equipos.
                </T>
              </p>
            </div>
            <Link className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-on-primary transition-all hover:opacity-90" href="/dashboard/reservations">
              <T>Ver reservas</T>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
//-aqui termina pagina DashboardHomePage-//

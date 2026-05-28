/**
 * Archivo: RestaurantTenantRow.tsx
 * Responsabilidad: Renderiza una fila de tenant con acceso al detalle.
 * Tipo: UI
 */
import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { StatusToggle } from "./StatusToggle";

export interface RestaurantTenantDefinition {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  subscription?: {
    planId: "basic" | "pro" | "none";
    status: string;
    isTrial: boolean;
    remainingTrialDays: number;
    currentPeriodEnd: Date | null;
  };
}

export interface RestaurantTenantRowProps {
  tenantDefinition: RestaurantTenantDefinition;
}



/**
 * Renderiza una fila de tenant con acceso al detalle.
 *
 * @pure
 */
export function RestaurantTenantRow({ tenantDefinition }: RestaurantTenantRowProps) {
  const sub = tenantDefinition.subscription;

  // Renderizador estético del badge del plan
  const renderPlanBadge = () => {
    if (!sub || sub.planId === "none") {
      return (
        <span className="inline-flex items-center rounded-full border border-zinc-500/20 bg-zinc-500/10 px-2 py-0.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
          <T>Sin Plan</T>
        </span>
      );
    }

    if (sub.isTrial) {
      return (
        <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <T>{`Trial Pro (${sub.remainingTrialDays}d)`}</T>
        </span>
      );
    }

    if (sub.planId === "pro") {
      return (
        <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <T>Plan Pro</T>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-xs font-bold text-sky-600 dark:text-sky-400">
        <T>Plan Básico</T>
      </span>
    );
  };

  // Renderizador del estado del periodo de facturación
  const renderPeriodInfo = () => {
    if (!sub || sub.planId === "none") return null;

    if (sub.isTrial) {
      return (
        <span className="mt-1 text-xs text-emerald-600 dark:text-emerald-500">
          <T>Expira pronto</T>
        </span>
      );
    }

    if (sub.status === "past_due") {
      return (
        <span className="mt-1 text-xs font-bold text-red-500">
          <T>Pago pendiente</T>
        </span>
      );
    }

    if (sub.status === "canceled") {
      return (
        <span className="mt-1 text-xs text-red-400">
          <T>Cancela al final</T>
        </span>
      );
    }

    if (sub.currentPeriodEnd) {
      const dateStr = new Date(sub.currentPeriodEnd).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
      });
      return (
        <span className="mt-1 text-xs text-on-surface-variant">
          <T>{`Cobra el ${dateStr}`}</T>
        </span>
      );
    }

    return null;
  };

  return (
    <article className="grid grid-cols-1 gap-4 rounded-[24px] border border-outline-variant/20 bg-surface-container-low p-5 lg:grid-cols-[1.4fr_1.2fr_1.3fr_0.6fr_auto] lg:items-center">
      <div>
        <p className="text-lg font-black tracking-tight text-primary">
          <T>{tenantDefinition.name}</T>
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
          <T>{tenantDefinition.slug}</T>
        </p>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
          <T>Contacto</T>
        </p>
        <div className="mt-1 flex flex-col">
          <span className="text-sm font-semibold text-on-surface">
            {tenantDefinition.email || <T>Sin email</T>}
          </span>
          <span className="text-xs text-on-surface-variant">
            {tenantDefinition.phone || <T>Sin teléfono</T>}
          </span>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
          <T>Suscripción y Vigencia</T>
        </p>
        <div className="mt-1 flex flex-col items-start">
          {renderPlanBadge()}
          {renderPeriodInfo()}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            <T>Estado</T>
          </p>
          <p className="mt-1 text-sm font-bold text-on-surface">
            <T>{tenantDefinition.isActive ? "Activo" : "Inactivo"}</T>
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <StatusToggle id={tenantDefinition.id} isActive={tenantDefinition.isActive} />
        </div>
      </div>
      <Link className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:opacity-90" href={`/admin/restaurants/${tenantDefinition.slug}`}>
        <T>Ver ficha</T>
        <OnboardingIcon name="arrowForward" className="h-4 w-4" />
      </Link>
    </article>
  );
}

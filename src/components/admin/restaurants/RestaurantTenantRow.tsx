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
  return (
    <article className="grid grid-cols-1 gap-4 rounded-[24px] border border-outline-variant/20 bg-surface-container-low p-5 lg:grid-cols-[1.6fr_1.6fr_0.8fr_auto] lg:items-center">
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

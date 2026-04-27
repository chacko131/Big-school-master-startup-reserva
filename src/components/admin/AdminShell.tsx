/**
 * Archivo: AdminShell.tsx
 * Responsabilidad: Proveer el shell reutilizable del panel SaaS de administración con header y sidebar dinámicos.
 * Tipo: UI
 */

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import type { OnboardingIconName } from "@/types/onboarding";
import {
  adminNavigationDefinitions,
  getAdminActiveNavigationDefinition,
  getAdminSectionLabel,
} from "@/constants/admin";

interface AdminShellProps {
  children: ReactNode;
}

interface AdminSidebarLinkProps {
  href: string;
  label: string;
  icon: OnboardingIconName;
  active: boolean;
}

//-aqui empieza componente AdminSidebarLink y es para pintar cada enlace del sidebar de admin-//
/**
 * Renderiza un enlace del sidebar con estado activo.
 *
 * @pure
 */
function AdminSidebarLink({ href, label, icon, active }: AdminSidebarLinkProps) {
  const linkClassName = active
    ? "bg-primary text-on-primary shadow-sm"
    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface";

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${linkClassName}`}
      href={href}
    >
      <OnboardingIcon name={icon} className="h-5 w-5 shrink-0" />
      <span>
        <T>{label}</T>
      </span>
    </Link>
  );
}
//-aqui termina componente AdminSidebarLink-//

//-aqui empieza componente AdminSidebar y es para mostrar la navegación lateral del panel admin-//
interface AdminSidebarProps {
  activePathname: string;
  sectionLabel: string;
}

/**
 * Renderiza el sidebar principal del panel admin.
 *
 * @pure
 */
function AdminSidebar({ activePathname, sectionLabel }: AdminSidebarProps) {
  const activeNavigationKey = getAdminActiveNavigationDefinition(activePathname).key;

  return (
    <aside className="hidden w-80 shrink-0 flex-col border-r border-outline-variant/20 bg-surface-container-lowest p-6 lg:flex">
      <div className="mb-10">
        <p className="text-lg font-black tracking-tight text-primary">
          <T>Reserva Latina</T>
        </p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
          <T>Admin SaaS</T>
        </p>
      </div>

      <div className="mb-8 rounded-[22px] bg-surface-container-low p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Vista actual</T>
        </p>
        <p className="mt-2 text-xl font-black tracking-tight text-primary">
          <T>{sectionLabel}</T>
        </p>
        <p className="mt-2 text-xs leading-5 text-on-surface-variant">
          <T>Supervisión interna de tenants, suscripciones y operación del SaaS.</T>
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {adminNavigationDefinitions.map((navigationDefinition) => {
          const isActive = activeNavigationKey === navigationDefinition.key;

          return (
            <AdminSidebarLink
              active={isActive}
              href={navigationDefinition.href}
              icon={navigationDefinition.icon}
              key={navigationDefinition.key}
              label={navigationDefinition.label}
            />
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-[20px] border border-outline-variant/20 bg-surface-container-low p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-black text-on-primary">
          SA
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-on-surface">
            <T>Super Admin</T>
          </p>
          <p className="truncate text-[10px] text-on-surface-variant">
            <T>Acceso de plataforma</T>
          </p>
        </div>
      </div>
    </aside>
  );
}
//-aqui termina componente AdminSidebar-//

//-aqui empieza componente AdminHeader y es para mostrar el encabezado superior del panel admin-//
interface AdminHeaderProps {
  sectionLabel: string;
}

/**
 * Renderiza el header superior del panel admin.
 *
 * @pure
 */
function AdminHeader({ sectionLabel }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant/20 bg-surface/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-6 py-4 md:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-container text-secondary">
            <OnboardingIcon name="settings" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Panel SaaS</T>
            </p>
            <h1 className="truncate text-lg font-black tracking-tight text-primary md:text-2xl">
              <T>{sectionLabel}</T>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-on-surface-variant">
          <button className="rounded-full p-2 transition-colors hover:bg-surface-container-low hover:text-on-surface" type="button" aria-label="Ayuda">
            <OnboardingIcon name="help" className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 transition-colors hover:bg-surface-container-low hover:text-on-surface" type="button" aria-label="Cuenta">
            <OnboardingIcon name="accountCircle" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
//-aqui termina componente AdminHeader-//

//-aqui empieza componente AdminShell y es para envolver el panel de administración con navegación compartida-//
/**
 * Renderiza la estructura compartida del panel admin con navegación activa.
 */
export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const activeNavigationDefinition = getAdminActiveNavigationDefinition(pathname);
  const sectionLabel = getAdminSectionLabel(pathname);

  return (
    <div className="min-h-screen bg-surface text-on-surface lg:flex">
      <AdminSidebar activePathname={pathname} sectionLabel={sectionLabel} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminHeader sectionLabel={sectionLabel} />
        <main className="flex-1 bg-surface-container-low px-6 py-8 md:px-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
            <div className="rounded-[20px] border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-xs font-semibold text-on-surface-variant lg:hidden">
              <T>Ruta activa: </T>
              <span>{activeNavigationDefinition.label}</span>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
//-aqui termina componente AdminShell-//

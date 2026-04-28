/**
 * Archivo: DashboardShell.tsx
 * Responsabilidad: Proveer el shell reutilizable del dashboard con header y sidebar dinámicos.
 * Tipo: UI
 */

"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import type { OnboardingIconName } from "@/types/onboarding";
import {
  dashboardNavigationDefinitions,
  getDashboardActiveNavigationDefinition,
  getDashboardSectionLabel,
} from "@/constants/dashboard";

interface DashboardShellProps {
  children: ReactNode;
}

interface DashboardSidebarLinkProps {
  href: string;
  label: string;
  icon: OnboardingIconName;
  active: boolean;
  onNavigate?: () => void;
}

interface DashboardSidebarProps {
  activePathname: string;
  sectionLabel: string;
}

interface DashboardSidebarContentProps extends DashboardSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

interface DashboardMobileSidebarProps extends DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

//-aqui empieza componente DashboardSidebarLink y es para pintar cada enlace de navegación del panel-//
/**
 * Renderiza un enlace del sidebar con estado activo.
 *
 * @pure
 */
function DashboardSidebarLink({ href, label, icon, active, onNavigate }: DashboardSidebarLinkProps) {
  const linkClassName = active
    ? "bg-primary text-on-primary shadow-sm"
    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface";

  return (
    <Link
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${linkClassName}`}
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      <OnboardingIcon name={icon} className="h-5 w-5 shrink-0" />
      <span>
        <T>{label}</T>
      </span>
    </Link>
  );
}
//-aqui termina componente DashboardSidebarLink-//

const sidebarBaseClassName = "flex h-full flex-col overflow-y-auto bg-surface-container-lowest p-6";

//-aqui empieza componente DashboardSidebar y es para mostrar la navegación lateral del dashboard-//
/**
 * Renderiza el sidebar principal del dashboard.
 *
 * @pure
 */
function DashboardSidebar({ activePathname, sectionLabel }: DashboardSidebarProps) {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block">
      <DashboardSidebarContent activePathname={activePathname} className="w-72 border-r border-outline-variant/20" sectionLabel={sectionLabel} />
    </aside>
  );
}
//-aqui termina componente DashboardSidebar-//

//-aqui empieza componente DashboardSidebarContent y es para compartir el layout entre desktop y móvil-//
/**
 * Dibuja el contenido interno del sidebar, reutilizable en desktop y móvil.
 *
 * @pure
 */
function DashboardSidebarContent({ activePathname, sectionLabel, className = "", onNavigate }: DashboardSidebarContentProps) {
  const activeNavigationKey = getDashboardActiveNavigationDefinition(activePathname).key;

  return (
    <div className={`${sidebarBaseClassName} ${className}`}>
      <div className="mb-10">
        <p className="text-lg font-black tracking-tight text-primary">
          <T>Reserva Latina</T>
        </p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
          <T>Panel operativo</T>
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
          <T>Acceso rápido a la operación diaria del restaurante.</T>
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {dashboardNavigationDefinitions.map((navigationDefinition) => {
          const isActive = activeNavigationKey === navigationDefinition.key;

          return (
            <DashboardSidebarLink
              key={navigationDefinition.key}
              active={isActive}
              href={navigationDefinition.href}
              icon={navigationDefinition.icon}
              label={navigationDefinition.label}
              onNavigate={onNavigate}
            />
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-[20px] border border-outline-variant/20 bg-surface-container-low p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-black text-on-primary">
          JR
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-on-surface">
            <T>Julian Rossi</T>
          </p>
          <p className="truncate text-[10px] text-on-surface-variant">
            <T>Owner</T>
          </p>
        </div>
      </div>
    </div>
  );
}
//-aqui termina componente DashboardSidebarContent-//

//-aqui empieza componente DashboardMobileSidebar y es para pintar la navegación en móviles-//
/**
 * Muestra el sidebar dentro de un overlay deslizable para pantallas móviles.
 *
 * @pure
 */
function DashboardMobileSidebar({ activePathname, sectionLabel, isOpen, onClose }: DashboardMobileSidebarProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <button className="absolute inset-0 bg-surface/60 backdrop-blur-sm" type="button" aria-label="Cerrar navegación" onClick={onClose} />
      <aside className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-surface-container-lowest shadow-[0_20px_50px_rgba(15,23,42,0.35)]">
        <button className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface shadow" type="button" aria-label="Ocultar navegación" onClick={onClose}>
          <OnboardingIcon name="close" className="h-4 w-4" />
        </button>

        <DashboardSidebarContent activePathname={activePathname} className="w-full border-none pt-10" onNavigate={onClose} sectionLabel={sectionLabel} />
      </aside>
    </div>
  );
}
//-aqui termina componente DashboardMobileSidebar-//

//-aqui empieza componente DashboardHeader y es para mostrar el encabezado superior del dashboard-//
interface DashboardHeaderProps {
  sectionLabel: string;
  onOpenMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

/**
 * Renderiza el header superior del dashboard.
 *
 * @pure
 */
function DashboardHeader({ sectionLabel, onOpenMobileSidebar, isMobileSidebarOpen }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant/20 bg-surface/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-6 py-4 md:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-4">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface-variant transition-colors hover:text-on-surface lg:hidden"
            type="button"
            aria-label="Abrir navegación"
            aria-expanded={isMobileSidebarOpen}
            onClick={onOpenMobileSidebar}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16" />
              <path d="M4 12h12" />
              <path d="M4 17h16" />
            </svg>
          </button>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-container text-secondary">
            <OnboardingIcon name="restaurant" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Panel operativo</T>
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
//-aqui termina componente DashboardHeader-//

//-aqui empieza componente DashboardShell y es para envolver el dashboard con navegación compartida-//
/**
 * Renderiza la estructura compartida del dashboard con navegación activa.
 */
export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const activeNavigationDefinition = getDashboardActiveNavigationDefinition(pathname);
  const sectionLabel = getDashboardSectionLabel(pathname);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      document.body.style.removeProperty("overflow");
      return undefined;
    }

    document.body.style.setProperty("overflow", "hidden");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.removeProperty("overflow");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <DashboardSidebar activePathname={pathname} sectionLabel={sectionLabel} />
      <DashboardMobileSidebar activePathname={pathname} isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} sectionLabel={sectionLabel} />
      <div className="flex min-h-screen min-w-0 flex-col lg:ml-72">
        <DashboardHeader isMobileSidebarOpen={isMobileSidebarOpen} onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} sectionLabel={sectionLabel} />
        <main className="flex-1 bg-surface-container-low px-6 py-8 md:px-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
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
//-aqui termina componente DashboardShell-//

/**
 * Archivo: DashboardShell.tsx
 * Responsabilidad: Proveer el shell reutilizable del dashboard con header y sidebar dinámicos.
 * Tipo: UI
 */

"use client";

import { useEffect, useState, createContext, useContext } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import NotificationInbox from "./NotificationInbox";
import type { OnboardingIconName } from "@/types/onboarding";
import {
  dashboardNavigationDefinitions,
  getDashboardActiveNavigationDefinition,
  getDashboardSectionLabel,
  type DashboardSectionKey,
  type DashboardNavigationSubitem,
} from "@/constants/dashboard";

interface DashboardContextType {
  canWrite: boolean;
  accessLevel: "full" | "grace" | "read_only" | "suspended";
}

const DashboardContext = createContext<DashboardContextType>({
  canWrite: true,
  accessLevel: "full",
});

export const useDashboard = () => useContext(DashboardContext);

/** Secciones que el usuario actual puede ver (filtrado por plan + rol). */
interface DashboardShellProps {
  children: ReactNode;
  allowedKeys: ReadonlySet<DashboardSectionKey>;
  accessLevel: "full" | "grace" | "read_only" | "suspended";
  accessMessage: string;
  canWrite: boolean;
  isTrialActive: boolean;
  remainingTrialDays: number;
  daysUntilNextPhase: number | null;
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
  allowedKeys: ReadonlySet<DashboardSectionKey>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface DashboardSidebarContentProps extends DashboardSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

interface DashboardMobileSidebarProps extends Omit<DashboardSidebarProps, "isCollapsed" | "onToggleCollapse"> {
  isOpen: boolean;
  onClose: () => void;
}

//-aqui empieza componente DashboardSidebarLink y es para pintar cada enlace de navegación del panel-//
/**
 * Renderiza un enlace del sidebar con estado activo.
 *
 * @pure
 */
interface DashboardSidebarLinkCollapsedProps extends DashboardSidebarLinkProps {
  isCollapsed?: boolean;
}

function DashboardSidebarLink({ href, label, icon, active, onNavigate, isCollapsed }: DashboardSidebarLinkCollapsedProps) {
  const linkClassName = active
    ? "bg-primary text-on-primary shadow-sm"
    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface";

  return (
    <Link
      className={`flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${isCollapsed ? "justify-center gap-0" : "gap-3"} ${linkClassName}`}
      href={href}
      aria-current={active ? "page" : undefined}
      title={isCollapsed ? label : undefined}
      onClick={onNavigate}
    >
      <OnboardingIcon name={icon} className="h-5 w-5 shrink-0" />
      {!isCollapsed && (
        <span>
          <T>{label}</T>
        </span>
      )}
    </Link>
  );
}
//-aqui termina componente DashboardSidebarLink-//

//-aqui empieza componente DashboardSubitemLink y es para renderizar subitems de navegación indentados-//
/**
 * Renderiza un subitem del sidebar con indentación y estado activo por pathname exacto.
 *
 * @pure
 */
function DashboardSubitemLink({
  href,
  label,
  activePathname,
  onNavigate,
}: {
  href: string;
  label: string;
  activePathname: string;
  onNavigate?: () => void;
}) {
  const isActive = activePathname === href || activePathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`ml-8 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
        isActive
          ? "bg-surface-container text-primary"
          : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
      }`}
    >
      <span className="h-1 w-1 rounded-full bg-current opacity-60" />
      <T>{label}</T>
    </Link>
  );
}
//-aqui termina componente DashboardSubitemLink-//

const sidebarBaseClassName = "flex h-full flex-col overflow-y-auto bg-surface-container-lowest transition-all duration-300";

//-aqui empieza componente DashboardSidebar y es para mostrar la navegación lateral del dashboard-//
/**
 * Renderiza el sidebar principal del dashboard.
 *
 * @pure
 */
function DashboardSidebar({ activePathname, sectionLabel, allowedKeys, isCollapsed, onToggleCollapse }: DashboardSidebarProps) {
  return (
    <aside className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block ${isCollapsed ? "lg:w-16" : "lg:w-72"} transition-all duration-300`}>
      <DashboardSidebarContent
        activePathname={activePathname}
        allowedKeys={allowedKeys}
        className={`${isCollapsed ? "w-16" : "w-72"} border-r border-outline-variant/20`}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        sectionLabel={sectionLabel}
      />
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
function DashboardSidebarContent({ activePathname, sectionLabel, allowedKeys, className = "", onNavigate, isCollapsed = false, onToggleCollapse }: DashboardSidebarContentProps) {
  const activeNavigationKey = getDashboardActiveNavigationDefinition(activePathname).key;
  const { user } = useUser();
  const displayName = user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "";

  //-aqui empieza filteredNav y es para mostrar solo las secciones que el rol puede ver-//
  const filteredNav = dashboardNavigationDefinitions.filter((nav) =>
    allowedKeys.has(nav.key)
  );
  //-aqui termina filteredNav-//

  return (
    <div className={`${sidebarBaseClassName} ${isCollapsed ? "p-3" : "p-6"} ${className}`}>
      {/* Logo + botón toggle */}
      <div className={`mb-6 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed && (
          <Link href="/" className="flex-1 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logoHeader.png" alt="Full Haus" className="w-full object-contain" />
          </Link>
        )}
        <button
          type="button"
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          onClick={onToggleCollapse}
          className="shrink-0 rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {isCollapsed ? (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h10" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {!isCollapsed && (
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
      )}

      <nav className="flex flex-1 flex-col gap-1">
        {filteredNav.map((navigationDefinition) => {
          const isActive = activeNavigationKey === navigationDefinition.key;
          const hasSubitems = !isCollapsed && isActive && (navigationDefinition.subitems?.length ?? 0) > 0;

          return (
            <div key={navigationDefinition.key}>
              <DashboardSidebarLink
                active={isActive}
                href={navigationDefinition.href}
                icon={navigationDefinition.icon}
                isCollapsed={isCollapsed}
                label={navigationDefinition.label}
                onNavigate={onNavigate}
              />
              {hasSubitems && (
                <div className="mt-0.5 flex flex-col gap-0.5">
                  {(navigationDefinition.subitems as ReadonlyArray<DashboardNavigationSubitem>).map((sub) => (
                    <DashboardSubitemLink
                      key={sub.href}
                      href={sub.href}
                      label={sub.label}
                      activePathname={activePathname}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className={`mt-auto flex items-center rounded-[20px] border border-outline-variant/20 bg-surface-container-low p-4 ${isCollapsed ? "justify-center" : "gap-3"}`}>
        <UserButton />
        {!isCollapsed && displayName.length > 0 && (
          <p className="min-w-0 truncate text-xs font-semibold text-on-surface">
            {displayName}
          </p>
        )}
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
function DashboardMobileSidebar({ activePathname, sectionLabel, allowedKeys, isOpen, onClose }: DashboardMobileSidebarProps) {
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

        <DashboardSidebarContent
          activePathname={activePathname}
          allowedKeys={allowedKeys}
          className="w-full border-none pt-10"
          isCollapsed={false}
          onNavigate={onClose}
          onToggleCollapse={onClose}
          sectionLabel={sectionLabel}
        />
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
          <LanguageToggle />
          <NotificationInbox />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
//-aqui termina componente DashboardHeader-//

//-aqui empieza componente AccessLevelBanner y es para mostrar el estado de la suscripción-//
/**
 * Renderiza un banner contextual según el nivel de acceso del restaurante.
 * Solo se muestra cuando el acceso no es FULL.
 *
 * @pure
 */
function AccessLevelBanner({ level, message, daysUntilNextPhase }: { level: string; message: string; daysUntilNextPhase: number | null }) {
  if (level === "full") return null;

  const bannerStyles: Record<string, string> = {
    grace: "border-yellow-500/30 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200",
    read_only: "border-orange-500/30 bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200",
    suspended: "border-red-500/30 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200",
  };

  const bannerIcons: Record<string, string> = {
    grace: "⏳",
    read_only: "🔒",
    suspended: "⚠️",
  };

  return (
    <div className={`mx-6 mt-4 rounded-2xl border px-5 py-4 md:mx-8 lg:mx-10 ${bannerStyles[level] ?? ""}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg" role="img" aria-hidden="true">{bannerIcons[level] ?? ""}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold"><T>{message}</T></p>
          {level !== "suspended" && daysUntilNextPhase !== null && daysUntilNextPhase > 0 && (
            <p className="mt-1 text-xs opacity-80">
              <T>{`${daysUntilNextPhase} día${daysUntilNextPhase !== 1 ? "s" : ""} restantes antes del siguiente nivel de restricción.`}</T>
            </p>
          )}
          {(level === "read_only" || level === "suspended") && (
            <Link
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary transition-colors hover:opacity-90"
              href="/dashboard/billing"
            >
              <T>Activar un plan</T>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
//-aqui termina componente AccessLevelBanner-//

//-aqui empieza componente DashboardShell y es para envolver el dashboard con navegación compartida-//
/**
 * Renderiza la estructura compartida del dashboard con navegación activa.
 */
export function DashboardShell({ children, allowedKeys, accessLevel, accessMessage, canWrite, isTrialActive, remainingTrialDays, daysUntilNextPhase }: DashboardShellProps) {
  const pathname = usePathname();
  const activeNavigationDefinition = getDashboardActiveNavigationDefinition(pathname);
  const sectionLabel = getDashboardSectionLabel(pathname);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <DashboardContext.Provider value={{ canWrite, accessLevel }}>
      <div className="min-h-screen bg-surface text-on-surface">
        <DashboardSidebar
          activePathname={pathname}
          allowedKeys={allowedKeys}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          sectionLabel={sectionLabel}
        />
        <DashboardMobileSidebar activePathname={pathname} allowedKeys={allowedKeys} isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} sectionLabel={sectionLabel} />
        <div className={`flex min-h-screen min-w-0 flex-col transition-all duration-300 ${isCollapsed ? "lg:ml-16" : "lg:ml-72"}`}>
          <DashboardHeader isMobileSidebarOpen={isMobileSidebarOpen} onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} sectionLabel={sectionLabel} />
          <AccessLevelBanner level={accessLevel} message={accessMessage} daysUntilNextPhase={daysUntilNextPhase} />
          {isTrialActive && remainingTrialDays <= 15 && remainingTrialDays > 7 && (
            <div className="mx-6 mt-4 rounded-2xl border border-blue-500/20 bg-blue-50 px-5 py-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 md:mx-8 lg:mx-10">
              <div className="flex items-center gap-3">
                <span role="img" aria-hidden="true">💡</span>
                <p className="font-semibold">
                  <T>{`Tu periodo de prueba termina en ${remainingTrialDays} días. Elige un plan para no perder continuidad.`}</T>
                </p>
              </div>
            </div>
          )}
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
    </DashboardContext.Provider>
  );
}
//-aqui termina componente DashboardShell-//

/**
 * Archivo: OnboardingIcon.tsx
 * Responsabilidad: Renderizar iconos SVG locales reutilizables del onboarding.
 * Tipo: UI
 */

import type { OnboardingIconName } from "@/types/onboarding";

interface OnboardingIconProps {
  name: OnboardingIconName;
  className?: string;
}

const baseClassName = "h-6 w-6 shrink-0";

//-aqui empieza componente OnboardingIcon y es para evitar icon fonts externas dentro del onboarding-//
/**
 * Resuelve un icono SVG local del flujo de onboarding.
 */
export function OnboardingIcon({ name, className = "" }: OnboardingIconProps) {
  const svgClassName = `${baseClassName} ${className}`;

  switch (name) {
    case "storefront":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10h16" />
          <path d="M5 10l1.2-5h11.6L19 10" />
          <path d="M6 10v9" />
          <path d="M18 10v9" />
          <path d="M4 19h16" />
          <path d="M9 19v-5h6v5" />
        </svg>
      );
    case "settings":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3.25" />
          <path d="M12 2.75v2.1" />
          <path d="M12 19.15v2.1" />
          <path d="M4.93 4.93l1.49 1.49" />
          <path d="M17.58 17.58l1.49 1.49" />
          <path d="M2.75 12h2.1" />
          <path d="M19.15 12h2.1" />
          <path d="M4.93 19.07l1.49-1.49" />
          <path d="M17.58 6.42l1.49-1.49" />
        </svg>
      );
    case "gridView":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="6" height="6" rx="1.2" />
          <rect x="14" y="4" width="6" height="6" rx="1.2" />
          <rect x="4" y="14" width="6" height="6" rx="1.2" />
          <rect x="14" y="14" width="6" height="6" rx="1.2" />
        </svg>
      );
    case "payments":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="6" width="17" height="12" rx="2" />
          <path d="M3.5 10h17" />
          <path d="M7.5 14.5h4" />
        </svg>
      );
    case "close":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </svg>
      );
    case "help":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 4.3 1.7c-.8.8-1.8 1.4-1.8 2.8" />
          <circle cx="12" cy="17" r=".6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "accountCircle":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8.5" r="3.25" />
          <path d="M5.5 19a7.5 7.5 0 0 1 13 0" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case "expandMore":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "save":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 4h11l3 3v13H5z" />
          <path d="M8 4v5h7V4" />
          <path d="M9 18h6" />
        </svg>
      );
    case "arrowForward":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "restaurant":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3v8" />
          <path d="M10 3v8" />
          <path d="M7 7h3" />
          <path d="M8.5 11v10" />
          <path d="M15 3c1.7 2 1.7 4.8 0 6.8V21" />
        </svg>
      );
    case "schedule":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case "checkCircle":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.5 2.5 4.5-5" />
        </svg>
      );
    default:
      return null;
  }
}
//-aqui termina componente OnboardingIcon-//

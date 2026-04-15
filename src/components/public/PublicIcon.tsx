/**
 * Archivo: PublicIcon.tsx
 * Responsabilidad: Renderizar iconos SVG locales reutilizables para la experiencia pública.
 * Tipo: UI
 */

interface PublicIconProps {
  name:
    | "menu"
    | "share"
    | "language"
    | "check"
    | "cancel"
    | "arrowForward"
    | "tableRestaurant"
    | "group"
    | "analytics"
    | "payments"
    | "shoppingCart"
    | "smartphone"
    | "checkCircle";
  className?: string;
}

const baseClassName = "h-6 w-6 shrink-0";

//-aqui empieza componente PublicIcon y es para reemplazar icon fonts externas-//
/**
 * Icono SVG local para evitar dependencia de fonts externas.
 */
export function PublicIcon({ name, className = "" }: PublicIconProps) {
  const svgClassName = `${baseClassName} ${className}`;

  switch (name) {
    case "menu":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );
    case "share":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="19" r="2" />
          <path d="M8 11l8-4" />
          <path d="M8 13l8 4" />
        </svg>
      );
    case "language":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c3 3 4.5 6 4.5 9S15 18 12 21c-3-3-4.5-6-4.5-9S9 6 12 3Z" />
        </svg>
      );
    case "check":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "cancel":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </svg>
      );
    case "arrowForward":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "tableRestaurant":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16" />
          <path d="M7 12v6" />
          <path d="M17 12v6" />
          <path d="M6 6h12" />
          <path d="M10 6v6" />
          <path d="M14 6v6" />
        </svg>
      );
    case "group":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="8" r="3" />
          <path d="M4 20c.7-3.5 3.1-5.5 5-5.5S12.3 16.5 13 20" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M15.2 20c.4-2.3 1.9-3.8 3.5-3.8 1.3 0 2.6.9 3.3 3.8" />
        </svg>
      );
    case "analytics":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M7 16v-4" />
          <path d="M12 16V8" />
          <path d="M17 16v-6" />
        </svg>
      );
    case "payments":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M4 10h16" />
          <path d="M8 15h4" />
        </svg>
      );
    case "shoppingCart":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 6h2l2.5 10h8.5l2-7H8" />
          <circle cx="10" cy="19" r="1.5" />
          <circle cx="17" cy="19" r="1.5" />
        </svg>
      );
    case "smartphone":
      return (
        <svg className={svgClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="3" width="10" height="18" rx="2" />
          <path d="M10 7h4" />
          <circle cx="12" cy="18" r="0.5" fill="currentColor" stroke="none" />
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
//-aqui termina componente PublicIcon-//

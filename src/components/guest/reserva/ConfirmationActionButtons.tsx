/**
 * Archivo: ConfirmationActionButtons.tsx
 * Responsabilidad: Mostrar los botones de acción rápida tras confirmar la reserva.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface ReservationConfirmationAction {
  label: string;
  href: string;
  icon: "calendarAddOn" | "editCalendar" | "share";
  primary?: boolean;
}

interface ConfirmationActionButtonsProps {
  actions: ReservationConfirmationAction[];
}

//-aqui empieza funcion getActionClassName y es para marcar el estilo de las acciones-//
/**
 * @pure
 */
function getActionClassName(primary?: boolean): string {
  return primary
    ? "flex items-center justify-center gap-3 rounded-xl bg-primary py-6 text-on-primary transition-all active:scale-95 hover:opacity-90"
    : "flex items-center justify-center gap-3 rounded-xl bg-surface-container-lowest py-6 transition-all hover:bg-surface-container-high active:scale-95";
}
//-aqui termina funcion getActionClassName-//

//-aqui empieza funcion ConfirmationActionButtons y es para renderizar los botones de acción-//
/**
 * @pure
 */
export function ConfirmationActionButtons({ actions }: ConfirmationActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:col-span-12 sm:grid-cols-3">
      {actions.map((action) => (
        <Link
          key={action.label}
          className={getActionClassName(action.primary)}
          href={action.href}
        >
          <PublicIcon name={action.icon} className="h-5 w-5" />
          <span className="font-bold">
            <T>{action.label}</T>
          </span>
        </Link>
      ))}
    </div>
  );
}
//-aqui termina funcion ConfirmationActionButtons-//

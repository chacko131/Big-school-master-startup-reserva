/**
 * Archivo: PrivateEventsCard.tsx
 * Responsabilidad: Mostrar información sobre eventos privados en el perfil.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

//-aqui empieza funcion PrivateEventsCard y es para la sección de eventos privados-//
/**
 * @pure
 */
export function PrivateEventsCard() {
  return (
    <div className="rounded-3xl bg-secondary-container/30 p-6 space-y-4 sm:p-8">
      <h4 className="font-bold text-on-secondary-container">
        <T>Eventos Privados</T>
      </h4>
      <p className="text-sm leading-relaxed text-on-secondary-container/80">
        <T>Contamos con salones exclusivos para celebraciones y cenas corporativas de hasta 40 personas.</T>
      </p>
      <a className="inline-flex items-center gap-1 text-sm font-bold text-secondary transition-opacity hover:underline" href="#">
        <T>Solicitar información</T>
        <PublicIcon name="openInNew" className="h-4 w-4" />
      </a>
    </div>
  );
}
//-aqui termina funcion PrivateEventsCard-//

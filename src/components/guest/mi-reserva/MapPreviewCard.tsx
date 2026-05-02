/**
 * Archivo: MapPreviewCard.tsx
 * Responsabilidad: Mostrar una previsualización del mapa con la dirección del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface MapPreviewCardProps {
  address: string;
}

//-aqui empieza funcion MapPreviewCard y es para mostrar el mapa-//
/**
 * @pure
 */
export function MapPreviewCard({ address }: MapPreviewCardProps) {
  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest p-2 shadow-[0px_20px_40px_rgba(26,28,28,0.06)]">
      <div className="group relative h-32 overflow-hidden rounded-[20px] bg-surface-container">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06),transparent_70%)]" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/15">
          <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-black shadow-lg" type="button">
            <PublicIcon name="map" className="h-4 w-4" />
            <T>Ver Mapa</T>
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="truncate text-xs font-bold text-on-surface">
          <T>{address}</T>
        </p>
      </div>
    </section>
  );
}
//-aqui termina funcion MapPreviewCard-//

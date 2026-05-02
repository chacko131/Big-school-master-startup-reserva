/**
 * Archivo: ConfirmationLocationCard.tsx
 * Responsabilidad: Mostrar la ubicación del restaurante en la confirmación.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface ConfirmationLocationCardProps {
  locationLabel: string;
  locationValue: string;
  mapImageUrl?: string;
  directionsUrl?: string;
}

//-aqui empieza funcion ConfirmationLocationCard y es para mostrar mapa y dirección-//
/**
 * @pure
 */
export function ConfirmationLocationCard({
  locationLabel,
  locationValue,
  mapImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuALS42zux4RGC8SlW8qfolTT757DNhA6aT26YEJRSQBjqoRIM-76C2dVS40OCppBn_NBBIri9ClA7kpd0X0qZ8DKYnlVwezPzDBF4rBWr6l_vGEi58Gv25xERzfp6qYLu-VUxxt9jWKj9opH-kHtftOMNjP0ObcTC4MNlfz87Y0g7bwZFZp3OdW-qHnymVGTUgB4Tp552PIRWYKF37aSS__XBzE7Xb0h45S8p8fS65JO1QrxKFaolH5NjO3jJKOuCDkHo4O5mJ974A",
  directionsUrl = "#",
}: ConfirmationLocationCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-surface-container-low md:col-span-4">
      <div className="relative h-48 w-full bg-surface-container-highest">
        <img
          alt="Map location"
          className="h-full w-full object-cover"
          src={mapImageUrl}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg">
            <PublicIcon name="locationOn" className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="grow p-6">
        <h3 className="mb-1 text-lg font-bold">
          <T>{locationLabel}</T>
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">
          {locationValue}
        </p>
        <a
          className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <T>Cómo llegar</T>
          <PublicIcon name="openInNew" className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
//-aqui termina funcion ConfirmationLocationCard-//

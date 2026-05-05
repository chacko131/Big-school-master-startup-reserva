/**
 * Archivo: RestaurantGallery.tsx
 * Responsabilidad: Mostrar la galería de imágenes del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";
import Image from "next/image";

interface RestaurantGalleryProps {
  imageUrls: string[];
  restaurantName: string;
}

//-aqui empieza funcion getGridClassName y es para asignar el layout CSS de cada celda de la galería-//
/**
 * Devuelve la clase CSS de grid para cada posición de la galería.
 * La primera imagen ocupa 2×2 (destacada), las demás 1×1.
 * @pure
 */
function getGridClassName(index: number): string {
  if (index === 0) {
    return "col-span-2 row-span-2 overflow-hidden rounded-2xl aspect-square lg:aspect-auto";
  }
  return "overflow-hidden rounded-2xl aspect-square";
}
//-aqui termina funcion getGridClassName-//

//-aqui empieza funcion RestaurantGallery y es para mostrar la galería-//
/**
 * @pure
 */
export function RestaurantGallery({ imageUrls, restaurantName }: RestaurantGalleryProps) {
  if (imageUrls.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-2xl font-bold sm:text-3xl">
          <T>Galería</T>
        </h3>
        
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {imageUrls.map((url, index) => (
          <div className={getGridClassName(index)} key={url}>
            <Image
              width={800}
              height={600}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              alt={`${restaurantName} — foto ${index + 1}`}
              src={url}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
//-aqui termina funcion RestaurantGallery-//

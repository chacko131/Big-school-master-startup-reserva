/**
 * Archivo: RestaurantGallery.tsx
 * Responsabilidad: Mostrar la galería de imágenes del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface GalleryImage {
  src: string;
  alt: string;
  className: string;
}

interface RestaurantGalleryProps {
  images: ReadonlyArray<GalleryImage>;
}

//-aqui empieza funcion RestaurantGallery y es para mostrar la galería-//
/**
 * @pure
 */
export function RestaurantGallery({ images }: RestaurantGalleryProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-2xl font-bold sm:text-3xl">
          <T>Galería</T>
        </h3>
        <button className="flex items-center gap-2 font-semibold text-secondary transition-opacity hover:opacity-70" type="button">
          <T>Ver todas</T>
          <PublicIcon name="arrowForward" className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((image) => (
          <div className={image.className} key={image.alt}>
            <img 
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" 
              alt={image.alt} 
              src={image.src} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
//-aqui termina funcion RestaurantGallery-//

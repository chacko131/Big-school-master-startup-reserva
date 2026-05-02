/**
 * Archivo: MyReservationFooter.tsx
 * Responsabilidad: Renderizar el pie de página de la página de gestión de reserva.
 * Tipo: UI
 */

import { T } from "@/components/T";

interface FooterLink {
  label: string;
  href: string;
}

interface MyReservationFooterProps {
  restaurantName: string;
  links: ReadonlyArray<FooterLink>;
}

//-aqui empieza funcion MyReservationFooter y es para mostrar el pie de página de la reserva-//
/**
 * @pure
 */
export function MyReservationFooter({ restaurantName, links }: MyReservationFooterProps) {
  return (
    <footer className="mt-20 border-t border-surface-container pt-12 text-center">
      <p className="mb-4 font-headline text-lg font-bold tracking-tight uppercase text-on-surface">
        <T>{restaurantName}</T>
      </p>

      <div className="mb-8 flex flex-wrap justify-center gap-8 text-sm text-on-surface-variant">
        {links.map((link) => (
          <a className="transition-colors hover:text-primary" href={link.href} key={link.label}>
            <T>{link.label}</T>
          </a>
        ))}
      </div>

      <p className="text-xs font-medium text-on-surface-variant">
        <T>© 2024 Reserva Latina. Built for Hospitality.</T>
      </p>
    </footer>
  );
}
//-aqui termina funcion MyReservationFooter-//

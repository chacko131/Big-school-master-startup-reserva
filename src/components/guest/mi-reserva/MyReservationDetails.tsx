/**
 * Archivo: MyReservationDetails.tsx
 * Responsabilidad: Mostrar los campos detallados de la reserva y peticiones especiales.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface Field {
  label: string;
  value: string;
}

interface MyReservationDetailsProps {
  fields: ReadonlyArray<Field>;
  specialRequest: string;
}

//-aqui empieza funcion MyReservationDetails y es para mostrar detalles de mi reserva-//
/**
 * @pure
 */
export function MyReservationDetails({ fields, specialRequest }: MyReservationDetailsProps) {
  return (
    <section className="md:col-span-2 rounded-[28px] bg-surface-container-lowest p-8 shadow-[0px_20px_40px_rgba(26,28,28,0.06)]">
      <div className="mb-8 flex items-start justify-between gap-4">
        <h3 className="font-headline text-xl font-bold text-on-surface">
          <T>Detalles de la Reserva</T>
        </h3>
        <PublicIcon name="eventAvailable" className="h-5 w-5 text-on-surface-variant" />
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>{field.label}</T>
            </p>
            <p className="text-lg font-medium text-on-surface">
              <T>{field.value}</T>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-surface-container pt-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Peticiones Especiales</T>
        </p>
        <p className="italic text-on-surface-variant">
          <T>{specialRequest}</T>
        </p>
      </div>
    </section>
  );
}
//-aqui termina funcion MyReservationDetails-//

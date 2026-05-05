/**
 * Archivo: LocationAndHours.tsx
 * Responsabilidad: Mostrar la ubicación, horarios de servicio y contacto del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";
import Image from "next/image";

interface BusinessHour {
  day: string;
  opensAt: string;
  closesAt: string;
  isClosed: boolean;
}

interface LocationAndHoursProps {
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  businessHours: BusinessHour[];
}

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

//-aqui empieza funcion formatHourLine y es para generar la línea legible de cada día-//
/**
 * @pure
 */
function formatHourLine(h: BusinessHour): string {
  const label = DAY_LABELS[h.day] ?? h.day;
  if (h.isClosed) return `${label}: Cerrado`;
  return `${label}: ${h.opensAt} - ${h.closesAt}`;
}
//-aqui termina funcion formatHourLine-//

//-aqui empieza funcion LocationAndHours y es para mostrar ubicación y horarios-//
/**
 * @pure
 */
export function LocationAndHours({ address, city, phone, email, businessHours }: LocationAndHoursProps) {
  const hasAddress = address !== null && address.trim() !== "";
  const hasContact = (phone !== null && phone.trim() !== "") || (email !== null && email.trim() !== "");
  const hasHours = businessHours.length > 0;

  return (
    <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-2">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">
          <T>Ubicación y Horarios</T>
        </h3>

        <div className="space-y-4">
          {/* ─── Dirección ────────────────────────────────────────── */}
          {hasAddress ? (
            <div className="flex items-start gap-4">
              <PublicIcon name="locationOn" className="mt-1 h-5 w-5 text-on-tertiary-container" />
              <div>
                <p className="font-semibold">{address}</p>
                {city ? (
                  <p className="mt-1 text-on-surface-variant">{city}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* ─── Horarios ─────────────────────────────────────────── */}
          {hasHours ? (
            <div className="flex items-start gap-4">
              <PublicIcon name="schedule" className="mt-1 h-5 w-5 text-on-tertiary-container" />
              <div>
                <p className="font-semibold">
                  <T>Horarios de Servicio</T>
                </p>
                <div className="mt-1 space-y-1 text-on-surface-variant">
                  {businessHours.map((h) => (
                    <p key={h.day}>{formatHourLine(h)}</p>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* ─── Contacto ─────────────────────────────────────────── */}
          {hasContact ? (
            <div className="flex items-start gap-4">
              <PublicIcon name="contactMail" className="mt-1 h-5 w-5 text-on-tertiary-container" />
              <div>
                <p className="font-semibold">
                  <T>Contacto</T>
                </p>
                <div className="mt-1 space-y-1 text-on-surface-variant">
                  {phone ? <p>{phone}</p> : null}
                  {email ? <p>{email}</p> : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative h-64 min-h-[300px] overflow-hidden rounded-3xl bg-surface-container-high shadow-inner md:h-full">
        <Image
          width={800}
          height={600}
          className="h-full w-full object-cover opacity-80 grayscale"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTvUakdE2nc_b_--lnN3eQGM1OpsSJaKtH8bT-UpKoXtB84Vt3hVS-xEjECFOkwqSpf0XmQCFv6xzaEuQl4-zcbN0-NrRC2hfkk9OJOTABpOJsmlntFYwJT4LIHYKxkjcJs2JnkqRjQzneb4OwoCmP15TDFm8lCHC3qXXGnq9DB5g7uLJrkgBSQma-P-L5QdsJkaAYSq29jUj1_MEQwDCVwWjo1pI3jmcfGD6_j8ZfqDdmX4B6WFF18yNhEcfgVcDiGSQ6xNjGUnM"
          alt="Mapa de ubicación"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-2xl ring-8 ring-white/20">
            <PublicIcon name="pinDrop" className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
//-aqui termina funcion LocationAndHours-//

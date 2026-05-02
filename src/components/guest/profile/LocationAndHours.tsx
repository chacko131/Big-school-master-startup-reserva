/**
 * Archivo: LocationAndHours.tsx
 * Responsabilidad: Mostrar la ubicación, horarios de servicio y mapa del restaurante.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { PublicIcon } from "@/components/public/PublicIcon";

interface LocationDetail {
  icon: "locationOn" | "schedule" | "contactMail";
  title: string;
  lines: readonly string[];
}

interface LocationAndHoursProps {
  details: ReadonlyArray<LocationDetail>;
}

//-aqui empieza funcion LocationAndHours y es para mostrar ubicación y horarios-//
/**
 * @pure
 */
export function LocationAndHours({ details }: LocationAndHoursProps) {
  return (
    <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-2">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">
          <T>Ubicación y Horarios</T>
        </h3>

        <div className="space-y-4">
          {details.map((detail) => (
            <div className="flex items-start gap-4" key={detail.title}>
              <PublicIcon name={detail.icon} className="mt-1 h-5 w-5 text-on-tertiary-container" />
              <div>
                <p className="font-semibold">
                  <T>{detail.title}</T>
                </p>
                <div className="mt-1 space-y-1 text-on-surface-variant">
                  {detail.lines.map((line) => (
                    <p key={line}>
                      <T>{line}</T>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-h-[300px] overflow-hidden rounded-3xl bg-surface-container-high shadow-inner h-64 md:h-full">
        <img 
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

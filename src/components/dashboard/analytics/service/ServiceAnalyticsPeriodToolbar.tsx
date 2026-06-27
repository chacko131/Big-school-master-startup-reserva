/**
 * Archivo: ServiceAnalyticsPeriodToolbar.tsx
 * Responsabilidad: Selector de período (Hoy / Semana / Mes) para las analíticas de servicio.
 *   Modifica los searchParams de la URL para que el Server Component recargue los datos.
 * Tipo: UI (client)
 */

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { T } from "@/components/T";

type Period = "today" | "week" | "month";

const PERIODS: { key: Period; label: string }[] = [
  { key: "today", label: "Hoy" },
  { key: "week", label: "Semana" },
  { key: "month", label: "Mes" },
];

//-aqui empieza componente ServiceAnalyticsPeriodToolbar y es para cambiar el período de análisis-//
/**
 * Renderiza los botones Hoy / Semana / Mes.
 * Al pulsar uno navega a la misma URL añadiendo ?period=X para que el Server Component
 * recalcule el rango de fechas y vuelva a fetchar datos.
 * @pure
 */
export function ServiceAnalyticsPeriodToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = (searchParams.get("period") as Period) ?? "today";

  //-aqui empieza funcion handleSelect y es para navegar al período seleccionado-//
  function handleSelect(period: Period) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", period);
    router.push(`${pathname}?${params.toString()}`);
  }
  //-aqui termina funcion handleSelect-//

  return (
    <div className="flex bg-surface-container p-1 rounded-lg w-max">
      {PERIODS.map(({ key, label }) => {
        const isActive = current === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleSelect(key)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              isActive
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <T>{label}</T>
          </button>
        );
      })}
    </div>
  );
}
//-aqui termina componente ServiceAnalyticsPeriodToolbar-//

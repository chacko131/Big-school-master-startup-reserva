/**
 * Archivo: ServiceClock.tsx
 * Responsabilidad: Mostrar el reloj en vivo en el header del módulo de servicio.
 * Tipo: UI (client)
 */

"use client";

import { useState, useEffect } from "react";

//-aqui empieza componente ServiceClock y es para mostrar la hora actual actualizada cada segundo-//
/**
 * Renderiza HH:MM actualizado cada segundo.
 * No recibe props — lee la hora del sistema del cliente.
 * @pure (sin efectos secundarios de red)
 */
export function ServiceClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    //-aqui empieza funcion updateTime y es para calcular y formatear la hora actual-//
    function updateTime() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      setTime(`${h}:${m}`);
    }
    //-aqui termina funcion updateTime-//

    updateTime();
    const id = setInterval(updateTime, 1_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span className="font-mono text-base font-bold text-white tabular-nums">
      {time}
    </span>
  );
}
//-aqui termina componente ServiceClock-//

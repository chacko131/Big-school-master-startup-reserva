/**
 * Archivo: KdsAutoRefresh.tsx
 * Responsabilidad: Forzar un router.refresh() periódico para mantener el KDS actualizado.
 *   No renderiza UI — solo efecto secundario de revalidación.
 * Tipo: UI (client)
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFRESH_INTERVAL_MS = 30_000;

//-aqui empieza componente KdsAutoRefresh y es para refrescar el KDS automáticamente cada 30 segundos-//
/**
 * Monta un intervalo que llama a router.refresh() para re-fetchar datos del servidor
 * sin perder el estado del cliente.
 * @sideEffect dispara re-render del Server Component padre
 */
export function KdsAutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [router]);

  return null;
}
//-aqui termina componente KdsAutoRefresh-//

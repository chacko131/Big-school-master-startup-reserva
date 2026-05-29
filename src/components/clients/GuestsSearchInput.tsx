/**
 * Archivo: GuestsSearchInput.tsx
 * Responsabilidad: Input reactivo del cliente para filtrar huéspedes en el CRM.
 * Tipo: UI (Client Component)
 */

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { T } from "@/components/T";

//-aqui empieza componente GuestsSearchInput y es para filtrar clientes de forma reactiva en el CRM-//
/**
 * Campo de entrada para buscar clientes con debounce automático reflejado en los parámetros de la URL.
 *
 * @sideEffect
 */
export function GuestsSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [text, setText] = useState(() => searchParams.get("q") ?? "");

  useEffect(() => {
    const currentQ = searchParams.get("q") ?? "";
    if (text.trim() === currentQ.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (text.trim().length > 0) {
        params.set("q", text.trim());
      } else {
        params.delete("q");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 350);

    return () => clearTimeout(timer);
  }, [text, pathname, router, searchParams]);

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-surface-container-low p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="flex min-w-[260px] flex-1 items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-3">
        <OnboardingIcon name="person" className="h-5 w-5 text-on-surface-variant" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Buscar cliente, email o teléfono..."
          className="w-full bg-transparent text-sm font-semibold text-on-surface outline-none placeholder:text-on-surface-variant/60"
        />
      </div>

      {searchParams.get("q") && (
        <button
          onClick={() => setText("")}
          className="text-xs font-bold text-primary hover:underline"
          type="button"
        >
          <T>Limpiar búsqueda</T>
        </button>
      )}
    </section>
  );
}
//-aqui termina componente GuestsSearchInput-//

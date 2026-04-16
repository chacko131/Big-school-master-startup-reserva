/**
 * Archivo: page.tsx
 * Responsabilidad: Presentar el punto de entrada público al panel B2B sin mezclarlo con marketing.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { PublicCard } from "@/components/public/PublicCard";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { PublicSection } from "@/components/public/PublicSection";

//-aqui empieza pagina de acceso y es para centralizar la entrada al producto B2B-//
/**
 * Renderiza la puerta de entrada pública al panel del restaurante.
 */
export default function SignInPage() {
  return (
    <PublicPageShell className="justify-center">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-8">
        <PublicSection
          eyebrow="Acceso B2B"
          title="Ingresa al panel de tu restaurante"
          description="Esta superficie concentra el acceso para dueños, managers y staff operativo. La autenticación real se conectará en la siguiente fase, pero la ruta y la navegación ya quedan separadas del marketing."
          actions={
            <>
              <Link
                href="/sign-up"
                className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:scale-95"
              >
                <T>Crear cuenta</T>
              </Link>
              <Link
                href="/demo"
                className="rounded-lg border border-outline px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground"
              >
                <T>Solicitar demo</T>
              </Link>
            </>
          }
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <PublicCard
              title="Quién entra aquí"
              description="Dueños, managers y personal autorizado del restaurante."
              tone="primary"
            />
            <PublicCard
              title="Qué encontrarás"
              description="Operación diaria, reservas, mesas, billing y configuración interna del tenant."
              tone="secondary"
            />
            <PublicCard
              title="Siguiente fase"
              description="Aquí se conectará la autenticación real, manteniendo la separación entre acceso, dashboard y marketing."
              tone="tertiary"
            />
          </div>
        </PublicSection>
      </div>
    </PublicPageShell>
  );
}
//-aqui termina pagina de acceso-//

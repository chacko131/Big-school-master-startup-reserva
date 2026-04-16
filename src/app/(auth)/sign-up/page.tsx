/**
 * Archivo: page.tsx
 * Responsabilidad: Presentar el alta pública inicial del restaurante sin mezclarla con el contenido comercial.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";
import { PublicCard } from "@/components/public/PublicCard";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { PublicSection } from "@/components/public/PublicSection";

//-aqui empieza pagina de alta y es para preparar el registro inicial del restaurante-//
/**
 * Renderiza la entrada pública al alta inicial del restaurante.
 */
export default function SignUpPage() {
  return (
    <PublicPageShell className="justify-center">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-8">
        <PublicSection
          eyebrow="Alta inicial"
          title="Crea el acceso de tu restaurante"
          description="Esta ruta prepara el registro inicial del tenant y separa el alta del contenido comercial. El flujo funcional de registro y onboarding se conectará en la siguiente fase protegida."
          actions={
            <>
              <Link
                href="/sign-in"
                className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:scale-95"
              >
                <T>Ya tengo cuenta</T>
              </Link>
              <Link
                href="/demo"
                className="rounded-lg border border-outline px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground"
              >
                <T>Hablar con ventas</T>
              </Link>
            </>
          }
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <PublicCard
              title="Alta organizada"
              description="El registro queda separado del marketing y del flujo operativo interno."
              tone="primary"
            />
            <PublicCard
              title="Preparado para onboarding"
              description="Después del alta, el restaurante continuará por el onboarding autenticado dentro del ámbito protegido."
              tone="secondary"
            />
            <PublicCard
              title="Sin mezclar responsabilidades"
              description="Marketing, autenticación, onboarding y experiencia del cliente final quedan desacoplados desde la estructura de rutas."
              tone="tertiary"
            />
          </div>
        </PublicSection>
      </div>
    </PublicPageShell>
  );
}
//-aqui termina pagina de alta-//

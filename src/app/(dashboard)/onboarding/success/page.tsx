/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la pantalla final de éxito del onboarding del restaurante.
 * Tipo: UI
 */

import Image from "next/image";
import Link from "next/link";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

const successHeroImageSrc = "https://lh3.googleusercontent.com/aida-public/AB6AXuALGbPHoTE-adhwuJWYmD9KHdCzbC7s7Ox5a-1cXwppJmzYo4vrme8xN0vGs9IUdwuOhx6uaK-4S2l1T6gUdswDYXlJhr-Vtk1Exi1eZBwnmSNoJDg8ERF4VaJHI9wI_8ltpSXAPUGYWiAPgyzbMyquswROQkWgnGnu85iuIehjeesyQU2vfKk93yvVP577MFbTz0WiYGICS4b01JvZGMsYh_FRGMErLhWzchYRcAelYgbAAsG9M0xkqBbfFY1iBELyyuVGHqot9qw";
const successPreviewUrl = "restoflow.io/el-capitan";

//-aqui empieza componente SuccessHeroBadge y es para renderizar el estado de finalizacion-//
function SuccessHeroBadge() {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-xl bg-primary shadow-2xl">
        <OnboardingIcon name="checkCircle" className="h-10 w-10 text-on-primary" />
      </div>
      <h1 className="mb-4 font-heading text-5xl font-black tracking-tighter text-primary md:text-7xl">
        <T>La sala ya es tuya.</T>
      </h1>
      <p className="max-w-xl text-lg font-light leading-relaxed text-on-surface-variant md:text-xl">
        <T>Onboarding completado. Reserva Latina ya está sincronizando tu cocina, tu sala y tu equipo operativo.</T>
      </p>
    </div>
  );
}
//-aqui termina componente SuccessHeroBadge-//

//-aqui empieza componente SuccessMainCard y es para presentar la accion principal del onboarding-//
function SuccessMainCard() {
  return (
    <section className="glass-card flex h-full flex-col justify-between rounded-xl border border-outline-variant/20 p-10 shadow-sm">
      <div>
        <h2 className="mb-2 font-heading text-2xl font-bold text-primary">
          <T>¿Listo para salir al aire?</T>
        </h2>
        <p className="mb-12 max-w-md text-on-surface-variant">
          <T>
            Tu espacio quedó calibrado y tus elementos iniciales ya están listos. Desde aquí puedes entrar al dashboard y empezar a operar.
          </T>
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link className="flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-bold text-on-primary transition-all hover:opacity-90 active:scale-95" href="/dashboard">
          <T>Ir al dashboard</T>
          <OnboardingIcon name="arrowForward" className="h-4 w-4" />
        </Link>
        <button className="rounded-lg bg-surface-container-highest px-8 py-4 text-lg font-semibold text-on-surface transition-colors hover:bg-surface-container-high" type="button">
          <T>Ver documentación</T>
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente SuccessMainCard-//

//-aqui empieza componente SuccessPreviewCard y es para mostrar la url publica y su contexto visual-//
function SuccessPreviewCard() {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest shadow-sm">
      <div className="relative h-48 overflow-hidden bg-surface-container-high">
        <Image
          alt="Interior moderno de restaurante"
          className="h-full w-full object-cover opacity-90"
          height={900}
          src={successHeroImageSrc}
          width={1600}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-secondary" />
          <span className="text-xs font-bold uppercase tracking-widest text-white">
            <T>Enlace vivo</T>
          </span>
        </div>
      </div>
      <div className="p-6">
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          <T>URL pública de reservas</T>
        </label>
        <div className="flex items-center justify-between gap-2 rounded-lg border border-outline-variant/10 bg-surface-container p-3">
          <span className="truncate font-mono text-sm text-primary">{successPreviewUrl}</span>
          <button className="text-sm text-on-surface-variant transition-colors hover:text-primary" type="button">
            <OnboardingIcon name="contentCopy" className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-on-surface-variant">
          <T>Comparte este enlace con tus clientes para empezar a recibir reservas digitales premium.</T>
        </p>
      </div>
    </section>
  );
}
//-aqui termina componente SuccessPreviewCard-//

//-aqui empieza componente SuccessPill y es para reforzar el valor del onboarding completo-//
interface SuccessPillProps {
  iconName: "rocketLaunch" | "payments" | "person";
  title: string;
  description: string;
  tone: "secondary" | "surface" | "tertiary";
}

/**
 * Renderiza un bloque informativo pequeño de la pantalla final.
 *
 * @pure
 */
function SuccessPill({ iconName, title, description, tone }: SuccessPillProps) {
  const containerClassName =
    tone === "secondary"
      ? "bg-secondary-container/30 border-secondary/10"
      : tone === "tertiary"
        ? "bg-tertiary-fixed border-on-tertiary-fixed/10"
        : "bg-surface-container-low border-outline-variant/10";
  const iconClassName = tone === "secondary" ? "text-secondary" : tone === "tertiary" ? "text-on-tertiary-fixed-variant" : "text-primary";
  const textClassName = tone === "tertiary" ? "text-on-tertiary-fixed-variant" : tone === "secondary" ? "text-on-secondary-container" : "text-on-surface-variant";
  const titleClassName = tone === "tertiary" ? "text-on-tertiary-fixed-variant" : tone === "secondary" ? "text-secondary" : "text-primary";

  return (
    <section className={`flex flex-col gap-4 rounded-xl border p-6 ${containerClassName}`}>
      <OnboardingIcon name={iconName} className={`h-6 w-6 ${iconClassName}`} />
      <div>
        <p className={`font-heading text-sm font-bold ${titleClassName}`}>
          <T>{title}</T>
        </p>
        <p className={`mt-1 text-xs leading-5 ${textClassName}`}>
          <T>{description}</T>
        </p>
      </div>
    </section>
  );
}
//-aqui termina componente SuccessPill-//

//-aqui empieza componente SuccessFooter y es para dejar una nota de verificacion final-//
function SuccessFooter() {
  return (
    <div className="mt-16 text-center">
      <p className="text-sm font-medium tracking-wide text-on-surface-variant/60">
        <T>Plataforma verificada • Configuración completada</T>
      </p>
    </div>
  );
}
//-aqui termina componente SuccessFooter-//

//-aqui empieza pagina OnboardingSuccessPage y es para cerrar el onboarding con una pantalla sin sidebar-//
/**
 * Presenta la pantalla final de éxito del onboarding.
 */
export default function OnboardingSuccessPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-surface px-6 py-20 font-body text-on-surface antialiased">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-[5%] -top-[10%] h-[60%] w-[60%] rounded-full bg-secondary-container opacity-20 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] h-[50%] w-[40%] rounded-full bg-tertiary-fixed opacity-15 blur-[100px]" />
      </div>

      <div className="z-10 flex w-full max-w-4xl flex-col items-center">
        <SuccessHeroBadge />

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <SuccessMainCard />
          </div>
          <div className="md:col-span-4">
            <SuccessPreviewCard />
          </div>
          <div className="md:col-span-12">
            <section className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <SuccessPill
                  description="Tus mesas están listas para recibir más de una rotación y tu sala ya quedó optimizada."
                  iconName="rocketLaunch"
                  title="Velocidad optimizada"
                  tone="secondary"
                />
              </div>
              <div className="md:col-span-4">
                <SuccessPill
                  description="La integración de cobros ya quedó verificada y los payouts están activos."
                  iconName="payments"
                  title="Billing activo"
                  tone="surface"
                />
              </div>
              <div className="md:col-span-4">
                <SuccessPill
                  description="Tu perfil de owner quedó protegido y el equipo puede seguir avanzando con soporte VIP."
                  iconName="person"
                  title="Bonificación de onboarding"
                  tone="tertiary"
                />
              </div>
            </section>
          </div>
        </div>

        <SuccessFooter />
      </div>
    </main>
  );
}
//-aqui termina pagina OnboardingSuccessPage-//

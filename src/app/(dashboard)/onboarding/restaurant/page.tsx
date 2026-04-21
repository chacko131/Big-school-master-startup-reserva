/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el primer paso hardcodeado del onboarding para capturar los datos base del restaurante.
 * Tipo: UI
 */

import Image from "next/image";
import Link from "next/link";
import { ONBOARDING_TOTAL_STEPS, getOnboardingStepNumber, getOnboardingSteps } from "@/constants/onboarding";
import { T } from "@/components/T";
import { OnboardingField } from "@/components/onboarding/OnboardingField";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

const restaurantInputClassName = "w-full rounded-lg border-0 bg-surface-container-low px-4 py-4 text-base text-on-surface transition-all placeholder:text-outline focus:ring-1 focus:ring-primary";
const restaurantContentLayoutClassName = "flex w-full max-w-5xl flex-col items-start gap-12 md:flex-row md:gap-16";

const restaurantTimezoneOptions = [
  "America/Santo_Domingo (GMT-04:00)",
  "America/Bogota (GMT-05:00)",
  "America/Mexico_City (GMT-06:00)",
  "Europe/Madrid (GMT+01:00)",
] as const;

//-aqui empieza componente RestaurantHero y es para presentar el contexto visual del paso-//
function RestaurantHero() {
  return (
    <section className="flex w-full flex-col gap-8 md:w-2/5">
      <div className="space-y-4">
        <h1 className="max-w-sm text-5xl font-extrabold leading-[1.06] tracking-tighter text-primary">
          <T>Cuéntanos sobre tu restaurante.</T>
        </h1>
        <p className="max-w-sm text-lg font-light leading-relaxed text-on-surface-variant">
          <T>Empecemos por lo esencial. Estos datos preparan tu perfil público y sientan la base del portal de reservas.</T>
        </p>
      </div>

      <div className="relative hidden overflow-hidden rounded-2xl bg-surface-container-high shadow-[0_20px_40px_rgba(26,28,28,0.08)] md:block">
        <Image
          alt="Interior elegante de un restaurante con iluminación cálida y mesas preparadas"
          className="h-auto w-full object-cover"
          height={720}
          loading="eager"
          priority
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEvBWiEo9SMYt3pMijHVngt4jLuAeL8bjtsPYz05vIgvKEFAGiRxSVsvp8WaCslUrmCvdbi9TV1BLLx5X-frrP-AxwiH4pLkgu-8zt30jFxuukuo8lGRZA3Ul0kBSD-eg9qc_BrXg7_eYmVhAku1QICwJEKQBUExIuQowY3vzvdTvzpJ40vWapud419pHNTGxhKnCYIemxv_Lj3_hwzpfnKFa8GcpLoRtwkhPsTJggwWgcm6oZ6SE-tN725UUrCvgudKpDDgO4yiw"
          width={960}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]">
              <OnboardingIcon name="restaurant" className="h-4 w-4" />
              <T>Experiencia premium</T>
            </div>
            <p className="text-sm font-medium text-white/90">
              <T>Reserva Latina Pro Suite</T>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
//-aqui termina componente RestaurantHero-//

//-aqui empieza componente RestaurantProfileForm y es para mostrar el formulario base del restaurante-//
function RestaurantProfileForm() {
  return (
    <section className="w-full rounded-[28px] bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(26,28,28,0.04)] md:w-3/5 md:p-10">
      <form className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <OnboardingField className="md:col-span-2" htmlFor="restaurant-name" label="Nombre del restaurante">
            <input
              className={restaurantInputClassName}
              defaultValue="La Terraza Latina"
              id="restaurant-name"
              placeholder="Ej. La Terraza Latina"
              type="text"
            />
          </OnboardingField>

          <OnboardingField
            className="md:col-span-2"
            htmlFor="restaurant-slug"
            hint="Este enlace se usará para compartir tu página pública y recibir reservas."
            label="Slug público"
          >
            <div className="flex items-center overflow-hidden rounded-lg focus-within:ring-1 focus-within:ring-primary">
              <span className="bg-surface-container-highest px-4 py-4 text-sm font-medium text-on-surface-variant">
                reservalatina.com/
              </span>
              <input
                className="min-w-0 flex-1 border-0 bg-surface-container-low px-4 py-4 text-base text-on-surface placeholder:text-outline focus:ring-0"
                defaultValue="la-terraza-latina"
                id="restaurant-slug"
                placeholder="la-terraza-latina"
                type="text"
              />
            </div>
          </OnboardingField>

          <OnboardingField htmlFor="restaurant-timezone" label="Zona horaria">
            <div className="relative">
              <select className={`${restaurantInputClassName} appearance-none pr-12`} defaultValue={restaurantTimezoneOptions[0]} id="restaurant-timezone">
                {restaurantTimezoneOptions.map((timezoneOption) => (
                  <option key={timezoneOption} value={timezoneOption}>
                    {timezoneOption}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-outline">
                <OnboardingIcon name="expandMore" />
              </div>
            </div>
          </OnboardingField>

          <OnboardingField htmlFor="restaurant-email" label="Correo del negocio">
            <input
              className={restaurantInputClassName}
              defaultValue="hola@laterraza.com"
              id="restaurant-email"
              placeholder="hola@restaurante.com"
              type="email"
            />
          </OnboardingField>

          <OnboardingField className="md:col-span-2" htmlFor="restaurant-phone" label="Teléfono">
            <input
              className={restaurantInputClassName}
              defaultValue="+34 600 123 456"
              id="restaurant-phone"
              placeholder="+34 600 123 456"
              type="tel"
            />
          </OnboardingField>
        </div>

        <div className="hidden items-center justify-between border-t border-outline-variant/20 pt-8 md:flex">
          <button className="text-sm font-bold uppercase tracking-[0.22em] text-on-primary-container transition-colors hover:text-on-surface" type="button">
            <T>Guardar borrador</T>
          </button>
          <Link className="flex items-center gap-3 rounded-lg bg-primary px-10 py-4 text-sm font-bold uppercase tracking-[0.22em] text-on-primary transition-all hover:opacity-90" href="/onboarding/settings">
            <T>Continuar</T>
            <OnboardingIcon name="arrowForward" className="h-4 w-4" />
          </Link>
        </div>
      </form>
    </section>
  );
}
//-aqui termina componente RestaurantProfileForm-//

//-aqui empieza componente RestaurantMobileQuote y es para mantener el remate editorial en mobile-//
function RestaurantMobileQuote() {
  return (
    <section className="mt-12 border-t border-outline-variant/20 pt-10 md:hidden">
      <div className="flex flex-col items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
          <OnboardingIcon name="restaurant" className="h-6 w-6" />
        </div>
        <blockquote className="max-w-xs text-2xl font-bold leading-tight tracking-tight text-primary">
          <T>La hospitalidad empieza cuando cada detalle del espacio comunica confianza.</T>
        </blockquote>
      </div>
    </section>
  );
}
//-aqui termina componente RestaurantMobileQuote-//

//-aqui empieza pagina RestaurantOnboardingPage y es para montar el primer paso del onboarding-//
/**
 * Presenta el paso inicial del onboarding con los datos base del restaurante.
 */
export default function RestaurantOnboardingPage() {
  const currentStepKey = "restaurant" as const;
  const currentStepNumber = getOnboardingStepNumber(currentStepKey);
  const onboardingSteps = getOnboardingSteps(currentStepKey);

  return (
    <OnboardingShell
      currentStepNumber={currentStepNumber}
      mobilePrimaryAction={{ label: "Continuar", href: "/onboarding/settings", icon: "arrowForward" }}
      mobileSecondaryAction={{ label: "Guardar borrador", icon: "save" }}
      steps={onboardingSteps}
      title="Perfil del restaurante"
      totalSteps={ONBOARDING_TOTAL_STEPS}
    >
      <div className={restaurantContentLayoutClassName}>
        <RestaurantHero />
        <RestaurantProfileForm />
      </div>
      <RestaurantMobileQuote />
    </OnboardingShell>
  );
}
//-aqui termina pagina RestaurantOnboardingPage-//

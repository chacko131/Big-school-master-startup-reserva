/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el paso de selección de plan dentro del onboarding del restaurante.
 * Tipo: UI
 */

import Image from "next/image";
import { ONBOARDING_TOTAL_STEPS, getOnboardingStepNumber, getOnboardingSteps } from "@/constants/onboarding";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onbarding/OnboardingIcon";
import { OnboardingShell } from "@/components/onbarding/OnboardingShell";

interface PlanDefinition {
  eyebrow: string;
  name: string;
  price: string;
  cadence: string;
  features: readonly string[];
  highlighted?: boolean;
  ctaLabel: string;
}

const planPageLayoutClassName = "flex w-full max-w-6xl flex-col gap-16";
const planDefinitions: ReadonlyArray<PlanDefinition> = [
  {
    eyebrow: "Esencial",
    name: "Basic",
    price: "$49",
    cadence: "/mes",
    features: ["Hasta 10 mesas", "Analítica estándar", "Soporte por email"],
    ctaLabel: "Seleccionar Basic",
  },
  {
    eyebrow: "Crecimiento avanzado",
    name: "Pro",
    price: "$129",
    cadence: "/mes",
    features: ["Mesas ilimitadas", "IA de ingresos en tiempo real", "Concierge prioritario 24/7", "Gestión de inventario"],
    highlighted: true,
    ctaLabel: "Seleccionar Pro",
  },
  {
    eyebrow: "Escalable",
    name: "Enterprise",
    price: "$299",
    cadence: "/mes",
    features: ["Sincronización multi-sede", "Acceso API personalizado", "Manager dedicado"],
    ctaLabel: "Contactar ventas",
  },
] as const;
const hospitalityTrustImageSrc = "https://lh3.googleusercontent.com/aida-public/AB6AXuDqCXs8nrcN0xPR0fIReZkGyYNXDtMQAP-QzeHMYugwqBAcJHjzAdaojqcZLAavJ9U4fJFNf-pcyhzXqyAaPRLW1F4iXLdhbg2PxfEu0DeiRcro8fCV97pgqPXo8Y0iSe43SbcLmyf8OusdD5isEhzjW2WxTnECDzzFdixCVpxQc9bLl0CLeb0GmCexP9ZvK4ECqi-fUxykJ74qIVviutOB0dETd04fWf4UDKyZzPduIw-8q8zMd_q9tqXszN_Y3G5LKxtWRH3KrUc";

//-aqui empieza componente PlanHero y es para introducir el paso de billing con tono editorial-//
function PlanHero() {
  return (
    <section className="space-y-4">
      <h1 className="text-5xl font-extrabold tracking-tight text-primary">
        <T>Elige tu ritmo.</T>
      </h1>
      <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant">
        <T>
          Selecciona un plan que acompañe el volumen de tu restaurante. Podrás ajustarlo más adelante a medida que tu operación crezca.
        </T>
      </p>
    </section>
  );
}
//-aqui termina componente PlanHero-//

//-aqui empieza componente PlanCard y es para representar cada opcion de pricing del onboarding-//
interface PlanCardProps {
  planDefinition: PlanDefinition;
}

/**
 * Renderiza una tarjeta individual de plan SaaS.
 *
 * @pure
 */
function PlanCard({ planDefinition }: PlanCardProps) {
  const containerClassName = planDefinition.highlighted
    ? "relative z-10 flex h-full flex-col rounded-[28px] bg-primary p-10 text-white shadow-[0_24px_48px_rgba(26,28,28,0.2)] lg:scale-105"
    : "flex h-full flex-col rounded-[24px] bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(26,28,28,0.04)]";
  const eyebrowClassName = planDefinition.highlighted ? "text-white/60" : "text-on-surface-variant";
  const cadenceClassName = planDefinition.highlighted ? "text-white/60" : "text-on-surface-variant";
  const featureClassName = planDefinition.highlighted ? "text-white/85" : "text-on-surface";
  const buttonClassName = planDefinition.highlighted
    ? "bg-white text-primary hover:bg-white/90"
    : "bg-surface-container-highest text-on-surface hover:bg-surface-container-high";

  return (
    <article className={containerClassName}>
      {planDefinition.highlighted ? (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
          <T>Más popular</T>
        </div>
      ) : null}

      <div className="mb-8">
        <span className={`text-xs font-bold uppercase tracking-[0.2em] ${eyebrowClassName}`}>
          <T>{planDefinition.eyebrow}</T>
        </span>
        <h3 className="mt-2 text-3xl font-black tracking-tight">{planDefinition.name}</h3>
        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-4xl font-bold">{planDefinition.price}</span>
          <span className={`font-medium ${cadenceClassName}`}>{planDefinition.cadence}</span>
        </div>
      </div>

      <ul className="mb-10 flex flex-1 flex-col gap-4">
        {planDefinition.features.map((feature) => (
          <li key={feature} className={`flex items-center gap-3 text-sm ${featureClassName}`}>
            <OnboardingIcon name="checkCircle" className="h-4 w-4 text-secondary" />
            <T>{feature}</T>
          </li>
        ))}
      </ul>

      <button className={`w-full rounded-lg py-4 text-sm font-bold tracking-tight transition-all ${buttonClassName}`} type="button">
        <T>{planDefinition.ctaLabel}</T>
      </button>
    </article>
  );
}
//-aqui termina componente PlanCard-//

//-aqui empieza componente PlansGrid y es para agrupar las tarjetas de planes con la jerarquia de Stitch-//
function PlansGrid() {
  return (
    <section className="flex flex-col gap-8 md:flex-row md:items-end">
      {planDefinitions.map((planDefinition) => (
        <div key={planDefinition.name} className="flex-1">
          <PlanCard planDefinition={planDefinition} />
        </div>
      ))}
    </section>
  );
}
//-aqui termina componente PlansGrid-//

//-aqui empieza componente HospitalityTrustSection y es para reforzar la confianza comercial del paso de billing-//
function HospitalityTrustSection() {
  return (
    <section className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div className="relative aspect-video overflow-hidden rounded-[28px] bg-surface-container-high">
        <Image
          alt="Comedor elegante de restaurante con iluminación cálida y mesas preparadas al atardecer"
          className="h-full w-full object-cover grayscale contrast-125 transition-all duration-700 hover:grayscale-0"
          height={900}
          src={hospitalityTrustImageSrc}
          width={1600}
        />
        <div className="absolute inset-0 bg-black/20 transition-all hover:bg-transparent" />
      </div>

      <div className="flex flex-col justify-center">
        <span className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
          <T>Hospitalidad primero</T>
        </span>
        <h4 className="mb-6 text-3xl font-bold tracking-tight text-primary">
          <T>Construido para el salón, no solo para el back office.</T>
        </h4>
        <p className="leading-8 text-on-surface-variant">
          <T>
            Reserva Latina se diseñó junto a restauradores de alto nivel. Sabemos que, en una noche intensa de sábado, el software debe ser lo último que te preocupe. Por eso el plan Pro incluye automatizaciones avanzadas para evitar sobrecargas y proteger tu experiencia de servicio.
          </T>
        </p>
      </div>
    </section>
  );
}
//-aqui termina componente HospitalityTrustSection-//

//-aqui empieza componente PlanFooter and es para cerrar la experiencia de seleccion de plan con confianza y accion-//
function PlanFooter() {
  return (
    <section className="flex flex-col justify-between gap-6 border-t border-outline-variant/20 py-10 md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-outline-variant text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          SSL
        </div>
        <p className="max-w-[220px] text-xs leading-6 text-on-surface-variant">
          <T>Procesamiento seguro con cifrado SSL de 256 bits listo para el futuro checkout.</T>
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-sm font-bold text-on-surface-variant transition-colors hover:text-primary" type="button">
          <T>Omitir por ahora</T>
        </button>
        <button className="rounded-lg bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-on-primary transition-all hover:opacity-90" type="button">
          <T>Activar plan</T>
        </button>
      </div>
    </section>
  );
}
//-aqui termina componente PlanFooter-//

//-aqui empieza pagina PlanOnboardingPage y es para montar el paso final de seleccion de plan del onboarding-//
/**
 * Presenta la pantalla de selección de plan SaaS para el restaurante.
 */
export default function PlanOnboardingPage() {
  const currentStepKey = "plan" as const;
  const currentStepNumber = getOnboardingStepNumber(currentStepKey);
  const onboardingSteps = getOnboardingSteps(currentStepKey);

  return (
    <OnboardingShell
      currentStepNumber={currentStepNumber}
      mobilePrimaryAction={{ label: "Activar plan", icon: "arrowForward" }}
      mobileSecondaryAction={{ label: "Guardar borrador", icon: "save" }}
      steps={onboardingSteps}
      title="Plan de pago"
      totalSteps={ONBOARDING_TOTAL_STEPS}
    >
      <div className={planPageLayoutClassName}>
        <PlanHero />
        <PlansGrid />
        <HospitalityTrustSection />
        <PlanFooter />
      </div>
    </OnboardingShell>
  );
}
//-aqui termina pagina PlanOnboardingPage-//

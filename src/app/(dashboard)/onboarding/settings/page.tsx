/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el paso de configuración operativa del onboarding del restaurante.
 * Tipo: UI
 */

import Link from "next/link";
import { ONBOARDING_TOTAL_STEPS, getOnboardingStepNumber, getOnboardingSteps } from "@/constants/onboarding";
import { T } from "@/components/T";
import { OnboardingField } from "@/components/onboarding/OnboardingField";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";

const settingsPageLayoutClassName = "flex w-full max-w-5xl flex-col gap-12";
const settingsGridClassName = "grid grid-cols-1 gap-8 md:grid-cols-12";
const settingsSectionCardClassName = "rounded-[24px] bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(26,28,28,0.04)]";
const settingsSelectClassName = "w-full rounded-lg border-0 bg-surface-container-highest px-4 py-4 text-base text-on-surface transition-all focus:ring-1 focus:ring-primary";

const durationOptions = ["60 minutos", "90 minutos", "120 minutos", "180 minutos"] as const;
const bufferOptions = ["Sin buffer", "15 minutos", "30 minutos"] as const;
const autoAssignmentOptions = ["Rotación de meseros", "Ocupación óptima", "Prioridad VIP"] as const;
const flowEffectBarHeights = ["40%", "60%", "90%", "50%", "75%"] as const;

//-aqui empieza componente OperationalSettingsIntro y es para presentar el contexto editorial del paso-//
function OperationalSettingsIntro() {
  return (
    <section className="space-y-4">
      <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.02] tracking-tighter text-primary">
        <T>Afina tu operación.</T>
      </h1>
      <p className="max-w-3xl text-lg font-light leading-relaxed text-on-surface-variant">
        <T>
          Configura cómo fluye tu sala. Estas reglas actúan como tu concierge digital y ayudan a mantener el ritmo del servicio con claridad.
        </T>
      </p>
    </section>
  );
}
//-aqui termina componente OperationalSettingsIntro-//

//-aqui empieza componente SettingsModeRow y es para representar bloques de decisión binaria con estilo editorial-//
function SettingsModeRow() {
  return (
    <div className="flex flex-col justify-between gap-5 rounded-2xl bg-surface-container-low p-6 md:flex-row md:items-center">
      <div className="space-y-1">
        <p className="text-base font-semibold text-on-surface">
          <T>Modo de aprobación</T>
        </p>
        <p className="text-sm leading-6 text-on-surface-variant">
          <T>Confirma reservas automáticamente o revísalas manualmente antes de aceptarlas.</T>
        </p>
      </div>
      <div className="inline-flex rounded-xl bg-surface-container-highest p-1">
        <button className="rounded-lg bg-surface-container-lowest px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary shadow-sm" type="button">
          <T>Auto</T>
        </button>
        <button className="px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant" type="button">
          <T>Manual</T>
        </button>
      </div>
    </div>
  );
}
//-aqui termina componente SettingsModeRow-//

//-aqui empieza componente SettingsSwitchRow y es para reutilizar filas con switches visuales en la pantalla operativa-//
interface SettingsSwitchRowProps {
  title: string;
  description: string;
  highlighted?: boolean;
  defaultChecked?: boolean;
}

/**
 * Renderiza una fila de configuración con un switch visual.
 *
 * @pure
 */
function SettingsSwitchRow({ title, description, highlighted = false, defaultChecked = false }: SettingsSwitchRowProps) {
  const containerClassName = highlighted
    ? "rounded-2xl border-l-4 border-secondary bg-surface-container-low p-6"
    : "rounded-2xl bg-surface-container-low p-6";

  return (
    <div className={`${containerClassName} flex flex-col justify-between gap-5 md:flex-row md:items-center`}>
      <div className="space-y-1">
        <p className="text-base font-semibold text-on-surface">
          <T>{title}</T>
        </p>
        <p className="text-sm leading-6 text-on-surface-variant">
          <T>{description}</T>
        </p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center self-start md:self-center">
        <input className="peer sr-only" defaultChecked={defaultChecked} type="checkbox" />
        <span className="h-6 w-11 rounded-full bg-surface-container-highest transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white after:bg-white after:transition-transform after:content-[''] peer-checked:bg-secondary peer-checked:after:translate-x-full" />
      </label>
    </div>
  );
}
//-aqui termina componente SettingsSwitchRow-//

//-aqui empieza componente OperationalSettingsForm y es para montar la columna principal de configuraciones-//
function OperationalSettingsForm() {
  return (
    <section className="space-y-10 md:col-span-8">
      <section className={settingsSectionCardClassName}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
            <OnboardingIcon name="settings" className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-primary">
            <T>Control de reservas</T>
          </h3>
        </div>
        <div className="space-y-6">
          <SettingsModeRow />
          <SettingsSwitchRow
            defaultChecked
            description="Activa una cola digital cuando el restaurante llegue a su capacidad máxima."
            title="Modo lista de espera"
          />
        </div>
      </section>

      <section className={settingsSectionCardClassName}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
            <OnboardingIcon name="schedule" className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-primary">
            <T>Tiempo y ritmo</T>
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <OnboardingField htmlFor="default-duration" label="Duración por defecto">
            <select className={`${settingsSelectClassName} appearance-none`} defaultValue={durationOptions[1]} id="default-duration">
              {durationOptions.map((durationOption) => (
                <option key={durationOption} value={durationOption}>
                  {durationOption}
                </option>
              ))}
            </select>
          </OnboardingField>

          <OnboardingField htmlFor="buffer-time" label="Tiempo buffer">
            <select className={`${settingsSelectClassName} appearance-none`} defaultValue={bufferOptions[1]} id="buffer-time">
              {bufferOptions.map((bufferOption) => (
                <option key={bufferOption} value={bufferOption}>
                  {bufferOption}
                </option>
              ))}
            </select>
          </OnboardingField>

          <OnboardingField className="sm:col-span-2" htmlFor="cancellation-window" label="Ventana de cancelación">
            <div className="rounded-2xl bg-surface-container-highest p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <input
                  className="w-full accent-primary"
                  defaultValue="24"
                  id="cancellation-window"
                  max="72"
                  min="1"
                  type="range"
                />
                <span className="min-w-[92px] text-right text-sm font-bold text-primary">
                  <T>24 horas</T>
                </span>
              </div>
            </div>
          </OnboardingField>
        </div>
      </section>

      <section className={settingsSectionCardClassName}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
            <OnboardingIcon name="gridView" className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-primary">
            <T>Lógica de sala</T>
          </h3>
        </div>
        <div className="space-y-6">
          <SettingsSwitchRow
            defaultChecked
            description="Permite al sistema unir mesas cercanas cuando entren grupos grandes."
            highlighted
            title="Combinación de mesas"
          />

          <div className="flex flex-col justify-between gap-5 rounded-2xl bg-surface-container-low p-6 md:flex-row md:items-center">
            <div className="space-y-1">
              <p className="text-base font-semibold text-on-surface">
                <T>Asignación inteligente</T>
              </p>
              <p className="text-sm leading-6 text-on-surface-variant">
                <T>Prioriza secciones, rotación de personal o experiencia VIP según tu operación.</T>
              </p>
            </div>
            <select className="rounded-lg border-0 bg-surface-container-highest px-4 py-3 text-sm font-bold text-on-surface focus:ring-1 focus:ring-primary">
              {autoAssignmentOptions.map((autoAssignmentOption) => (
                <option key={autoAssignmentOption} value={autoAssignmentOption}>
                  {autoAssignmentOption}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>
    </section>
  );
}
//-aqui termina componente OperationalSettingsForm-//

//-aqui empieza componente FlowEffectPanel y es para presentar la vista editorial lateral de insights-//
function FlowEffectPanel() {
  return (
    <aside className="space-y-6 md:col-span-4">
      <div className="space-y-6 md:sticky md:top-24">
        <section className="relative overflow-hidden rounded-[28px] bg-primary p-8 text-on-primary shadow-[0_24px_48px_rgba(26,28,28,0.18)]">
          <div className="relative z-10 space-y-4">
            <h4 className="text-3xl font-bold italic tracking-tight text-white!">
              <T>El efecto del flujo</T>
            </h4>
            <p className="text-sm leading-7 text-white/72">
              <T>
                Con un buffer de 15 minutos y una duración de 90 minutos, estimamos que podrás recibir hasta 142 cubiertos por servicio.
              </T>
            </p>
            <div className="flex h-32 items-end gap-2 rounded-xl bg-white/6 p-4">
              {flowEffectBarHeights.map((barHeight, index) => {
                const barClassName = index === 3 ? "bg-white" : index === 1 ? "bg-secondary/80" : index === 4 ? "bg-secondary/60" : "bg-secondary";

                return <div key={`${barHeight}-${index}`} className={`flex-1 ${barClassName}`} style={{ height: barHeight }} />;
              })}
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-10 -right-10 text-white/10">
            <OnboardingIcon name="restaurant" className="h-32 w-32" />
          </div>
        </section>

        <section className="rounded-[24px] border-2 border-dashed border-outline-variant bg-surface-container-lowest p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
              <OnboardingIcon name="help" className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                <T>Consejo experto</T>
              </p>
              <p className="text-sm leading-7 text-on-surface-variant">
                <T>La aprobación manual durante la primera semana ayuda a calibrar mejor el ritmo real de tu equipo.</T>
              </p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
//-aqui termina componente FlowEffectPanel-//

//-aqui empieza componente OperationalSettingsFooter y es para mantener la accion principal fija en desktop-//
interface OperationalSettingsFooterProps {
  currentStepNumber: number;
  totalSteps: number;
}

/**
 * Presenta la barra de acciones principal del paso operativo en escritorio.
 *
 * @pure
 */
function OperationalSettingsFooter({ currentStepNumber, totalSteps }: OperationalSettingsFooterProps) {
  return (
    <footer className="hidden items-center justify-between gap-6 rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest/90 px-8 py-6 backdrop-blur-xl md:flex">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-secondary text-sm font-bold text-secondary">
          {currentStepNumber}/{totalSteps}
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-on-surface-variant">
          <T>Fase de configuración del restaurante</T>
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-on-surface transition-colors hover:bg-surface-container-high" type="button">
          <T>Guardar borrador</T>
        </button>
        <Link className="flex items-center gap-3 rounded-lg bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-on-primary transition-all hover:opacity-90" href="/onboarding/tables">
          <T>Continuar a mesas</T>
          <OnboardingIcon name="arrowForward" className="h-4 w-4" />
        </Link>
      </div>
    </footer>
  );
}
//-aqui termina componente OperationalSettingsFooter-//

//-aqui empieza pagina SettingsOnboardingPage y es para montar el paso operativo del onboarding-//
/**
 * Presenta la pantalla de configuración operativa del restaurante.
 */
export default function SettingsOnboardingPage() {
  const currentStepKey = "settings" as const;
  const currentStepNumber = getOnboardingStepNumber(currentStepKey);
  const onboardingSteps = getOnboardingSteps(currentStepKey);

  return (
    <OnboardingShell
      currentStepNumber={currentStepNumber}
      mobilePrimaryAction={{ label: "Continuar", href: "/onboarding/tables", icon: "arrowForward" }}
      mobileSecondaryAction={{ label: "Guardar borrador", icon: "save" }}
      steps={onboardingSteps}
      title="Configuración operativa"
      totalSteps={ONBOARDING_TOTAL_STEPS}
    >
      <div className={settingsPageLayoutClassName}>
        <OperationalSettingsIntro />
        <div className={settingsGridClassName}>
          <OperationalSettingsForm />
          <FlowEffectPanel />
        </div>
        <OperationalSettingsFooter currentStepNumber={currentStepNumber} totalSteps={ONBOARDING_TOTAL_STEPS} />
      </div>
    </OnboardingShell>
  );
}
//-aqui termina pagina SettingsOnboardingPage-//

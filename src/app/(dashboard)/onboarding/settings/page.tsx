/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el paso de configuración operativa del onboarding del restaurante.
 * Tipo: UI
 */

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { ONBOARDING_TOTAL_STEPS, getOnboardingStepNumber, getOnboardingSteps } from "@/constants/onboarding";
import { T } from "@/components/T";
import { OnboardingField } from "@/components/onboarding/OnboardingField";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { RestaurantSettings } from "@/modules/catalog/domain/entities/restaurant-settings.entity";
import { UpdateRestaurantSettings } from "@/modules/catalog/application/use-cases/update-restaurant-settings.use-case";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";

const settingsOnboardingFormId = "settings-onboarding-form";

interface SettingsOnboardingPageProps {
  searchParams: Promise<{ restaurantId?: string | string[]; error?: string | string[]; saved?: string | string[] }>;
}

interface SettingsOnboardingDraft {
  restaurantId: string;
  reservationApprovalMode: "AUTO" | "MANUAL";
  waitlistMode: "MANUAL" | "AUTO";
  defaultReservationDurationMinutes: number;
  reservationBufferMinutes: number;
  cancellationWindowHours: number;
  allowTableCombination: boolean;
  enableAutoTableAssignment: boolean;
}

interface OperationalSettingsFormProps {
  restaurantId: string;
  errorMessage?: string;
  successMessage?: string;
  initialValues: SettingsOnboardingDraft;
}

const settingsOnboardingSchema = z.object({
  restaurantId: z.string().trim().min(1),
  reservationApprovalMode: z.enum(["AUTO", "MANUAL"]),
  waitlistMode: z.enum(["MANUAL", "AUTO"]),
  defaultReservationDurationMinutes: z.coerce.number().int().min(1),
  reservationBufferMinutes: z.coerce.number().int().min(0),
  cancellationWindowHours: z.coerce.number().int().min(0),
  allowTableCombination: z.coerce.boolean(),
  enableAutoTableAssignment: z.coerce.boolean(),
});

const settingsOnboardingDraftSchema = z.object({
  restaurantId: z.string().trim(),
  reservationApprovalMode: z.enum(["AUTO", "MANUAL"]),
  waitlistMode: z.enum(["MANUAL", "AUTO"]),
  defaultReservationDurationMinutes: z.coerce.number().int().min(1),
  reservationBufferMinutes: z.coerce.number().int().min(0),
  cancellationWindowHours: z.coerce.number().int().min(0),
  allowTableCombination: z.coerce.boolean(),
  enableAutoTableAssignment: z.coerce.boolean(),
});

const settingsOnboardingDraftCookieName = "onboarding_settings_draft";
const onboardingRestaurantIdCookieName = "onboarding_restaurant_id";

const settingsOnboardingCookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  path: "/onboarding",
  sameSite: "lax" as const,
};

const settingsPageLayoutClassName = "flex w-full max-w-5xl flex-col gap-12";
const settingsGridClassName = "grid grid-cols-1 gap-8 md:grid-cols-12";
const settingsSectionCardClassName = "rounded-[24px] bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(26,28,28,0.04)]";
const settingsSelectClassName = "w-full rounded-lg border-0 bg-surface-container-highest px-4 py-4 text-base text-on-surface transition-all focus:ring-1 focus:ring-primary";

const durationOptions = [60, 90, 120, 180] as const;
const bufferOptions = [0, 15, 30] as const;
const cancellationWindowOptions = [12, 24, 48, 72] as const;
const flowEffectBarHeights = ["40%", "60%", "90%", "50%", "75%"] as const;

//-aqui empieza funcion updateRestaurantSettingsOnboardingAction y es para guardar la configuracion operativa-//
/**
 * Guarda la configuración operativa del restaurante y avanza al siguiente paso.
 * @sideEffect
 */
async function updateRestaurantSettingsOnboardingAction(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const intent = String(formData.get("intent") ?? "continue").trim();

  const draftInput: SettingsOnboardingDraft = {
    restaurantId: String(formData.get("restaurantId") ?? "").trim(),
    reservationApprovalMode: String(formData.get("reservationApprovalMode") ?? "AUTO") as "AUTO" | "MANUAL",
    waitlistMode: String(formData.get("waitlistMode") ?? "MANUAL") as "MANUAL" | "AUTO",
    defaultReservationDurationMinutes: Number(formData.get("defaultReservationDurationMinutes") ?? 90),
    reservationBufferMinutes: Number(formData.get("reservationBufferMinutes") ?? 15),
    cancellationWindowHours: Number(formData.get("cancellationWindowHours") ?? 24),
    allowTableCombination: formData.get("allowTableCombination") === "on",
    enableAutoTableAssignment: formData.get("enableAutoTableAssignment") === "on",
  };

  cookieStore.set(settingsOnboardingDraftCookieName, serializeSettingsDraft(draftInput), settingsOnboardingCookieOptions);

  if (intent === "saveDraft") {
    redirect(`/onboarding/settings?restaurantId=${draftInput.restaurantId}&saved=draft`);
  }

  const parsedInput = settingsOnboardingSchema.safeParse({
    restaurantId: draftInput.restaurantId,
    reservationApprovalMode: draftInput.reservationApprovalMode,
    waitlistMode: draftInput.waitlistMode,
    defaultReservationDurationMinutes: draftInput.defaultReservationDurationMinutes,
    reservationBufferMinutes: draftInput.reservationBufferMinutes,
    cancellationWindowHours: draftInput.cancellationWindowHours,
    allowTableCombination: draftInput.allowTableCombination,
    enableAutoTableAssignment: draftInput.enableAutoTableAssignment,
  });

  if (!parsedInput.success) {
    redirect(`/onboarding/settings?restaurantId=${draftInput.restaurantId}&error=invalidForm`);
  }

  const catalogInfrastructure = getCatalogInfrastructure();
  const existingRestaurantSettings = await catalogInfrastructure.restaurantSettingsRepository.findByRestaurantId(parsedInput.data.restaurantId);

  if (existingRestaurantSettings === null) {
    const defaultRestaurantSettings = RestaurantSettings.create({
      id: randomUUID(),
      restaurantId: parsedInput.data.restaurantId,
      reservationApprovalMode: restaurantSettingsFormDefaults.reservationApprovalMode,
      waitlistMode: restaurantSettingsFormDefaults.waitlistMode,
      defaultReservationDurationMinutes: restaurantSettingsFormDefaults.defaultReservationDurationMinutes,
      reservationBufferMinutes: restaurantSettingsFormDefaults.reservationBufferMinutes,
      cancellationWindowHours: restaurantSettingsFormDefaults.cancellationWindowHours,
      allowTableCombination: restaurantSettingsFormDefaults.allowTableCombination,
      enableAutoTableAssignment: restaurantSettingsFormDefaults.enableAutoTableAssignment,
    });

    await catalogInfrastructure.restaurantSettingsRepository.save(defaultRestaurantSettings);
  }

  const updateRestaurantSettings = new UpdateRestaurantSettings(catalogInfrastructure.restaurantSettingsRepository);

  await updateRestaurantSettings.execute({
    restaurantId: parsedInput.data.restaurantId,
    reservationApprovalMode: parsedInput.data.reservationApprovalMode,
    waitlistMode: parsedInput.data.waitlistMode,
    defaultReservationDurationMinutes: parsedInput.data.defaultReservationDurationMinutes,
    reservationBufferMinutes: parsedInput.data.reservationBufferMinutes,
    cancellationWindowHours: parsedInput.data.cancellationWindowHours,
    allowTableCombination: parsedInput.data.allowTableCombination,
    enableAutoTableAssignment: parsedInput.data.enableAutoTableAssignment,
  });

  cookieStore.set(onboardingRestaurantIdCookieName, parsedInput.data.restaurantId, settingsOnboardingCookieOptions);

  redirect("/onboarding/tables");
}
//-aqui termina funcion updateRestaurantSettingsOnboardingAction y se va autilizar en el submit del onboarding-//

const restaurantSettingsFormDefaults = {
  reservationApprovalMode: "AUTO" as const,
  waitlistMode: "MANUAL" as const,
  defaultReservationDurationMinutes: 90,
  reservationBufferMinutes: 15,
  cancellationWindowHours: 24,
  allowTableCombination: true,
  enableAutoTableAssignment: true,
};

//-aqui empieza funcion serializeSettingsDraft y es para guardar el draft de settings en cookie-//
/**
 * Serializa el borrador de configuración operativa.
 * @pure
 */
function serializeSettingsDraft(draft: SettingsOnboardingDraft): string {
  return JSON.stringify(draft);
}
//-aqui termina funcion serializeSettingsDraft y se va autilizar en el server action-//

//-aqui empieza funcion parseSettingsDraftCookie y es para rehidratar el borrador de settings-//
/**
 * Parsea el borrador persistido en cookie para rehidratar el formulario.
 * @pure
 */
function parseSettingsDraftCookie(cookieValue: string | undefined): SettingsOnboardingDraft | null {
  if (cookieValue === undefined || cookieValue.trim().length === 0) {
    return null;
  }

  try {
    const parsedValue = settingsOnboardingDraftSchema.safeParse(JSON.parse(cookieValue));

    if (!parsedValue.success) {
      return null;
    }

    return parsedValue.data;
  } catch {
    return null;
  }
}
//-aqui termina funcion parseSettingsDraftCookie y se va autilizar en el render-//

//-aqui empieza funcion getSettingsInitialValues y es para resolver los valores iniciales del formulario-//
/**
 * Resuelve los valores iniciales del formulario usando DB, cookie de draft o defaults.
 * @pure
 */
function getSettingsInitialValues(
  persistedSettings:
    | {
        reservationApprovalMode: "AUTO" | "MANUAL";
        waitlistMode: "MANUAL" | "AUTO";
        defaultReservationDurationMinutes: number;
        reservationBufferMinutes: number;
        cancellationWindowHours: number;
        allowTableCombination: boolean;
        enableAutoTableAssignment: boolean;
      }
    | null,
  restaurantId: string,
  draft: SettingsOnboardingDraft | null,
): SettingsOnboardingDraft {
  if (persistedSettings !== null) {
    return {
      restaurantId,
      reservationApprovalMode: persistedSettings.reservationApprovalMode,
      waitlistMode: persistedSettings.waitlistMode,
      defaultReservationDurationMinutes: persistedSettings.defaultReservationDurationMinutes,
      reservationBufferMinutes: persistedSettings.reservationBufferMinutes,
      cancellationWindowHours: persistedSettings.cancellationWindowHours,
      allowTableCombination: persistedSettings.allowTableCombination,
      enableAutoTableAssignment: persistedSettings.enableAutoTableAssignment,
    };
  }

  if (draft !== null) {
    return {
      ...draft,
      restaurantId,
    };
  }

  return {
    restaurantId,
    reservationApprovalMode: restaurantSettingsFormDefaults.reservationApprovalMode,
    waitlistMode: restaurantSettingsFormDefaults.waitlistMode,
    defaultReservationDurationMinutes: restaurantSettingsFormDefaults.defaultReservationDurationMinutes,
    reservationBufferMinutes: restaurantSettingsFormDefaults.reservationBufferMinutes,
    cancellationWindowHours: restaurantSettingsFormDefaults.cancellationWindowHours,
    allowTableCombination: restaurantSettingsFormDefaults.allowTableCombination,
    enableAutoTableAssignment: restaurantSettingsFormDefaults.enableAutoTableAssignment,
  };
}
//-aqui termina funcion getSettingsInitialValues y se va autilizar en el render-//

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

//-aqui empieza componente SettingsSwitchRow y es para reutilizar filas con switches visuales en la pantalla operativa-//
interface SettingsSwitchRowProps {
  name: string;
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
function SettingsSwitchRow({ name, title, description, highlighted = false, defaultChecked = false }: SettingsSwitchRowProps) {
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
        <input className="peer sr-only" defaultChecked={defaultChecked} name={name} type="checkbox" />
        <span className="h-6 w-11 rounded-full bg-surface-container-highest transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white after:bg-white after:transition-transform after:content-[''] peer-checked:bg-secondary peer-checked:after:translate-x-full" />
      </label>
    </div>
  );
}
//-aqui termina componente SettingsSwitchRow-//

//-aqui empieza componente OperationalSettingsForm y es para montar la columna principal de configuraciones-//
function OperationalSettingsForm({ restaurantId, errorMessage, successMessage, initialValues }: OperationalSettingsFormProps) {
  return (
    <section className="space-y-10 md:col-span-8">
      <form action={updateRestaurantSettingsOnboardingAction} className="space-y-10" id={settingsOnboardingFormId}>
        <input name="restaurantId" type="hidden" value={restaurantId} />

        {errorMessage ? (
          <div className="rounded-2xl border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
            <T>{errorMessage}</T>
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
            <T>{successMessage}</T>
          </div>
        ) : null}

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
            <OnboardingField htmlFor="reservationApprovalMode" label="Modo de aprobación">
              <select
                className={settingsSelectClassName}
                defaultValue={initialValues.reservationApprovalMode}
                id="reservationApprovalMode"
                name="reservationApprovalMode"
              >
                <option value="AUTO">Auto</option>
                <option value="MANUAL">Manual</option>
              </select>
            </OnboardingField>

            <OnboardingField htmlFor="waitlistMode" label="Modo lista de espera">
              <select className={settingsSelectClassName} defaultValue={initialValues.waitlistMode} id="waitlistMode" name="waitlistMode">
                <option value="MANUAL">Manual</option>
                <option value="AUTO">Auto</option>
              </select>
            </OnboardingField>
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
            <OnboardingField htmlFor="defaultReservationDurationMinutes" label="Duración por defecto">
              <select
                className={`${settingsSelectClassName} appearance-none`}
                defaultValue={String(initialValues.defaultReservationDurationMinutes)}
                id="defaultReservationDurationMinutes"
                name="defaultReservationDurationMinutes"
              >
                {durationOptions.map((durationOption) => (
                  <option key={durationOption} value={durationOption}>
                    {durationOption} minutos
                  </option>
                ))}
              </select>
            </OnboardingField>

            <OnboardingField htmlFor="reservationBufferMinutes" label="Tiempo buffer">
              <select
                className={`${settingsSelectClassName} appearance-none`}
                defaultValue={String(initialValues.reservationBufferMinutes)}
                id="reservationBufferMinutes"
                name="reservationBufferMinutes"
              >
                {bufferOptions.map((bufferOption) => (
                  <option key={bufferOption} value={bufferOption}>
                    {bufferOption === 0 ? "Sin buffer" : `${bufferOption} minutos`}
                  </option>
                ))}
              </select>
            </OnboardingField>

            <OnboardingField className="sm:col-span-2" htmlFor="cancellationWindowHours" label="Ventana de cancelación">
              <select
                className={settingsSelectClassName}
                defaultValue={String(initialValues.cancellationWindowHours)}
                id="cancellationWindowHours"
                name="cancellationWindowHours"
              >
                {cancellationWindowOptions.map((cancellationWindowOption) => (
                  <option key={cancellationWindowOption} value={cancellationWindowOption}>
                    {cancellationWindowOption} horas
                  </option>
                ))}
              </select>
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
              defaultChecked={initialValues.allowTableCombination}
              description="Permite al sistema unir mesas cercanas cuando entren grupos grandes."
              highlighted
              name="allowTableCombination"
              title="Combinación de mesas"
            />

            <SettingsSwitchRow
              defaultChecked={initialValues.enableAutoTableAssignment}
              description="Activa la asignación automática para repartir mejor la ocupación de la sala."
              name="enableAutoTableAssignment"
              title="Asignación inteligente"
            />
          </div>
        </section>
      </form>
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
        <button className="rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-on-surface transition-colors hover:bg-surface-container-high" form={settingsOnboardingFormId} name="intent" type="submit" value="saveDraft">
          <T>Guardar borrador</T>
        </button>
        <button className="flex items-center gap-3 rounded-lg bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-on-primary transition-all hover:opacity-90" form={settingsOnboardingFormId} name="intent" type="submit" value="continue">
          <T>Continuar a mesas</T>
          <OnboardingIcon name="arrowForward" className="h-4 w-4" />
        </button>
      </div>
    </footer>
  );
}
//-aqui termina componente OperationalSettingsFooter-//

//-aqui empieza pagina SettingsOnboardingPage y es para montar el paso operativo del onboarding-//
/**
 * Presenta la pantalla de configuración operativa del restaurante.
 */
export default async function SettingsOnboardingPage({ searchParams }: SettingsOnboardingPageProps) {
  const cookieStore = await cookies();
  const resolvedSearchParams = await searchParams;
  const restaurantIdValue = resolvedSearchParams.restaurantId;
  const queryRestaurantId = Array.isArray(restaurantIdValue) ? restaurantIdValue[0] ?? "" : restaurantIdValue ?? "";
  const cookieRestaurantId = cookieStore.get(onboardingRestaurantIdCookieName)?.value ?? "";
  const restaurantId = queryRestaurantId.length > 0 ? queryRestaurantId : cookieRestaurantId;

  const errorValue = resolvedSearchParams.error;
  const errorKey = Array.isArray(errorValue) ? errorValue[0] ?? "" : errorValue ?? "";
  const errorMessage = errorKey === "invalidForm" ? "Revisa los campos de configuración. Hay datos que no son válidos." : undefined;
  const savedValue = resolvedSearchParams.saved;
  const savedKey = Array.isArray(savedValue) ? savedValue[0] ?? "" : savedValue ?? "";
  const successMessage = savedKey === "draft" ? "Borrador guardado. Puedes continuar más tarde sin perder esta configuración." : undefined;

  if (restaurantId.length === 0) {
    redirect("/onboarding/restaurant");
  }

  const draftCookieValue = cookieStore.get(settingsOnboardingDraftCookieName)?.value;
  const persistedDraft = parseSettingsDraftCookie(draftCookieValue);

  const currentStepKey = "settings" as const;
  const currentStepNumber = getOnboardingStepNumber(currentStepKey);
  const onboardingSteps = getOnboardingSteps(currentStepKey);

  const catalogInfrastructure = getCatalogInfrastructure();
  const persistedRestaurantSettings = await catalogInfrastructure.restaurantSettingsRepository.findByRestaurantId(restaurantId);
  const initialValues = getSettingsInitialValues(
    persistedRestaurantSettings === null ? null : persistedRestaurantSettings.toPrimitives(),
    restaurantId,
    persistedDraft,
  );

  return (
    <OnboardingShell
      currentStepNumber={currentStepNumber}
      mobilePrimaryAction={{ label: "Continuar", formId: settingsOnboardingFormId, icon: "arrowForward" }}
      mobileSecondaryAction={{ label: "Guardar borrador", formId: settingsOnboardingFormId, icon: "save", submitName: "intent", submitValue: "saveDraft" }}
      steps={onboardingSteps}
      title="Configuración operativa"
      totalSteps={ONBOARDING_TOTAL_STEPS}
    >
      <div className={settingsPageLayoutClassName}>
        <OperationalSettingsIntro />
        <div className={settingsGridClassName}>
          <OperationalSettingsForm errorMessage={errorMessage} initialValues={initialValues} restaurantId={restaurantId} successMessage={successMessage} />
          <FlowEffectPanel />
        </div>
        <OperationalSettingsFooter currentStepNumber={currentStepNumber} totalSteps={ONBOARDING_TOTAL_STEPS} />
      </div>
    </OnboardingShell>
  );
}
//-aqui termina pagina SettingsOnboardingPage-//

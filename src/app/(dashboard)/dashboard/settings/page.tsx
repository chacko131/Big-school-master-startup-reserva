/**
 * Archivo: page.tsx
 * Responsabilidad: Componer la vista operativa de configuración del restaurante dentro del dashboard.
 * Tipo: UI
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  SettingsRulesPanel,
  SettingsTeamPanel,
} from "@/components/dashboard/settings/SettingsSecondaryPanels";
import { SettingsProfilePanel } from "@/components/dashboard/settings/SettingsProfilePanel";
import { SettingsToolbar } from "@/components/dashboard/settings/SettingsToolbar";
import { RestaurantNotFoundError } from "@/modules/catalog/application/errors/restaurant-not-found.error";
import { RestaurantSettingsNotFoundError } from "@/modules/catalog/application/errors/restaurant-settings-not-found.error";
import { UpdateRestaurant } from "@/modules/catalog/application/use-cases/update-restaurant.use-case";
import { UpdateRestaurantSettings } from "@/modules/catalog/application/use-cases/update-restaurant-settings.use-case";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";

interface SettingsPageProps {
  searchParams: Promise<{
    profileError?: string | string[];
    profileSaved?: string | string[];
    rulesError?: string | string[];
    rulesSaved?: string | string[];
  }>;
}

interface RestaurantProfileFormValues {
  name: string;
  slug: string;
  timezone: string;
  email: string;
  phone: string;
}

interface RestaurantSettingsFormValues {
  reservationApprovalMode: "AUTO" | "MANUAL";
  waitlistMode: "MANUAL" | "AUTO";
  defaultReservationDurationMinutes: number;
  reservationBufferMinutes: number;
  cancellationWindowHours: number;
  allowTableCombination: boolean;
  enableAutoTableAssignment: boolean;
}

const onboardingRestaurantIdCookieName = "onboarding_restaurant_id";
const settingsProfileFormSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  timezone: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
});

const settingsRulesFormSchema = z.object({
  reservationApprovalMode: z.enum(["AUTO", "MANUAL"]),
  waitlistMode: z.enum(["MANUAL", "AUTO"]),
  defaultReservationDurationMinutes: z.coerce.number().int().min(1),
  reservationBufferMinutes: z.coerce.number().int().min(0),
  cancellationWindowHours: z.coerce.number().int().min(0),
  allowTableCombination: z.coerce.boolean(),
  enableAutoTableAssignment: z.coerce.boolean(),
});

//-aqui empieza funcion saveRestaurantProfileAction y es para persistir el perfil real del restaurante-//
/**
 * Guarda el perfil real del restaurante en la base de datos.
 * @sideEffect
 */
async function saveRestaurantProfileAction(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const restaurantId = cookieStore.get(onboardingRestaurantIdCookieName)?.value?.trim() ?? "";

  if (restaurantId.length === 0) {
    redirect("/onboarding/restaurant");
  }

  const draftInput = {
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    timezone: String(formData.get("timezone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
  };

  const parsedInput = settingsProfileFormSchema.safeParse(draftInput);

  if (!parsedInput.success) {
    redirect("/dashboard/settings?profileError=invalidProfile");
  }

  try {
    const catalogInfrastructure = getCatalogInfrastructure();
    const updateRestaurant = new UpdateRestaurant(catalogInfrastructure.restaurantRepository);

    await updateRestaurant.execute({
      id: restaurantId,
      name: parsedInput.data.name,
      slug: parsedInput.data.slug,
      timezone: parsedInput.data.timezone,
      email: parsedInput.data.email,
      phone: parsedInput.data.phone,
      isActive: true,
    });
  } catch (error) {
    if (error instanceof RestaurantNotFoundError) {
      redirect("/onboarding/restaurant");
    }

    if (isDuplicateRestaurantSlugError(error)) {
      redirect("/dashboard/settings?profileError=duplicateSlug");
    }

    throw error;
  }

  redirect("/dashboard/settings?profileSaved=profile");
}
//-aqui termina funcion saveRestaurantProfileAction y se va autilizar en el formulario de perfil-//

//-aqui empieza funcion saveRestaurantSettingsAction y es para persistir las reglas operativas-//
/**
 * Guarda la configuración operativa real del restaurante en la base de datos.
 * @sideEffect
 */
async function saveRestaurantSettingsAction(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const restaurantId = cookieStore.get(onboardingRestaurantIdCookieName)?.value?.trim() ?? "";

  if (restaurantId.length === 0) {
    redirect("/onboarding/restaurant");
  }

  const draftInput = {
    reservationApprovalMode: String(formData.get("reservationApprovalMode") ?? "AUTO") as "AUTO" | "MANUAL",
    waitlistMode: String(formData.get("waitlistMode") ?? "MANUAL") as "MANUAL" | "AUTO",
    defaultReservationDurationMinutes: Number(formData.get("defaultReservationDurationMinutes") ?? 90),
    reservationBufferMinutes: Number(formData.get("reservationBufferMinutes") ?? 15),
    cancellationWindowHours: Number(formData.get("cancellationWindowHours") ?? 24),
    allowTableCombination: formData.get("allowTableCombination") === "on",
    enableAutoTableAssignment: formData.get("enableAutoTableAssignment") === "on",
  };

  const parsedInput = settingsRulesFormSchema.safeParse(draftInput);

  if (!parsedInput.success) {
    redirect("/dashboard/settings?rulesError=invalidRules");
  }

  try {
    const catalogInfrastructure = getCatalogInfrastructure();
    const updateRestaurantSettings = new UpdateRestaurantSettings(catalogInfrastructure.restaurantSettingsRepository);

    await updateRestaurantSettings.execute({
      restaurantId,
      reservationApprovalMode: parsedInput.data.reservationApprovalMode,
      waitlistMode: parsedInput.data.waitlistMode,
      defaultReservationDurationMinutes: parsedInput.data.defaultReservationDurationMinutes,
      reservationBufferMinutes: parsedInput.data.reservationBufferMinutes,
      cancellationWindowHours: parsedInput.data.cancellationWindowHours,
      allowTableCombination: parsedInput.data.allowTableCombination,
      enableAutoTableAssignment: parsedInput.data.enableAutoTableAssignment,
    });
  } catch (error) {
    if (error instanceof RestaurantSettingsNotFoundError) {
      redirect(`/onboarding/settings?restaurantId=${restaurantId}`);
    }

    throw error;
  }

  redirect("/dashboard/settings?rulesSaved=settings");
}
//-aqui termina funcion saveRestaurantSettingsAction y se va autilizar en el formulario de reglas-//

//-aqui empieza funcion isDuplicateRestaurantSlugError y es para detectar slug repetido en Prisma-//
/**
 * Detecta si Prisma rechazó la actualización por un slug duplicado.
 * @pure
 */
function isDuplicateRestaurantSlugError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  if (!("code" in error) || (error as { code?: string }).code !== "P2002") {
    return false;
  }

  return true;
}
//-aqui termina funcion isDuplicateRestaurantSlugError y se va autilizar en el catch del formulario-//

//-aqui empieza pagina SettingsPage y es para mostrar la configuración del restaurante-//
/**
 * Presenta la vista de configuración operativa del restaurante.
 */
export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const cookieStore = await cookies();
  const resolvedSearchParams = await searchParams;
  const restaurantId = cookieStore.get(onboardingRestaurantIdCookieName)?.value?.trim() ?? "";

  if (restaurantId.length === 0) {
    redirect("/onboarding/restaurant");
  }

  const catalogInfrastructure = getCatalogInfrastructure();
  const persistedRestaurant = await catalogInfrastructure.restaurantRepository.findById(restaurantId);

  if (persistedRestaurant === null) {
    redirect("/onboarding/restaurant");
  }

  const persistedRestaurantSettings = await catalogInfrastructure.restaurantSettingsRepository.findByRestaurantId(restaurantId);

  if (persistedRestaurantSettings === null) {
    redirect(`/onboarding/settings?restaurantId=${restaurantId}`);
  }

  const persistedRestaurantSettingsPrimitives = persistedRestaurantSettings.toPrimitives();

  const profileErrorValue = resolvedSearchParams.profileError;
  const profileErrorKey = Array.isArray(profileErrorValue) ? profileErrorValue[0] ?? "" : profileErrorValue ?? "";
  const profileSavedValue = resolvedSearchParams.profileSaved;
  const profileSavedKey = Array.isArray(profileSavedValue) ? profileSavedValue[0] ?? "" : profileSavedValue ?? "";

  const rulesErrorValue = resolvedSearchParams.rulesError;
  const rulesErrorKey = Array.isArray(rulesErrorValue) ? rulesErrorValue[0] ?? "" : rulesErrorValue ?? "";
  const rulesSavedValue = resolvedSearchParams.rulesSaved;
  const rulesSavedKey = Array.isArray(rulesSavedValue) ? rulesSavedValue[0] ?? "" : rulesSavedValue ?? "";

  const errorMessage =
    profileErrorKey === "invalidProfile"
      ? "Revisa los campos del perfil. Hay datos que no son válidos."
      : profileErrorKey === "duplicateSlug"
        ? "Ya existe otro restaurante con ese slug. Usa uno diferente."
        : undefined;
  const successMessage = profileSavedKey === "profile" ? "Perfil guardado correctamente." : undefined;

  const rulesErrorMessage =
    rulesErrorKey === "invalidRules"
      ? "Revisa las reglas operativas. Hay datos que no son válidos."
      : undefined;
  const rulesSuccessMessage = rulesSavedKey === "settings" ? "Configuración operativa guardada correctamente." : undefined;

  const initialValues: RestaurantProfileFormValues = {
    name: persistedRestaurant.name,
    slug: persistedRestaurant.slug,
    timezone: persistedRestaurant.timezone,
    email: persistedRestaurant.email ?? "",
    phone: persistedRestaurant.phone ?? "",
  };

  const restaurantSettingsInitialValues: RestaurantSettingsFormValues = {
    reservationApprovalMode: persistedRestaurantSettingsPrimitives.reservationApprovalMode,
    waitlistMode: persistedRestaurantSettingsPrimitives.waitlistMode,
    defaultReservationDurationMinutes: persistedRestaurantSettingsPrimitives.defaultReservationDurationMinutes,
    reservationBufferMinutes: persistedRestaurantSettingsPrimitives.reservationBufferMinutes,
    cancellationWindowHours: persistedRestaurantSettingsPrimitives.cancellationWindowHours,
    allowTableCombination: persistedRestaurantSettingsPrimitives.allowTableCombination,
    enableAutoTableAssignment: persistedRestaurantSettingsPrimitives.enableAutoTableAssignment,
  };

  return (
    <>
      <SettingsToolbar />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-8">
          <SettingsProfilePanel errorMessage={errorMessage} initialValues={initialValues} saveAction={saveRestaurantProfileAction} successMessage={successMessage} />
          <SettingsRulesPanel errorMessage={rulesErrorMessage} initialValues={restaurantSettingsInitialValues} saveAction={saveRestaurantSettingsAction} successMessage={rulesSuccessMessage} />
          <SettingsTeamPanel />
        </div>
      </section>
    </>
  );
}
//-aqui termina pagina SettingsPage-//

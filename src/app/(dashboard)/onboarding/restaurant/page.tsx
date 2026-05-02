/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el primer paso hardcodeado del onboarding para capturar los datos base del restaurante.
 * Tipo: UI
 */

import { randomUUID } from "node:crypto";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { ONBOARDING_TOTAL_STEPS, getOnboardingStepNumber, getOnboardingSteps } from "@/constants/onboarding";
import { T } from "@/components/T";
import { OnboardingField } from "@/components/onboarding/OnboardingField";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { RestaurantHeroImagePicker } from "@/components/onboarding/RestaurantHeroImagePicker";
import { CreateRestaurant } from "@/modules/catalog/application/use-cases/create-restaurant.use-case";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { cloudinaryService } from "@/services/cloudinary.service";

const restaurantInputClassName = "w-full rounded-lg border-0 bg-surface-container-low px-4 py-4 text-base text-on-surface transition-all placeholder:text-outline focus:ring-1 focus:ring-primary";
const restaurantContentLayoutClassName = "flex w-full max-w-5xl flex-col items-start gap-12 md:flex-row md:gap-16";
const restaurantOnboardingFormId = "restaurant-onboarding-form";
/// ID compartido entre el picker (label) y el input (form) para vincularlos sin prop drilling
const restaurantHeroFileInputId = "restaurant-hero-image";

interface RestaurantOnboardingPageProps {
  searchParams: Promise<{ error?: string | string[] }>;
}

interface RestaurantProfileFormProps {
  errorMessage?: string;
  initialValues: RestaurantOnboardingDraft;
}

const restaurantTimezoneOptions = [
  "America/Santo_Domingo (GMT-04:00)",
  "America/Bogota (GMT-05:00)",
  "America/Mexico_City (GMT-06:00)",
  "Europe/Madrid (GMT+01:00)",
] as const;

const restaurantOnboardingSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  timezone: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
});

const restaurantOnboardingDraftSchema = z.object({
  name: z.string().trim(),
  slug: z.string().trim(),
  timezone: z.string().trim(),
  email: z.string().trim(),
  phone: z.string().trim(),
});

const restaurantOnboardingDraftCookieName = "onboarding_restaurant_draft";
const restaurantOnboardingRestaurantIdCookieName = "onboarding_restaurant_id";

const onboardingDraftCookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  sameSite: "lax" as const,
};

const restaurantFormMockValues: RestaurantOnboardingDraft = {
  name: "La Terraza Latina",
  slug: "la-terraza-latina",
  timezone: restaurantTimezoneOptions[0],
  email: "hola@laterraza.com",
  phone: "+34 600 123 456",
};

interface RestaurantOnboardingDraft {
  name: string;
  slug: string;
  timezone: string;
  email: string;
  phone: string;
}

const DEFAULT_HERO_IMAGE = {
  url: "https://res.cloudinary.com/dvfptzqig/image/upload/v1740941916/reserva-latina/mock-restaurant.jpg",
  publicId: "reserva-latina/mock-restaurant",
};

//-aqui empieza funcion createRestaurantOnboardingAction y es para crear el restaurante desde onboarding-//
/**
 * Crea el restaurante base del onboarding y avanza al paso operativo.
 * @sideEffect
 */
async function createRestaurantOnboardingAction(formData: FormData) {
  "use server";

  const cookieStore = await cookies();

  const draftInput: RestaurantOnboardingDraft = {
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    timezone: String(formData.get("timezone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
  };

  cookieStore.set(restaurantOnboardingDraftCookieName, serializeRestaurantDraft(draftInput), onboardingDraftCookieOptions);

  const parsedInput = restaurantOnboardingSchema.safeParse(draftInput);

  if (!parsedInput.success) {
    redirect("/onboarding/restaurant?error=invalidForm");
  }

  const persistedRestaurantId = cookieStore.get(restaurantOnboardingRestaurantIdCookieName)?.value;
  const restaurantId = persistedRestaurantId !== undefined && persistedRestaurantId.trim().length > 0 ? persistedRestaurantId : randomUUID();

  let heroImage = DEFAULT_HERO_IMAGE;
  const imageFile = formData.get("heroImage") as File | null;

  console.log("[Onboarding] Procesando imagen de portada...");

  if (imageFile && imageFile.size > 0) {
    console.log("[Onboarding] Imagen recibida:", {
      name: imageFile.name,
      type: imageFile.type,
      sizeKB: (imageFile.size / 1024).toFixed(2),
    });
    try {
      console.log("[Onboarding] Subiendo imagen a Cloudinary → carpeta: reserva-latina/restaurants");
      heroImage = await cloudinaryService.uploadImage(imageFile, "reserva-latina/restaurants");
      console.log("[Onboarding] ✅ Imagen subida con éxito:", {
        url: heroImage.url,
        publicId: heroImage.publicId,
      });
    } catch (error) {
      console.error("[Onboarding] ❌ Error al subir imagen a Cloudinary, usando imagen por defecto:", error);
    }
  } else {
    console.log("[Onboarding] No se seleccionó imagen — usando imagen por defecto:", DEFAULT_HERO_IMAGE.publicId);
  }

  console.log("[Onboarding] Creando restaurante en BD:", { id: restaurantId, slug: parsedInput.data.slug });

  try {
    const catalogInfrastructure = getCatalogInfrastructure();
    const createRestaurant = new CreateRestaurant(catalogInfrastructure.restaurantRepository);

    await createRestaurant.execute({
      id: restaurantId,
      name: parsedInput.data.name,
      slug: parsedInput.data.slug,
      timezone: parsedInput.data.timezone,
      email: parsedInput.data.email,
      phone: parsedInput.data.phone,
      isActive: true,
      heroImage,
    });

    console.log("[Onboarding] ✅ Restaurante guardado correctamente:", restaurantId);

    cookieStore.set(restaurantOnboardingRestaurantIdCookieName, restaurantId, onboardingDraftCookieOptions);
  } catch (error) {
    if (isDuplicateRestaurantSlugError(error)) {
      redirect("/onboarding/restaurant?error=duplicateSlug");
    }

    throw error;
  }

  redirect(`/onboarding/settings?restaurantId=${restaurantId}`);
}
//-aqui termina funcion createRestaurantOnboardingAction y se va autilizar en el submit del onboarding-//

//-aqui empieza funcion isDuplicateRestaurantSlugError y es para detectar slug repetido en Prisma-//
/**
 * Detecta si Prisma rechazó la creación por un slug duplicado.
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
//-aqui termina funcion isDuplicateRestaurantSlugError y se va autilizar en el catch del onboarding-//

//-aqui empieza funcion serializeRestaurantDraft y es para guardar el draft del restaurante en cookie-//
/**
 * Serializa el borrador del restaurante para persistirlo en una cookie.
 * @pure
 */
function serializeRestaurantDraft(draft: RestaurantOnboardingDraft): string {
  return JSON.stringify(draft);
}
//-aqui termina funcion serializeRestaurantDraft y se va autilizar en el server action-//

//-aqui empieza funcion parseRestaurantDraftCookie y es para rehidratar el borrador del restaurante-//
/**
 * Convierte el valor de cookie del draft en datos utilizables para el formulario.
 * @pure
 */
function parseRestaurantDraftCookie(cookieValue: string | undefined): RestaurantOnboardingDraft | null {
  if (cookieValue === undefined || cookieValue.trim().length === 0) {
    return null;
  }

  try {
    const parsedValue = restaurantOnboardingDraftSchema.safeParse(JSON.parse(cookieValue));

    if (!parsedValue.success) {
      return null;
    }

    return parsedValue.data;
  } catch {
    return null;
  }
}
//-aqui termina funcion parseRestaurantDraftCookie y se va autilizar en el render-//

//-aqui empieza funcion getRestaurantFormInitialValues y es para resolver el origen de los valores iniciales-//
/**
 * Resuelve los valores iniciales del formulario usando DB, cookie de draft o valores mock.
 * @pure
 */
function getRestaurantFormInitialValues(
  persistedRestaurant:
    | {
        name: string;
        slug: string;
        timezone: string;
        email: string | null;
        phone: string | null;
      }
    | null,
  draft: RestaurantOnboardingDraft | null,
): RestaurantOnboardingDraft {
  if (persistedRestaurant !== null) {
    return {
      name: persistedRestaurant.name,
      slug: persistedRestaurant.slug,
      timezone: persistedRestaurant.timezone,
      email: persistedRestaurant.email ?? restaurantFormMockValues.email,
      phone: persistedRestaurant.phone ?? restaurantFormMockValues.phone,
    };
  }

  if (draft !== null) {
    return draft;
  }

  return restaurantFormMockValues;
}
//-aqui termina funcion getRestaurantFormInitialValues y se va autilizar en el render-//

//-aqui empieza componente RestaurantHero y es para presentar el contexto visual del paso-//
/**
 * Renderiza el encabezado y delega el picker de imagen al Client Component.
 * La imagen actúa directamente como selector; el input real vive en el form.
 */
function RestaurantHero({ heroImageUrl }: { heroImageUrl?: string | null }) {
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

      <div className="hidden md:block">
        <RestaurantHeroImagePicker
          fileInputId={restaurantHeroFileInputId}
          formId={restaurantOnboardingFormId}
          initialImageUrl={heroImageUrl}
        />
      </div>
    </section>
  );
}
//-aqui termina componente RestaurantHero-//

//-aqui empieza componente RestaurantProfileForm y es para mostrar el formulario base del restaurante-//
function RestaurantProfileForm({ errorMessage, initialValues }: RestaurantProfileFormProps) {
  return (
    <section className="w-full rounded-[28px] bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(26,28,28,0.04)] md:w-3/5 md:p-10">
      <form action={createRestaurantOnboardingAction} className="space-y-8" id={restaurantOnboardingFormId}>
        {errorMessage ? (
          <div className="rounded-2xl border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
            <T>{errorMessage}</T>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <OnboardingField className="md:col-span-2" htmlFor="restaurant-name" label="Nombre del restaurante">
            <input
              className={restaurantInputClassName}
              defaultValue={initialValues.name}
              id="restaurant-name"
              name="name"
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
                defaultValue={initialValues.slug}
                id="restaurant-slug"
                name="slug"
                placeholder="la-terraza-latina"
                type="text"
              />
            </div>
          </OnboardingField>

          <OnboardingField htmlFor="restaurant-timezone" label="Zona horaria">
            <div className="relative">
              <select
                className={`${restaurantInputClassName} appearance-none pr-12`}
                defaultValue={initialValues.timezone}
                id="restaurant-timezone"
                name="timezone"
              >
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
              defaultValue={initialValues.email}
              id="restaurant-email"
              name="email"
              placeholder="hola@restaurante.com"
              type="email"
            />
          </OnboardingField>

          <OnboardingField className="md:col-span-2" htmlFor="restaurant-phone" label="Teléfono">
            <input
              className={restaurantInputClassName}
              defaultValue={initialValues.phone}
              id="restaurant-phone"
              name="phone"
              placeholder="+34 600 123 456"
              type="tel"
            />
          </OnboardingField>

        </div>

        <div className="hidden items-center justify-between border-t border-outline-variant/20 pt-8 md:flex">
          <button className="text-sm font-bold uppercase tracking-[0.22em] text-on-primary-container transition-colors hover:text-on-surface" type="button">
            <T>Guardar borrador</T>
          </button>
          <button className="flex items-center gap-3 rounded-lg bg-primary px-10 py-4 text-sm font-bold uppercase tracking-[0.22em] text-on-primary transition-all hover:opacity-90" type="submit">
            <T>Continuar</T>
            <OnboardingIcon name="arrowForward" className="h-4 w-4" />
          </button>
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
export default async function RestaurantOnboardingPage({ searchParams }: RestaurantOnboardingPageProps) {
  const cookieStore = await cookies();
  const resolvedSearchParams = await searchParams;
  const errorValue = resolvedSearchParams.error;
  const errorKey = Array.isArray(errorValue) ? errorValue[0] ?? "" : errorValue ?? "";
  const errorMessage =
    errorKey === "duplicateSlug"
      ? "Ya existe un restaurante con ese nombre público. Cambia el slug para continuar."
      : errorKey === "invalidForm"
        ? "Revisa los campos del formulario. Hay datos que no son válidos."
        : undefined;

  const persistedRestaurantId = cookieStore.get(restaurantOnboardingRestaurantIdCookieName)?.value;
  const draftCookieValue = cookieStore.get(restaurantOnboardingDraftCookieName)?.value;
  const persistedDraft = parseRestaurantDraftCookie(draftCookieValue);

  const catalogInfrastructure = getCatalogInfrastructure();
  const persistedRestaurant =
    persistedRestaurantId === undefined
      ? null
      : await catalogInfrastructure.restaurantRepository.findById(persistedRestaurantId);

  const initialValues = getRestaurantFormInitialValues(persistedRestaurant === null ? null : persistedRestaurant.toPrimitives(), persistedDraft);

  // URL de la imagen ya guardada en BD — null si el restaurante no existe aún o no tiene foto
  const persistedHeroImageUrl = persistedRestaurant?.toPrimitives().heroImage?.url ?? null;

  const currentStepKey = "restaurant" as const;
  const currentStepNumber = getOnboardingStepNumber(currentStepKey);
  const onboardingSteps = getOnboardingSteps(currentStepKey);

  return (
    <OnboardingShell
      currentStepNumber={currentStepNumber}
      mobilePrimaryAction={{ label: "Continuar", formId: restaurantOnboardingFormId, icon: "arrowForward" }}
      mobileSecondaryAction={{ label: "Guardar borrador", icon: "save" }}
      steps={onboardingSteps}
      title="Perfil del restaurante"
      totalSteps={ONBOARDING_TOTAL_STEPS}
    >
      <div className={restaurantContentLayoutClassName}>
        <RestaurantHero heroImageUrl={persistedHeroImageUrl} />
        <RestaurantProfileForm errorMessage={errorMessage} initialValues={initialValues} />
      </div>
      <RestaurantMobileQuote />
    </OnboardingShell>
  );
}
//-aqui termina pagina RestaurantOnboardingPage-//

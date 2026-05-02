/**
 * Archivo: page.tsx
 * Responsabilidad: Componer la vista operativa de configuración del restaurante dentro del dashboard.
 * Tipo: UI
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import { SettingsCatalogPanel } from "@/components/dashboard/settings/SettingsCatalogPanel";
import {
  SettingsRulesPanel,
  SettingsTeamPanel,
} from "@/components/dashboard/settings/SettingsSecondaryPanels";
import { SettingsProfilePanel } from "@/components/dashboard/settings/SettingsProfilePanel";
import { SettingsToolbar } from "@/components/dashboard/settings/SettingsToolbar";
import { RestaurantNotFoundError } from "@/modules/catalog/application/errors/restaurant-not-found.error";
import { RestaurantSettingsNotFoundError } from "@/modules/catalog/application/errors/restaurant-settings-not-found.error";
import { UpdateRestaurant } from "@/modules/catalog/application/use-cases/update-restaurant.use-case";
import { UpdateRestaurantProfile } from "@/modules/catalog/application/use-cases/update-restaurant-profile.use-case";
import { UpdateRestaurantSettings } from "@/modules/catalog/application/use-cases/update-restaurant-settings.use-case";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { type PriceRange, type RestaurantImage } from "@/modules/catalog/domain/entities/restaurant.entity";
import {
  SettingsPhotosPanel,
  type PhotoUrlsPayload,
} from "@/components/dashboard/settings/SettingsPhotosPanel";
import { type CloudinaryUploadSignature } from "@/lib/cloudinary-client-upload.lib";
import { cloudinaryService } from "@/services/cloudinary.service";

interface SettingsPageProps {
  searchParams: Promise<{
    profileError?: string | string[];
    profileSaved?: string | string[];
    catalogError?: string | string[];
    catalogSaved?: string | string[];
    photosError?: string | string[];
    photosSaved?: string | string[];
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

interface CatalogProfileFormValues {
  description: string | null;
  address: string | null;
  city: string | null;
  countryCode: string | null;
  cuisine: string | null;
  priceRange: PriceRange | null;
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

// Esquema Zod para los campos del perfil público (catálogo).
// Todos opcionales: se aplica solo lo que el usuario envía.
const settingsCatalogFormSchema = z.object({
  description: z.string().trim().max(1200).nullable().optional(),
  address: z.string().trim().max(300).nullable().optional(),
  city: z.string().trim().max(100).nullable().optional(),
  countryCode: z.string().trim().length(2).toUpperCase().nullable().optional(),
  cuisine: z.string().trim().max(60).nullable().optional(),
  priceRange: z.enum(["BUDGET", "MODERATE", "UPSCALE", "FINE_DINING"]).nullable().optional(),
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

//-aqui empieza funcion saveCatalogProfileAction y es para persistir el perfil publico del restaurante-//
/**
 * Persiste los campos del catálogo público: descripción, dirección, cocina, precio.
 * Delega la persistencia en UpdateRestaurantProfile que recibe URLs ya resueltas.
 * @sideEffect
 */
async function saveCatalogProfileAction(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const restaurantId = cookieStore.get(onboardingRestaurantIdCookieName)?.value?.trim() ?? "";

  if (restaurantId.length === 0) {
    redirect("/onboarding/restaurant");
  }

  // Normaliza cadenas vacías a null para no guardar strings vacíos en BD
  const normalize = (val: FormDataEntryValue | null): string | null => {
    const str = typeof val === "string" ? val.trim() : "";
    return str.length > 0 ? str : null;
  };

  const rawPriceRange = normalize(formData.get("priceRange"));

  const draftInput = {
    description: normalize(formData.get("description")),
    address: normalize(formData.get("address")),
    city: normalize(formData.get("city")),
    countryCode: normalize(formData.get("countryCode")),
    cuisine: normalize(formData.get("cuisine")),
    priceRange: rawPriceRange ?? undefined,
  };

  const parsedInput = settingsCatalogFormSchema.safeParse(draftInput);

  if (!parsedInput.success) {
    console.error("[Settings] Catálogo inválido:", parsedInput.error.flatten());
    redirect("/dashboard/settings?catalogError=invalidCatalog");
  }

  try {
    console.log("[Settings] Intentando guardar perfil público para:", restaurantId);
    console.log("[Settings] Datos a persistir:", JSON.stringify(parsedInput.data, null, 2));

    const catalogInfrastructure = getCatalogInfrastructure();
    const updateRestaurantProfile = new UpdateRestaurantProfile(catalogInfrastructure.restaurantRepository);

    await updateRestaurantProfile.execute({
      restaurantId,
      ...parsedInput.data,
    });

    console.log("[Settings] ✅ Perfil público guardado con éxito en BD");
  } catch (error) {
    if (error instanceof RestaurantNotFoundError) {
      redirect("/onboarding/restaurant");
    }
    throw error;
  }

  redirect("/dashboard/settings?catalogSaved=catalog");
}
//-aqui termina funcion saveCatalogProfileAction y se va autilizar en el formulario de catalogo-//

//-aqui empieza funcion generateCloudinarySignatureAction y es para devolver al cliente una firma segura de subida-//
/**
 * Genera una firma de subida firmada para Cloudinary.
 * El cliente usa esta firma para subir archivos DIRECTAMENTE a Cloudinary sin
 * pasar los binarios por el servidor de Next.js.
 * El API secret nunca abandona el servidor.
 * @sideEffect — accede a config del entorno
 */
async function generateCloudinarySignatureAction(
  folder: string
): Promise<CloudinaryUploadSignature> {
  "use server";

  // Verificamos sesión antes de emitir la firma
  const cookieStore = await cookies();
  const restaurantId = cookieStore.get(onboardingRestaurantIdCookieName)?.value?.trim() ?? "";
  if (restaurantId.length === 0) {
    throw new Error("[Signature] No hay sesión activa de restaurante");
  }

  // Configura el SDK (usa CLOUDINARY_URL del entorno automáticamente)
  cloudinary.config({ secure: true });
  const cfg = cloudinary.config();

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { folder, timestamp };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cfg.api_secret as string
  );

  console.log("[Signature] Firma generada para folder:", folder);

  return {
    signature,
    timestamp,
    apiKey: cfg.api_key as string,
    cloudName: cfg.cloud_name as string,
    folder,
  };
}
//-aqui termina funcion generateCloudinarySignatureAction-//

//-aqui empieza funcion savePhotoUrlsAction y es para persistir las URLs de imágenes ya subidas a Cloudinary-//
/**
 * Recibe SOLO URLs/publicIds (no archivos binarios) y actualiza la BD.
 * Los archivos ya fueron subidos directamente a Cloudinary desde el cliente.
 * También elimina de Cloudinary las imágenes marcadas para borrar.
 *
 * IMPORTANTE: Este server action NO usa redirect() porque se invoca
 * programáticamente (await) desde el cliente. Si usáramos redirect(), Next.js
 * lanzaría un error NEXT_REDIRECT que el catch del cliente interpretaría como
 * un fallo. El cliente se encarga de la navegación tras el éxito.
 * @sideEffect
 */
async function savePhotoUrlsAction(payload: PhotoUrlsPayload): Promise<void> {
  "use server";

  const MAX_GALLERY_SERVER = 6;

  const cookieStore = await cookies();
  const restaurantId = cookieStore.get(onboardingRestaurantIdCookieName)?.value?.trim() ?? "";

  if (restaurantId.length === 0) {
    throw new Error("[Photos] No hay sesión activa de restaurante");
  }

  console.log("[Photos] Persistiendo URLs para restaurantId:", restaurantId);
  console.log("[Photos] Payload recibido:", JSON.stringify(payload, null, 2));

  const catalogInfrastructure = getCatalogInfrastructure();
  const updateRestaurantProfile = new UpdateRestaurantProfile(catalogInfrastructure.restaurantRepository);

  // Cargamos el restaurante actual para calcular la galería resultante
  const restaurant = await catalogInfrastructure.restaurantRepository.findById(restaurantId);
  if (restaurant === null) {
    throw new Error("[Photos] Restaurante no encontrado");
  }

  // Eliminamos de Cloudinary las imágenes marcadas para borrar
  for (const pid of payload.removedGalleryIds) {
    const ok = await cloudinaryService.deleteImage(pid);
    console.log(`[Photos] Cloudinary delete ${pid}:`, ok ? "✅" : "⚠️ no encontrado");
  }

  // Galería final = existentes conservadas + nuevas subidas por el cliente
  const keptImages = restaurant.galleryImages.filter(
    (img) => !payload.removedGalleryIds.includes(img.publicId)
  );
  const finalGallery: RestaurantImage[] = [
    ...keptImages,
    ...payload.newGalleryImages,
  ].slice(0, MAX_GALLERY_SERVER);

  console.log("[Photos] Galería final:", finalGallery.length, "imágenes (max:", MAX_GALLERY_SERVER, ")");

  const patch: { heroImage?: RestaurantImage | null; galleryImages?: RestaurantImage[] } = {
    galleryImages: finalGallery,
  };

  if (payload.heroImage !== undefined) {
    patch.heroImage = payload.heroImage;
    console.log("[Photos] Hero actualizada:", payload.heroImage?.url ?? "null");
  }

  await updateRestaurantProfile.execute({ restaurantId, ...patch });
  console.log("[Photos] ✅ URLs persistidas correctamente en BD");

  // Invalidamos la caché para que la página refleje los cambios al navegar
  revalidatePath("/dashboard/settings");
}
//-aqui termina funcion savePhotoUrlsAction-//

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

  const persistedPrimitives = persistedRestaurant.toPrimitives();

  const profileErrorValue = resolvedSearchParams.profileError;
  const profileErrorKey = Array.isArray(profileErrorValue) ? profileErrorValue[0] ?? "" : profileErrorValue ?? "";
  const profileSavedValue = resolvedSearchParams.profileSaved;
  const profileSavedKey = Array.isArray(profileSavedValue) ? profileSavedValue[0] ?? "" : profileSavedValue ?? "";

  const catalogErrorValue = resolvedSearchParams.catalogError;
  const catalogErrorKey = Array.isArray(catalogErrorValue) ? catalogErrorValue[0] ?? "" : catalogErrorValue ?? "";
  const catalogSavedValue = resolvedSearchParams.catalogSaved;
  const catalogSavedKey = Array.isArray(catalogSavedValue) ? catalogSavedValue[0] ?? "" : catalogSavedValue ?? "";

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

  const catalogErrorMessage =
    catalogErrorKey === "invalidCatalog"
      ? "Revisa los campos del perfil público. Hay datos que no son válidos."
      : undefined;
  const catalogSuccessMessage =
    catalogSavedKey === "catalog" ? "Perfil público guardado correctamente." : undefined;

  const rulesErrorMessage =
    rulesErrorKey === "invalidRules"
      ? "Revisa las reglas operativas. Hay datos que no son válidos."
      : undefined;
  const rulesSuccessMessage = rulesSavedKey === "settings" ? "Configuración operativa guardada correctamente." : undefined;

  const photosErrorValue = resolvedSearchParams.photosError;
  const photosErrorKey = Array.isArray(photosErrorValue) ? photosErrorValue[0] ?? "" : photosErrorValue ?? "";
  const photosSavedValue = resolvedSearchParams.photosSaved;
  const photosSavedKey = Array.isArray(photosSavedValue) ? photosSavedValue[0] ?? "" : photosSavedValue ?? "";

  const photosErrorMessage =
    photosErrorKey === "uploadFailed"
      ? "Hubo un error al subir las fotos. Inténtalo de nuevo."
      : undefined;
  const photosSuccessMessage =
    photosSavedKey === "photos" ? "Fotos actualizadas correctamente." : undefined;

  const initialValues: RestaurantProfileFormValues = {
    name: persistedPrimitives.name,
    slug: persistedPrimitives.slug,
    timezone: persistedPrimitives.timezone,
    email: persistedPrimitives.email ?? "",
    phone: persistedPrimitives.phone ?? "",
  };

  const catalogInitialValues: CatalogProfileFormValues = {
    description: persistedPrimitives.description,
    address: persistedPrimitives.address,
    city: persistedPrimitives.city,
    countryCode: persistedPrimitives.countryCode,
    cuisine: persistedPrimitives.cuisine,
    priceRange: persistedPrimitives.priceRange,
  };

  const photosInitialValues = {
    heroImage: persistedPrimitives.heroImage,
    galleryImages: persistedPrimitives.galleryImages,
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
          <SettingsCatalogPanel
            errorMessage={catalogErrorMessage}
            initialValues={catalogInitialValues}
            saveAction={saveCatalogProfileAction}
            successMessage={catalogSuccessMessage}
          />
          <SettingsPhotosPanel
            errorMessage={photosErrorMessage}
            generateSignatureAction={generateCloudinarySignatureAction}
            initialValues={photosInitialValues}
            savePhotoUrlsAction={savePhotoUrlsAction}
            successMessage={photosSuccessMessage}
          />
          <SettingsRulesPanel errorMessage={rulesErrorMessage} initialValues={restaurantSettingsInitialValues} saveAction={saveRestaurantSettingsAction} successMessage={rulesSuccessMessage} />
          <SettingsTeamPanel />
        </div>
      </section>
    </>
  );
}
//-aqui termina pagina SettingsPage-//

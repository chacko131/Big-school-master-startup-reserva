/**
 * Archivo: SettingsCatalogPanel.tsx
 * Responsabilidad: Renderizar el formulario de perfil público del restaurante
 *                  (descripción, dirección, cocina, rango de precio).
 *                  Delega la persistencia al Server Action recibido por prop.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { NotificationBanner } from "@/components/ui/NotificationBanner";
import { type PriceRange } from "@/modules/catalog/domain/entities/restaurant.entity";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface CatalogProfileInitialValues {
  description: string | null;
  address: string | null;
  city: string | null;
  countryCode: string | null;
  cuisine: string | null;
  priceRange: PriceRange | null;
}

interface SettingsCatalogPanelProps {
  initialValues: CatalogProfileInitialValues;
  errorMessage?: string;
  successMessage?: string;
  saveAction: (formData: FormData) => Promise<void>;
}

// ─── Opciones estáticas ───────────────────────────────────────────────────────

const CUISINE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "Mediterranean", label: "Mediterránea" },
  { value: "Italian", label: "Italiana" },
  { value: "Spanish", label: "Española" },
  { value: "Japanese", label: "Japonesa" },
  { value: "Mexican", label: "Mexicana" },
  { value: "American", label: "Americana" },
  { value: "French", label: "Francesa" },
  { value: "Chinese", label: "China" },
  { value: "Indian", label: "India" },
  { value: "Thai", label: "Tailandesa" },
  { value: "Fusion", label: "Fusión" },
  { value: "Seafood", label: "Mariscos" },
  { value: "Steakhouse", label: "Carnes" },
  { value: "Vegetarian", label: "Vegetariana / Vegana" },
  { value: "Other", label: "Otro" },
];

const PRICE_RANGE_OPTIONS: ReadonlyArray<{ value: PriceRange; label: string; description: string }> = [
  { value: "BUDGET", label: "€", description: "Menos de 15 € por persona" },
  { value: "MODERATE", label: "€€", description: "15 – 35 € por persona" },
  { value: "UPSCALE", label: "€€€", description: "35 – 60 € por persona" },
  { value: "FINE_DINING", label: "€€€€", description: "Más de 60 € por persona" },
];

const COUNTRY_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "DO", label: "República Dominicana" },
  { value: "CO", label: "Colombia" },
  { value: "MX", label: "México" },
  { value: "ES", label: "España" },
  { value: "US", label: "Estados Unidos" },
  { value: "PA", label: "Panamá" },
  { value: "VE", label: "Venezuela" },
  { value: "PE", label: "Perú" },
  { value: "AR", label: "Argentina" },
  { value: "CL", label: "Chile" },
];

// ─── Clases reutilizables ─────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface outline-none ring-1 ring-transparent transition-all focus:ring-primary placeholder:font-normal placeholder:text-outline";

const selectContainerCls =
  "rounded-lg bg-surface-container-low px-4 py-3 ring-1 ring-transparent transition-all focus-within:ring-primary";

const labelHeadingCls =
  "block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant";

const helpTextCls = "text-xs leading-6 text-on-surface-variant";

// ─── Componente ───────────────────────────────────────────────────────────────

//-aqui empieza componente SettingsCatalogPanel y es para gestionar el perfil público del restaurante-//
/**
 * Formulario que permite al propietario actualizar el perfil público del restaurante:
 * descripción, dirección, ciudad, país, tipo de cocina y rango de precio.
 *
 * @pure (sin estado interno — Server Component)
 */
export function SettingsCatalogPanel({
  initialValues,
  errorMessage,
  successMessage,
  saveAction,
}: SettingsCatalogPanelProps) {
  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-sm">
      {/* ─── Cabecera ─────────────────────────────────────────────────── */}
      <div className="border-b border-outline-variant/10 p-8">
        <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
          <T>Perfil público del restaurante</T>
        </h3>
        <p className="mt-1 text-sm text-on-surface-variant">
          <T>
            Esta información se muestra a tus clientes en la página pública de reservas.
            Cuanto más completo, mejor primera impresión.
          </T>
        </p>
      </div>

      {/* ─── Formulario ───────────────────────────────────────────────── */}
      <form action={saveAction} className="space-y-8 p-8">
        {errorMessage ? (
          <NotificationBanner
            key={`catalog-error-${errorMessage}`}
            description={errorMessage}
            tone="error"
            title="No pudimos guardar el perfil público"
          />
        ) : null}

        {successMessage ? (
          <NotificationBanner
            key={`catalog-success-${successMessage}`}
            description={successMessage}
            tone="success"
            title="Perfil público actualizado"
          />
        ) : null}

        {/* ─── Grid principal ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Descripción — ocupa las 2 columnas */}
          <label className="space-y-2 lg:col-span-2" htmlFor="catalog-description">
            <span className={labelHeadingCls}>
              <T>Descripción del restaurante</T>
            </span>
            <textarea
              className={`${inputCls} min-h-[120px] resize-y`}
              defaultValue={initialValues.description ?? ""}
              id="catalog-description"
              name="description"
              placeholder="Describe la experiencia que ofrece tu restaurante..."
              rows={4}
            />
            <p className={helpTextCls}>
              <T>Visible en la página pública. Usa un tono cercano y atractivo.</T>
            </p>
          </label>

          {/* Dirección */}
          <label className="space-y-2" htmlFor="catalog-address">
            <span className={labelHeadingCls}>
              <T>Dirección</T>
            </span>
            <input
              className={inputCls}
              defaultValue={initialValues.address ?? ""}
              id="catalog-address"
              name="address"
              placeholder="Calle, número, referencias..."
              type="text"
            />
            <p className={helpTextCls}>
              <T>Se muestra en la ficha pública y en los emails de confirmación.</T>
            </p>
          </label>

          {/* Ciudad */}
          <label className="space-y-2" htmlFor="catalog-city">
            <span className={labelHeadingCls}>
              <T>Ciudad</T>
            </span>
            <input
              className={inputCls}
              defaultValue={initialValues.city ?? ""}
              id="catalog-city"
              name="city"
              placeholder="Ej: Santo Domingo, Madrid..."
              type="text"
            />
            <p className={helpTextCls}>
              <T>Ayuda a los clientes a localizarte en el buscador.</T>
            </p>
          </label>

          {/* País */}
          <label className="space-y-2" htmlFor="catalog-country">
            <span className={labelHeadingCls}>
              <T>País</T>
            </span>
            <div className={selectContainerCls}>
              <select
                className="w-full border-0 bg-transparent text-sm font-semibold text-on-surface outline-none"
                defaultValue={initialValues.countryCode ?? ""}
                id="catalog-country"
                name="countryCode"
              >
                <option value="">— Selecciona un país —</option>
                {COUNTRY_OPTIONS.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
            <p className={helpTextCls}>
              <T>Código ISO del país donde opera el restaurante.</T>
            </p>
          </label>

          {/* Tipo de cocina */}
          <label className="space-y-2" htmlFor="catalog-cuisine">
            <span className={labelHeadingCls}>
              <T>Tipo de cocina</T>
            </span>
            <div className={selectContainerCls}>
              <select
                className="w-full border-0 bg-transparent text-sm font-semibold text-on-surface outline-none"
                defaultValue={initialValues.cuisine ?? ""}
                id="catalog-cuisine"
                name="cuisine"
              >
                <option value="">— Selecciona un estilo —</option>
                {CUISINE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <p className={helpTextCls}>
              <T>El estilo culinario que mejor te define.</T>
            </p>
          </label>
        </div>

        {/* ─── Rango de precio ───────────────────────────────────────── */}
        <div className="space-y-3">
          <span className={labelHeadingCls}>
            <T>Rango de precio</T>
          </span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PRICE_RANGE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="group relative cursor-pointer"
                htmlFor={`price-range-${option.value}`}
              >
                <input
                  className="peer sr-only"
                  defaultChecked={initialValues.priceRange === option.value}
                  id={`price-range-${option.value}`}
                  name="priceRange"
                  type="radio"
                  value={option.value}
                />
                <div className="flex flex-col gap-1 rounded-xl border-2 border-outline-variant/30 bg-surface-container-low p-4 text-center transition-all peer-checked:border-primary peer-checked:bg-primary/5 group-hover:border-primary/40">
                  <span className="text-2xl font-black text-primary">{option.label}</span>
                  <span className="text-[11px] leading-tight text-on-surface-variant">
                    {option.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
          <p className={helpTextCls}>
            <T>Orienta las expectativas del cliente antes de reservar.</T>
          </p>
        </div>

        {/* ─── Acción ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-colors hover:opacity-90"
            type="submit"
          >
            <OnboardingIcon name="save" className="h-4 w-4" />
            <T>Guardar perfil público</T>
          </button>
        </div>
      </form>
    </section>
  );
}
//-aqui termina componente SettingsCatalogPanel-//

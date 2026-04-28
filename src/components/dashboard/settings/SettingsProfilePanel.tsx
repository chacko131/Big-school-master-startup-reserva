/**
 * Archivo: SettingsProfilePanel.tsx
 * Responsabilidad: Renderizar y guardar el perfil real del restaurante dentro del dashboard.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { NotificationBanner } from "@/components/ui/NotificationBanner";

interface RestaurantProfileInitialValues {
  name: string;
  slug: string;
  timezone: string;
  email: string;
  phone: string;
}

interface SettingsProfilePanelProps {
  initialValues: RestaurantProfileInitialValues;
  errorMessage?: string;
  successMessage?: string;
  saveAction: (formData: FormData) => Promise<void>;
}

const restaurantTimezoneOptions: ReadonlyArray<{ value: string; label: string }> = [
  { value: "America/Santo_Domingo", label: "America/Santo_Domingo (GMT-04:00)" },
  { value: "America/Bogota", label: "America/Bogota (GMT-05:00)" },
  { value: "America/Mexico_City", label: "America/Mexico_City (GMT-06:00)" },
  { value: "Europe/Madrid", label: "Europe/Madrid (GMT+01:00)" },
];

const settingsProfileInputClassName = "w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface outline-none ring-1 ring-transparent transition-all focus:ring-primary";

//-aqui empieza componente SettingsProfilePanel y es para mostrar y guardar el perfil real del restaurante-//
/**
 * Renderiza el formulario de datos base del restaurante usando datos reales.
 *
 * @pure
 */
export function SettingsProfilePanel({ initialValues, errorMessage, successMessage, saveAction }: SettingsProfilePanelProps) {
  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-sm">
      <div className="border-b border-outline-variant/10 p-8">
        <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
          <T>Perfil del restaurante</T>
        </h3>
        <p className="mt-1 text-sm text-on-surface-variant">
          <T>Mantén sincronizados el nombre, contacto y zona horaria del negocio.</T>
        </p>
      </div>

      <form action={saveAction} className="space-y-8 p-8">
        {errorMessage ? <NotificationBanner key={`profile-error-${errorMessage}`} description={errorMessage} tone="error" title="No pudimos guardar el perfil" /> : null}

        {successMessage ? <NotificationBanner key={`profile-success-${successMessage}`} description={successMessage} tone="success" title="Perfil actualizado" /> : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <label className="space-y-2" htmlFor="restaurant-name">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Nombre del restaurante</T>
            </span>
            <input className={settingsProfileInputClassName} defaultValue={initialValues.name} id="restaurant-name" name="name" type="text" />
            <p className="text-xs leading-6 text-on-surface-variant">
              <T>Visible para el equipo y las reservas públicas.</T>
            </p>
          </label>

          <label className="space-y-2" htmlFor="restaurant-slug">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Slug público</T>
            </span>
            <input className={settingsProfileInputClassName} defaultValue={initialValues.slug} id="restaurant-slug" name="slug" type="text" />
            <p className="text-xs leading-6 text-on-surface-variant">
              <T>Se usa en enlaces y rutas compartidas.</T>
            </p>
          </label>

          <label className="space-y-2" htmlFor="restaurant-timezone">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Zona horaria</T>
            </span>
            <div className="rounded-lg bg-surface-container-low px-4 py-3 ring-1 ring-transparent transition-all focus-within:ring-primary">
              <select className="w-full border-0 bg-transparent text-sm font-semibold text-on-surface outline-none" defaultValue={initialValues.timezone} id="restaurant-timezone" name="timezone">
                {restaurantTimezoneOptions.map((timezoneOption) => (
                  <option key={timezoneOption.value} value={timezoneOption.value}>
                    {timezoneOption.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs leading-6 text-on-surface-variant">
              <T>Sincroniza horarios de reservas y cobros.</T>
            </p>
          </label>

          <label className="space-y-2" htmlFor="restaurant-phone">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Teléfono</T>
            </span>
            <input className={settingsProfileInputClassName} defaultValue={initialValues.phone} id="restaurant-phone" name="phone" type="tel" />
            <p className="text-xs leading-6 text-on-surface-variant">
              <T>Contacto visible para confirmaciones.</T>
            </p>
          </label>

          <label className="space-y-2 lg:col-span-2" htmlFor="restaurant-email">
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              <T>Email administrativo</T>
            </span>
            <input className={settingsProfileInputClassName} defaultValue={initialValues.email} id="restaurant-email" name="email" type="email" />
            <p className="text-xs leading-6 text-on-surface-variant">
              <T>Notificaciones de sistema y facturación.</T>
            </p>
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-colors hover:opacity-90" type="submit">
            <OnboardingIcon name="save" className="h-4 w-4" />
            <T>Guardar cambios</T>
          </button>
        </div>
      </form>
    </section>
  );
}
//-aqui termina componente SettingsProfilePanel-//

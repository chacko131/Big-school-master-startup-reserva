/**
 * Archivo: SettingsToolbar.tsx
 * Responsabilidad: Renderizar la cabecera editorial de la vista operativa de configuración.
 * Tipo: UI
 */

import { T } from "@/components/T";

//-aqui empieza componente SettingsToolbar y es para resumir la vista de configuracion-//
/**
 * Renderiza la cabecera operativa de la vista de configuración.
 *
 * @pure
 */
export function SettingsToolbar() {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] bg-surface-container-lowest p-8 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          <T>Configuración del restaurante</T>
        </p>
        <h2 className="mt-4 text-5xl font-black tracking-tighter text-primary md:text-6xl">
          <T>Ajusta perfil, reglas y acceso del equipo.</T>
        </h2>
        <p className="mt-4 max-w-xl text-on-surface-variant md:text-lg md:leading-8">
          <T>
            Centraliza la identidad del restaurante, las reglas de reserva y los permisos del equipo desde una única pantalla.
          </T>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row" />
    </section>
  );
}
//-aqui termina componente SettingsToolbar-//

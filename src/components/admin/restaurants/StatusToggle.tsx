/**
 * Archivo: StatusToggle.tsx
 * Responsabilidad: Renderizar un interruptor (switch) visual para activar/desactivar un restaurante.
 * Tipo: UI
 */

import { toggleRestaurantStatusAction } from "@/app/(admin)/admin/restaurants/actions";

interface StatusToggleProps {
  id: string;
  isActive: boolean;
}

/**
 * Renderiza un switch de estado que dispara la acción de servidor al cambiar.
 * 
 * @pure
 */
export function StatusToggle({ id, isActive }: StatusToggleProps) {
  return (
    <form action={toggleRestaurantStatusAction.bind(null, id)}>
      <button
        type="submit"
        className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          isActive ? "bg-secondary" : "bg-primary"
        }`}
        title={isActive ? "Desactivar restaurante" : "Activar restaurante"}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </form>
  );
}

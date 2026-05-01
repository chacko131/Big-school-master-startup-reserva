/**
 * Archivo: actions.ts
 * Responsabilidad: Definir las acciones de servidor para la gestión de restaurantes en el panel admin.
 * Tipo: lógica | servicio
 */

"use server";

import { revalidatePath } from "next/cache";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { ToggleRestaurantStatus } from "@/modules/catalog/application/use-cases/toggle-restaurant-status.use-case";

//-aqui empieza funcion toggleRestaurantStatusAction y es para alternar el estado de un restaurante desde la UI-//
/**
 * Acción de servidor para activar/desactivar un restaurante.
 * @sideEffect
 */
export async function toggleRestaurantStatusAction(restaurantId: string) {
  try {
    const infrastructure = getCatalogInfrastructure();
    const useCase = new ToggleRestaurantStatus(infrastructure.restaurantRepository);

    await useCase.execute(restaurantId);

    revalidatePath("/admin/restaurants");
  } catch (error) {
    console.error("Error toggling restaurant status:", error);
    throw new Error("No se pudo cambiar el estado del restaurante.");
  }
}
//-aqui termina funcion toggleRestaurantStatusAction-//

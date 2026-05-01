/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de listado de restaurantes tenant del panel SaaS.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { RestaurantMetricCard, RestaurantMetricDefinition } from "@/components/admin/restaurants/RestaurantMetricCard";
import { RestaurantTenantRow, RestaurantTenantDefinition } from "@/components/admin/restaurants/RestaurantTenantRow";
import { RestaurantTasksRail } from "@/components/admin/restaurants/RestaurantTasksRail";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { ListRestaurantsUseCase } from "@/modules/catalog/application/use-cases/list-restaurants.use-case";


/**
 * Renderiza la vista de listado de restaurantes del panel admin.
 */
export default async function AdminRestaurantsPage() {
  const catalogInfrastructure = getCatalogInfrastructure();
  const listRestaurants = new ListRestaurantsUseCase(catalogInfrastructure.restaurantRepository);
  const restaurants = await listRestaurants.execute();
  return (
    <>
      <section className="rounded-[28px] bg-secondary-container px-6 py-8 shadow-sm md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
              <T>Tenants</T>
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-primary md:text-5xl">
              <T>Restaurantes de la plataforma</T>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-on-surface-variant">
              <T>Listado operativo para revisar estado, plan, sincronización y acceso al detalle de cada restaurante tenant.</T>
            </p>
          </div>

          <div className="rounded-[24px] bg-surface-container-low p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              <T>Segmentación</T>
            </p>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              <T>Se priorizan los tenants en onboarding y los que presentan señales tempranas de riesgo operativo.</T>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RestaurantMetricCard
          caption="restaurantes con operación en vivo"
          label="Tenants activos"
          tone="primary"
          value={String(restaurants.filter(r => r.isActive).length)}
        />
        <RestaurantMetricCard
          caption="TODO: Ahora cuenta manuales. Futuro: nacerán inactivos hasta completar Auth/Billing."
          label="Inactivos / Onboarding"
          tone="secondary"
          value={String(restaurants.filter(r => !r.isActive).length)}
        />
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.45fr_0.9fr]">
        <div className="space-y-4">
          {restaurants.map((tenantDefinition) => (
            <RestaurantTenantRow key={tenantDefinition.id} tenantDefinition={tenantDefinition} />
          ))}
        </div>

        <RestaurantTasksRail />
      </section>
    </>
  );
}

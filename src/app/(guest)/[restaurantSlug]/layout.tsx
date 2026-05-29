/**
 * Archivo: layout.tsx
 * Responsabilidad: Validar que el restaurante no está suspendido antes de renderizar su página pública.
 * Tipo: UI
 *
 * Este layout aplica a todas las rutas bajo /[restaurantSlug]/ (perfil + reservar).
 * Si el restaurante está en estado SUSPENDED (no pagó después de 14+ días del trial),
 * en lugar de mostrar su contenido, muestra una página estática de "no disponible".
 * 
 * La página pública es lo ÚLTIMO que se toca en la estrategia de degradación.
 * Solo se bloquea cuando todas las fases de aviso ya pasaron.
 */

import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { getBillingInfrastructure } from "@/modules/billing/infrastructure/billing-infrastructure";
import { GetRestaurantAccessLevel } from "@/modules/billing/application/use-cases/GetRestaurantAccessLevel/get-restaurant-access-level.use-case";

interface RestaurantSlugLayoutProps {
  children: ReactNode;
  params: Promise<{ restaurantSlug: string }>;
}

//-aqui empieza layout RestaurantSlugLayout y es para proteger la página pública de restaurantes suspendidos-//
/**
 * Antes de renderizar cualquier página pública del restaurante,
 * verifica que el restaurante exista y que no esté en estado suspendido.
 *
 * - Si el restaurante no existe → 404 normal.
 * - Si está suspendido → muestra una página estática elegante.
 * - Si tiene cualquier otro estado → renderiza normalmente.
 *
 * @sideEffect — lectura de base de datos.
 */
export default async function RestaurantSlugLayout({ children, params }: RestaurantSlugLayoutProps) {
  const { restaurantSlug } = await params;

  // Buscar el restaurante por slug para obtener su ID
  let restaurant;
  try {
    const { restaurantRepository } = getCatalogInfrastructure();
    restaurant = await restaurantRepository.findBySlug(restaurantSlug);
  } catch (error) {
    console.error(
      `[RestaurantSlugLayout] Error al ejecutar restaurantRepository.findBySlug para el slug "${restaurantSlug}":`,
      error
    );
    // Fallback gracioso: si el repositorio de base de datos falla al buscar por slug, mostramos un 404 llamando a notFound()
    notFound();
  }

  if (restaurant === null) {
    notFound();
  }

  const restaurantId = restaurant.toPrimitives().id;

  // Consultar el nivel de acceso de la suscripción de forma defensiva
  let accessResult;
  try {
    const { subscriptionRepository } = getBillingInfrastructure();
    const accessUseCase = new GetRestaurantAccessLevel(subscriptionRepository);
    accessResult = await accessUseCase.execute({ restaurantId });
  } catch (error) {
    console.error(
      `[RestaurantSlugLayout] Error al obtener el nivel de acceso ejecutando GetRestaurantAccessLevel para el restaurante "${restaurantId}":`,
      error
    );
    // Fallback: si falla el repositorio de facturación, por seguridad asumimos acceso normal "full" para que no caiga la web pública.
    accessResult = { level: "full" };
  }

  // Solo bloqueamos la página pública en estado SUSPENDED (el último recurso)
  if (accessResult.level === "suspended") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 py-16 text-on-surface">
        <div className="w-full max-w-lg text-center">
          {/* Icono decorativo */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-low">
            <svg className="h-10 w-10 text-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M3.34 17a10 10 0 1 1 17.32 0" />
            </svg>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            Página no disponible
          </p>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-on-surface md:text-4xl">
            Este restaurante no está disponible de momento
          </h1>

          <p className="mt-6 text-base leading-7 text-on-surface-variant">
            Estamos trabajando para restablecer este servicio lo antes posible.
            Disculpa las molestias.
          </p>

          <div className="mt-10">
            <Link
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-on-primary transition-all hover:opacity-90"
              href="/"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Si no está suspendido, renderizar la página pública normal
  return <>{children}</>;
}
//-aqui termina layout RestaurantSlugLayout-//

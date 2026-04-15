/**
 * Archivo: page.tsx (pricing)
 * Responsabilidad: Página de precios y planes de Reserva Latina.
 * Tipo: UI
 */

import { PublicIcon } from "@/components/public/PublicIcon";
import { T } from "@/components/T";
import Link from "next/link";

//-aqui empieza pagina PricingPage y es para mostrar planes-//
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <main className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {/*-aqui empieza hero de precios-*/}
        <header className="mx-auto mb-24 max-w-3xl text-center">
          <h1 className="mb-8 text-5xl font-extrabold leading-tight tracking-tight text-on-surface lg:text-7xl">
            <T>Planes diseñados para crecer contigo</T>
          </h1>
          <p className="text-xl font-light text-on-surface-variant">
            <T>Desde pequeños bistrós hasta grandes grupos hoteleros. Elige la infraestructura que tu hospitalidad merece.</T>
          </p>
        </header>

        {/*-aqui empieza grid de planes-*/}
        <div className="mb-32 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Plan Básico */}
          <div className="flex flex-col rounded-xl border border-transparent bg-surface-container-lowest p-10 transition-all duration-300 hover:shadow-2xl hover:shadow-black/5">
            <div className="mb-8">
              <h3 className="mb-2 text-lg font-semibold text-secondary">
                <T>Básico</T>
              </h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tighter text-primary">$49</span>
                <span className="ml-2 text-on-surface-variant">/mes</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
                <T>Perfecto para restaurantes emergentes que buscan digitalizar su operación.</T>
              </p>
            </div>
            <ul className="mb-10 grow space-y-4">
              <li className="flex items-start gap-3">
                <PublicIcon name="checkCircle" className="text-lg text-secondary" />
                <span className="text-sm"><T>Hasta 500 reservas/mes</T></span>
              </li>
              <li className="flex items-start gap-3">
                <PublicIcon name="checkCircle" className="text-lg text-secondary" />
                <span className="text-sm"><T>Gestión de mesas básica</T></span>
              </li>
              <li className="flex items-start gap-3">
                <PublicIcon name="checkCircle" className="text-lg text-secondary" />
                <span className="text-sm"><T>Soporte vía email</T></span>
              </li>
            </ul>
            <Link href="/demo" className="w-full rounded-lg bg-surface-container-highest py-4 text-center font-bold text-on-surface transition-colors hover:bg-surface-container">
              <T>Empezar ahora</T>
            </Link>
          </div>

          {/* Plan Pro */}
          <div className="relative flex scale-105 flex-col overflow-hidden rounded-xl bg-primary p-10 text-on-primary shadow-2xl transition-all duration-300">
            <div className="absolute right-4 top-4 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-secondary">
              <T>Más Popular</T>
            </div>
            <div className="mb-8">
              <h3 className="mb-2 text-lg font-semibold text-secondary-fixed">
                <T>Pro</T>
              </h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tighter">$129</span>
                <span className="ml-2 opacity-70">/mes</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed opacity-80">
                <T>Optimización avanzada y herramientas de marketing para negocios en expansión.</T>
              </p>
            </div>
            <ul className="mb-10 grow space-y-4">
              <li className="flex items-start gap-3">
                <PublicIcon name="checkCircle" className="text-lg text-secondary-fixed" />
                <span className="text-sm"><T>Reservas ilimitadas</T></span>
              </li>
              <li className="flex items-start gap-3">
                <PublicIcon name="checkCircle" className="text-lg text-secondary-fixed" />
                <span className="text-sm"><T>Floor Plan interactivo</T></span>
              </li>
              <li className="flex items-start gap-3">
                <PublicIcon name="checkCircle" className="text-lg text-secondary-fixed" />
                <span className="text-sm"><T>CRM de clientes básico</T></span>
              </li>
              <li className="flex items-start gap-3">
                <PublicIcon name="checkCircle" className="text-lg text-secondary-fixed" />
                <span className="text-sm"><T>Soporte prioritario 24/7</T></span>
              </li>
            </ul>
            <Link href="/demo" className="w-full rounded-lg bg-on-primary py-4 text-center font-bold text-primary transition-opacity hover:opacity-90">
              <T>Seleccionar Pro</T>
            </Link>
          </div>

          {/* Plan Enterprise */}
          <div className="flex flex-col rounded-xl bg-surface-container-lowest p-10 transition-all duration-300 hover:shadow-2xl hover:shadow-black/5">
            <div className="mb-8">
              <h3 className="mb-2 text-lg font-semibold text-on-tertiary-container">
                <T>Enterprise</T>
              </h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tighter text-primary">
                  <T>Custom</T>
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
                <T>Para grupos hoteleros y corporaciones que requieren control total y escala.</T>
              </p>
            </div>
            <ul className="mb-10 grow space-y-4">
              <li className="flex items-start gap-3">
                <PublicIcon name="checkCircle" className="text-lg text-on-tertiary-container" />
                <span className="text-sm"><T>Multi-tenant (Múltiples sedes)</T></span>
              </li>
              <li className="flex items-start gap-3">
                <PublicIcon name="checkCircle" className="text-lg text-on-tertiary-container" />
                <span className="text-sm"><T>Acceso API completo</T></span>
              </li>
              <li className="flex items-start gap-3">
                <PublicIcon name="checkCircle" className="text-lg text-on-tertiary-container" />
                <span className="text-sm"><T>Account Manager dedicado</T></span>
              </li>
              <li className="flex items-start gap-3">
                <PublicIcon name="checkCircle" className="text-lg text-on-tertiary-container" />
                <span className="text-sm"><T>SSO y Seguridad avanzada</T></span>
              </li>
            </ul>
            <Link href="/demo" className="w-full rounded-lg border-2 border-primary py-4 text-center font-bold text-primary transition-all hover:bg-primary hover:text-on-primary">
              <T>Contactar Ventas</T>
            </Link>
          </div>
        </div>

        {/*-aqui empieza tabla comparativa-*/}
        <section className="mb-32 overflow-hidden">
          <h2 className="mb-12 text-center text-3xl font-bold">
            <T>Comparativa Detallada</T>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-6 py-6 text-sm font-semibold"><T>Característica</T></th>
                  <th className="px-6 py-6 text-center text-sm font-semibold"><T>Básico</T></th>
                  <th className="px-6 py-6 text-center text-sm font-semibold"><T>Pro</T></th>
                  <th className="px-6 py-6 text-center text-sm font-semibold"><T>Enterprise</T></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/30">
                <tr className="transition-colors hover:bg-surface-container-high">
                  <td className="px-6 py-6 text-sm font-medium"><T>Reservas Mensuales</T></td>
                  <td className="px-6 py-6 text-center text-sm">500</td>
                  <td className="px-6 py-6 text-center text-sm font-bold"><T>Ilimitadas</T></td>
                  <td className="px-6 py-6 text-center text-sm font-bold"><T>Ilimitadas</T></td>
                </tr>
                <tr className="transition-colors hover:bg-surface-container-high">
                  <td className="px-6 py-6 text-sm font-medium"><T>Multi-tenant (Multi-sede)</T></td>
                  <td className="px-6 py-6"><div className="flex justify-center"><PublicIcon name="cancel" className="text-outline-variant" /></div></td>
                  <td className="px-6 py-6"><div className="flex justify-center"><PublicIcon name="cancel" className="text-outline-variant" /></div></td>
                  <td className="px-6 py-6"><div className="flex justify-center"><PublicIcon name="checkCircle" className="text-secondary" /></div></td>
                </tr>
                <tr className="transition-colors hover:bg-surface-container-high">
                  <td className="px-6 py-6 text-sm font-medium">API Access</td>
                  <td className="px-6 py-6"><div className="flex justify-center"><PublicIcon name="cancel" className="text-outline-variant" /></div></td>
                  <td className="px-6 py-6 text-center text-sm"><T>Solo Lectura</T></td>
                  <td className="px-6 py-6"><div className="flex justify-center"><PublicIcon name="checkCircle" className="text-secondary" /></div></td>
                </tr>
                <tr className="transition-colors hover:bg-surface-container-high">
                  <td className="px-6 py-6 text-sm font-medium"><T>Premium Support 24/7</T></td>
                  <td className="px-6 py-6 text-center text-sm"><T>Email (48h)</T></td>
                  <td className="px-6 py-6 text-center text-sm"><T>Chat & Email</T></td>
                  <td className="px-6 py-6 text-center text-sm font-bold"><T>Dedicado</T></td>
                </tr>
                <tr className="transition-colors hover:bg-surface-container-high">
                  <td className="px-6 py-6 text-sm font-medium"><T>Personalización de Marca</T></td>
                  <td className="px-6 py-6 text-center text-sm"><T>Básica</T></td>
                  <td className="px-6 py-6 text-center text-sm"><T>Avanzada</T></td>
                  <td className="px-6 py-6 text-center text-sm font-bold"><T>White-label</T></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/*-aqui empieza seccion FAQ-*/}
        <section className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-12">
          <div className="flex flex-col justify-between rounded-3xl bg-tertiary-container p-10 md:col-span-4">
            <h2 className="mb-8 text-4xl font-extrabold leading-tight text-white!">
              <T>Preguntas Frecuentes</T>
            </h2>
            <div className="mb-8 h-1 w-20 bg-on-tertiary-container/30"></div>
            <p className="font-light text-white! ">
              <T>¿Tienes dudas comerciales? Nuestro equipo está listo para ayudarte a encontrar el encaje perfecto.</T>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-8">
            <div className="rounded-2xl bg-surface-container-lowest p-8">
              <h4 className="mb-3 font-bold"><T>¿Puedo cambiar de plan?</T></h4>
              <p className="text-sm text-on-surface-variant">
                <T>Sí, puedes subir o bajar de categoría en cualquier momento desde tu panel de administración. El ajuste se prorrateará automáticamente.</T>
              </p>
            </div>
            <div className="rounded-2xl bg-surface-container-lowest p-8">
              <h4 className="mb-3 font-bold"><T>¿Hay costos de instalación?</T></h4>
              <p className="text-sm text-on-surface-variant">
                <T>No cobramos cuotas de apertura en los planes Básico y Pro. Para el plan Enterprise, el costo depende de las integraciones requeridas.</T>
              </p>
            </div>
            <div className="rounded-2xl bg-surface-container-lowest p-8">
              <h4 className="mb-3 font-bold"><T>¿Qué métodos de pago aceptan?</T></h4>
              <p className="text-sm text-on-surface-variant">
                <T>Aceptamos todas las tarjetas de crédito principales, débito y transferencias bancarias para planes anuales.</T>
              </p>
            </div>
            <div className="rounded-2xl bg-surface-container-lowest p-8">
              <h4 className="mb-3 font-bold"><T>¿Ofrecen soporte local?</T></h4>
              <p className="text-sm text-on-surface-variant">
                <T>Contamos con equipos de éxito al cliente en Madrid, Ciudad de México y Bogotá para asegurar el mejor servicio en tu zona horaria.</T>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

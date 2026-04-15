/**
 * Archivo: page.tsx (demo)
 * Responsabilidad: Página de solicitud de demo personalizada para prospectos.
 * Tipo: UI
 */

import { PublicIcon } from "@/components/public/PublicIcon";
import { T } from "@/components/T";
import Image from "next/image";

//-aqui empieza pagina DemoPage y es para captar leads-//
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-surface">


      <main className="mx-auto max-w-7xl px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
          {/*-aqui empieza columna izquierda con formulario-*/}
          <div className="lg:col-span-7">
            <header className="mb-12">
              <span className="mb-4 block text-sm font-semibold uppercase tracking-widest text-secondary">
                <T>Personalized Demo</T>
              </span>
              <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-primary md:text-6xl">
                <T>Agenda una demo personalizada</T>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant">
                <T>
                  Descubre cómo Reserva Latina optimiza la gestión de tu restaurante con tecnología diseñada para la alta hospitalidad. Sin compromisos, solo soluciones.
                </T>
              </p>
            </header>

            <section className="rounded-xl bg-surface-container-lowest p-8 md:p-10">
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block px-1 text-sm font-medium text-on-surface">
                      <T>Nombre completo</T>
                    </label>
                    <input
                      className="h-12 w-full rounded-lg border-0 bg-surface-container-low px-4 transition-all focus:ring-1 focus:ring-primary"
                      placeholder="Ej. Javier García"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block px-1 text-sm font-medium text-on-surface">
                      <T>Nombre del Restaurante</T>
                    </label>
                    <input
                      className="h-12 w-full rounded-lg border-0 bg-surface-container-low px-4 transition-all focus:ring-1 focus:ring-primary"
                      placeholder="Ej. El Celler de Can Roca"
                      type="text"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block px-1 text-sm font-medium text-on-surface">
                    <T>Número de Mesas</T>
                  </label>
                  <select className="h-12 w-full appearance-none rounded-lg border-0 bg-surface-container-low px-4 transition-all focus:ring-1 focus:ring-primary">
                    <option>1 - 10 mesas</option>
                    <option>11 - 30 mesas</option>
                    <option>30+ mesas</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block px-1 text-sm font-medium text-on-surface">
                      <T>Email corporativo</T>
                    </label>
                    <input
                      className="h-12 w-full rounded-lg border-0 bg-surface-container-low px-4 transition-all focus:ring-1 focus:ring-primary"
                      placeholder="javier@restaurante.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block px-1 text-sm font-medium text-on-surface">
                      <T>Teléfono</T>
                    </label>
                    <input
                      className="h-12 w-full rounded-lg border-0 bg-surface-container-low px-4 transition-all focus:ring-1 focus:ring-primary"
                      placeholder="+34 000 000 000"
                      type="tel"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    className="h-14 w-full rounded-lg bg-primary px-10 font-bold text-on-primary shadow-lg shadow-black/5 transition-all duration-200 hover:scale-95 md:w-auto"
                    type="submit"
                  >
                    <T>Agendar Demo Ahora</T>
                  </button>
                  <p className="mt-4 text-xs text-on-primary-container">
                    <T>Al enviar este formulario, aceptas nuestra Política de Privacidad.</T>
                  </p>
                </div>
              </form>
            </section>
          </div>

          {/*-aqui empieza columna derecha con beneficios-*/}
          <aside className="sticky top-32 space-y-8 lg:col-span-5">
            <div className="group relative aspect-4/3 overflow-hidden rounded-xl">
              <Image
                alt="Restaurant interior"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                fill
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7_KV-kGRLm37u34UdWpn93gNpkMvq-4yCJ3JDQmzE1QQ18P5V-Q-mnEmnf8JT-wnMAInbmj_WW-l4pMgtecYayDsO75ewN_70PH8aconZL7kuyil7ENRILT9qsyDAT4e81w5ZWtOao7VdSeXqmrQoJFgYblXqphLLBIg2rQbRtyf8tKsMHeT9o43MojJCzIJeKa4J38dQ98RyCCQHCp2snZKj7qbLfxDE6E8USP1MTXHO8zRskdXmPsX-zfjmyOO48z-M4ckAbuk"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                  <p className="font-medium italic text-white">
                    <T>&quot;Reserva Latina transformó nuestra gestión de planta en menos de una semana.&quot;</T>
                  </p>
                  <span className="mt-2 block text-xs text-white/70">
                    <T>— Gerente, Palacio de Hierro</T>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 rounded-xl border border-secondary-container/50 bg-secondary-container/30 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <PublicIcon name="timer" className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    <T>Mira cómo funciona en 15 minutos</T>
                  </h3>
                  <p className="mt-1 text-sm text-on-secondary-fixed-variant">
                    <T>Una sesión rápida enfocada en el retorno de inversión y la facilidad de uso para tu equipo.</T>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-low p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tertiary-container">
                  <PublicIcon name="questionAnswer" className="text-on-tertiary-container" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    <T>Resuelve tus dudas operativas</T>
                  </h3>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    <T>Habla directamente con un experto en hospitalidad, no con un vendedor genérico.</T>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-low p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
                  <PublicIcon name="autoAwesome" className="text-on-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    <T>Integración Impecable</T>
                  </h3>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    <T>Descubre cómo nos conectamos con tus sistemas actuales sin interrumpir el servicio.</T>
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

    </div>
  );
}

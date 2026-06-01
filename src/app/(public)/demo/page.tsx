/**
 * Archivo: page.tsx (demo)
 * Responsabilidad: Página de solicitud de demo personalizada para prospectos.
 * Tipo: UI
 */

import { PublicIcon } from "@/components/public/PublicIcon";
import { T } from "@/components/T";
import Link from "next/link";
import Image from "next/image";

//-aqui empieza pagina DemoPage y es para captar leads-//
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-surface">


      <main className="mx-auto max-w-7xl px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
          {/*-aqui empieza columna izquierda con propuesta de valor y CTA al onboarding-*/}
          <div className="lg:col-span-7">
            <header className="mb-12">
              <span className="mb-4 block text-sm font-semibold uppercase tracking-widest text-secondary">
                <T>Sin tarjeta de crédito</T>
              </span>
              <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-primary md:text-6xl">
                <T>60 días gratis. Empieza hoy.</T>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant">
                <T>
                  Accede a todas las funcionalidades del Plan Pro sin coste durante 60 días. Configura tu restaurante en minutos y comprueba el impacto en tu operación antes de comprometerte.
                </T>
              </p>
            </header>

            <section className="space-y-6">
              <ul className="space-y-4">
                {([
                  { icon: "checkCircle", text: "Gestión completa de reservas y mesas" },
                  { icon: "checkCircle", text: "Panel operativo en tiempo real" },
                  { icon: "checkCircle", text: "Lista de espera y recordatorios automáticos" },
                  { icon: "checkCircle", text: "Métricas y reportes de conversión" },
                  { icon: "checkCircle", text: "Soporte prioritario durante todo el trial" },
                ] as const).map(({ icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <PublicIcon name={icon} className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-base text-on-surface">
                      <T>{text}</T>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link
                  className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-10 font-bold text-on-primary shadow-lg transition-all duration-200 hover:scale-95"
                  href="/onboarding/restaurant"
                >
                  <T>Comenzar prueba gratuita →</T>
                </Link>
                <p className="mt-4 text-xs text-on-surface-variant">
                  <T>Sin tarjeta de crédito. Configura tu restaurante en menos de 5 minutos.</T>
                </p>
              </div>
            </section>
          </div>

          {/*-aqui empieza columna derecha con beneficios-*/}
          <aside className="sticky top-32 space-y-8 lg:col-span-5">
            <div className="group relative aspect-4/3 overflow-hidden rounded-xl">
              <Image
                alt="Restaurant interior"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
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

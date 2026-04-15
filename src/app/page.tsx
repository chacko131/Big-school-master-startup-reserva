/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la landing principal pública de Reserva Latina.
 * Tipo: UI
 */

import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicIcon } from "@/components/public/PublicIcon";
import Image from "next/image";
import { T } from "@/components/T";

//-aqui empieza pagina principal publica-//
/**
 * Landing pública principal adaptada desde el mockup de Stitch.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden pb-32 pt-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-8 lg:grid-cols-12">
            <div className="z-10 lg:col-span-7">
              <h1 className="mb-8 text-5xl font-extrabold leading-[1.1] tracking-tighter text-primary md:text-7xl">
                <T>Optimiza tu Restaurante Latino</T>
              </h1>
              <p className="mb-10 max-w-xl text-xl leading-relaxed text-on-surface-variant">
                <T>La plataforma de gestión diseñada para el alma de la hospitalidad latina. Eficiencia brutal, calidez humana.</T>
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="rounded-lg bg-primary px-8 py-4 text-lg font-bold text-on-primary transition-all hover:bg-zinc-800">
                  <T>Solicitar Demo</T>
                </button>
                <button className="rounded-lg bg-surface-container-highest px-8 py-4 text-lg font-bold text-primary transition-all hover:bg-surface-container-high">
                  <T>Registrar Restaurante</T>
                </button>
              </div>
            </div>

            <div className="relative lg:col-span-5">
              <div className="relative aspect-4/5 rotate-2 overflow-hidden rounded-xl bg-surface-container-high shadow-2xl">
                <Image
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuRvXphLIb5wiR3dMJtjnzdk0XNgS9b9Fqn0SJZxc5x1fu3o0Akxp8XcNw1LAHqjd58E4L0dQk_T5McP9f8dX1NEcDMQ-weUGTscL02QOHsvoZtbnJm7iFi5GZM_9u5suo5Ue5dOqgjzRSExAcbEWc7FfsN2NDXGJH5ZbYd5HLG-BB97Rsqfi04d2eL1a7rS8JuVlngrJlZ7edLJYCpfh14BurAjT6SnihmiBXb9zMnIpOxE4vsw4HO07Sbpe7XS_JV8nln0dBJHE"
                  alt="Interior de un restaurante latino moderno de alta gama con iluminación cálida, mobiliario de madera elegante y detalles arquitectónicos sofisticados"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              <div className="absolute -bottom-6 -left-6 max-w-[240px] -rotate-3 rounded-xl border border-zinc-100 bg-white p-6 shadow-xl">
                <div className="mb-2 flex items-center gap-3">
                  <PublicIcon name="checkCircle" className="h-7 w-7 text-secondary" />
                  <span className="font-bold text-primary"><T>Reservado</T></span>
                </div>
                <p className="text-sm text-zinc-500"><T>Mesa 12 confirmada para la Familia Rodriguez.</T></p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-100 bg-surface-container-low py-16">
          <div className="mx-auto max-w-7xl px-8">
            <p className="mb-12 text-center text-sm font-bold uppercase tracking-widest text-zinc-400">
              <T>CON LA CONFIANZA DE LOS MEJORES</T>
            </p>
            <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale transition-all duration-500 hover:grayscale-0 md:gap-24">
              <div className="text-2xl font-black tracking-tighter">EL CIELO</div>
              <div className="text-2xl font-black tracking-tighter italic">Pujol</div>
              <div className="text-2xl font-black tracking-tighter uppercase">Astrid y Gastón</div>
              <div className="font-serif text-2xl font-black tracking-tighter">Boragó</div>
              <div className="text-2xl font-black tracking-tighter">CENTRAL</div>
            </div>
          </div>
        </section>

        <section className="py-32">
          <div className="mx-auto max-w-7xl px-8">
            <div className="mb-20 max-w-3xl">
              <h2 className="mb-6 text-4xl font-bold tracking-tighter md:text-5xl"><T>Del caos de papel a la precisión digital</T></h2>
              <p className="text-lg text-on-surface-variant"><T>Elimina las fricciones operativas que frenan el crecimiento de tu restaurante.</T></p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-100 bg-surface p-12">
                <span className="mb-6 inline-block rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-bold text-tertiary-container">
                  <T>SITUACIÓN ACTUAL</T>
                </span>
                <h3 className="mb-8 text-2xl font-bold"><T>Gestión Fragmentada</T></h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <PublicIcon name="cancel" className="mt-1 text-error" />
                    <div>
                      <p className="font-bold"><T>Overbooking y No-shows</T></p>
                      <p className="text-sm text-on-surface-variant"><T>Mesas vacías o clientes esperando bajo la lluvia.</T></p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <PublicIcon name="cancel" className="mt-1 text-error" />
                    <div>
                      <p className="font-bold"><T>Libretas Perdidas</T></p>
                      <p className="text-sm text-on-surface-variant"><T>Preferencias de clientes que se olvidan al cerrar el turno.</T></p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <PublicIcon name="cancel" className="mt-1 text-error" />
                    <div>
                      <p className="font-bold"><T>Cero Datos</T></p>
                      <p className="text-sm text-on-surface-variant"><T>Sin saber quién es tu cliente más fiel hasta que se va.</T></p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-primary p-12 text-on-primary shadow-2xl">
                <span className="mb-6 inline-block rounded-full border border-secondary-fixed-dim/30 px-3 py-1 text-xs font-bold text-secondary-fixed-dim">
                  <T>CON RESERVA LATINA</T>
                </span>
                <h3 className="mb-8 text-2xl font-bold"><T>Experiencia Impecable</T></h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <PublicIcon name="checkCircle" className="mt-1 h-6 w-6 text-secondary-fixed" />
                    <div>
                      <p className="font-bold"><T>Control Total de Flujo</T></p>
                      <p className="text-sm text-white/70"><T>Algoritmos que optimizan cada asiento disponible en tiempo real.</T></p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <PublicIcon name="checkCircle" className="mt-1 h-6 w-6 text-secondary-fixed" />
                    <div>
                      <p className="font-bold"><T>Perfil de Huésped Digital</T></p>
                      <p className="text-sm text-white/70"><T>Conoce alergias, cumpleaños y platos favoritos al instante.</T></p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <PublicIcon name="checkCircle" className="mt-1 h-6 w-6 text-secondary-fixed" />
                    <div>
                      <p className="font-bold"><T>Dashboard de Inteligencia</T></p>
                      <p className="text-sm text-white/70"><T>Decisiones basadas en datos para maximizar tu rentabilidad.</T></p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low py-32">
          <div className="mx-auto max-w-7xl px-8">
            <div className="mb-20 text-center">
              <h2 className="mb-4 text-4xl font-bold tracking-tighter text-black "><T>Potencia cada rincón de tu mesa</T></h2>
              <p className="text-on-surface-variant"><T>Herramientas sofisticadas para una hospitalidad legendaria.</T></p>
            </div>

            <div className="grid auto-rows-[300px] grid-cols-1 gap-6 md:grid-cols-12">
              <div className="relative overflow-hidden rounded-2xl bg-white p-10 md:col-span-8">
                <div className="z-10 flex h-full flex-col justify-between">
                  <div>
                    <h3 className="mb-4 text-2xl font-bold"><T>Potencia tu mesa</T></h3>
                    <p className="max-w-sm text-on-surface-variant"><T>Gestión de inventario de mesas dinámica que se adapta a las horas pico automáticamente.</T></p>
                  </div>
                  <button className="mt-auto flex items-center gap-2 font-bold text-primary transition-transform group-hover:translate-x-2">
                    <T>Ver detalles</T> <PublicIcon name="arrowForward" className="text-primary" />
                  </button>
                </div>
                <div className="absolute bottom-0 right-0 h-2/3 w-2/3 opacity-10 transition-opacity">
                  <PublicIcon name="tableRestaurant" className="h-40 w-40 text-black" />
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl bg-secondary p-10 text-on-secondary md:col-span-4">
                <div>
                  <PublicIcon name="group" className="mb-6 h-10 w-10 text-white" />
                  <h3 className="mb-4 text-2xl font-bold"><T>CRM para Huéspedes</T></h3>
                  <p className="text-secondary-fixed/80"><T>Transforma visitantes anónimos en clientes de por vida con perfiles detallados.</T></p>
                </div>
                <div className="mt-8 border-t border-white/10 pt-8">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-60"><T>Personalización Pro</T></p>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl bg-tertiary-container p-10 text-white md:col-span-4">
                <div>
                  <PublicIcon name="analytics" className="mb-6 h-10 w-10 text-on-tertiary-container" />
                  <h3 className="mb-4 text-2xl font-bold text-white"><T>Dashboard en tiempo real</T></h3>
                  <p className="text-white/60"><T>Monitorea ocupación, ventas y rendimiento del staff desde cualquier lugar.</T></p>
                </div>
                <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span><T>Ocupación Hoy</T></span>
                    <span className="text-secondary-fixed">88%</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/10">
                    <div className="h-1 w-[88%] rounded-full bg-secondary-fixed" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12 overflow-hidden rounded-2xl bg-surface-container-highest p-10 md:col-span-8">
                <div className="flex-1">
                  <h3 className="mb-4 text-2xl font-bold"><T>Integración Total</T></h3>
                  <p className="text-on-surface-variant"><T>Conectamos con tus POS, pasarelas de pago y redes sociales preferidas sin complicaciones.</T></p>
                </div>
                <div className="hidden flex-1 gap-4 lg:flex">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-sm">
                    <PublicIcon name="payments" className="text-zinc-400" />
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-sm">
                    <PublicIcon name="shoppingCart" className="text-zinc-400" />
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-sm">
                    <PublicIcon name="smartphone" className="text-zinc-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-32">
          <div className="mx-auto max-w-5xl px-8 text-center">
            <h2 className="mb-10 text-5xl font-extrabold leading-tight tracking-tighter md:text-7xl"><T>¿Listo para elevar tu estándar?</T></h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl text-on-surface-variant">
              <T>Únete a los restaurantes más exclusivos de Latinoamérica que ya están transformando su operación.</T>
            </p>
            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <button className="rounded-lg bg-primary px-10 py-5 text-xl font-bold text-on-primary shadow-2xl transition-transform duration-150 hover:scale-105">
                <T>Comienza gratis hoy</T>
              </button>
              <button className="rounded-lg border-2 border-primary bg-white px-10 py-5 text-xl font-bold text-primary transition-colors duration-150 hover:bg-zinc-50">
                <T>Hablar con un experto</T>
              </button>
            </div>
            <p className="mt-8 text-sm italic text-zinc-400"><T>Sin tarjeta de crédito. Configuración en 5 minutos.</T></p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
//-aqui termina pagina principal publica-//

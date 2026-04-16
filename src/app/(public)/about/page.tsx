/**
 * Archivo: page.tsx (about)
 * Responsabilidad: Presentar la historia, misión, valores y equipo de Reserva Latina.
 * Tipo: UI
 */

import { PublicIcon } from "@/components/public/PublicIcon";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { PublicSection } from "@/components/public/PublicSection";
import { T } from "@/components/T";
import Image from "next/image";
import Link from "next/link";

interface AboutValueCardProps {
  icon: "favorite" | "precisionManufacturing" | "handshake";
  title: string;
  description: string;
}

interface AboutMetricCardProps {
  value: string;
  label: string;
}



//-aqui empieza componente AboutMetricCard y es para mostrar impacto cuantitativo-//
function AboutMetricCard({ value, label }: AboutMetricCardProps) {
  return (
    <div className="flex min-h-[120px] flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
      <div className="mb-2 whitespace-nowrap text-4xl font-extrabold leading-none tracking-tighter text-white">
        <T>{value}</T>
      </div>
      <div className="text-xs uppercase tracking-widest text-white/60">
        <T>{label}</T>
      </div>
    </div>
  );
}

//-aqui empieza componente AboutValueCard y es para representar pilares de marca-//
function AboutValueCard({ icon, title, description }: AboutValueCardProps) {
  return (
    <div className="group flex h-full flex-col rounded-xl bg-surface-container-lowest p-10 transition-all duration-500 hover:bg-primary hover:text-on-primary">
      <PublicIcon name={icon} className="mb-6 h-10 w-10 text-secondary group-hover:text-white" />
      <h3 className="mb-4 text-2xl font-bold">
        <T>{title}</T>
      </h3>
      <p className="font-light leading-7 opacity-80">
        <T>{description}</T>
      </p>
    </div>
  );
}



//-aqui empieza pagina AboutPage y es para explicar la marca-//
export default function AboutPage() {
  const values: AboutValueCardProps[] = [
    {
      icon: "favorite",
      title: "Calidez Humana",
      description: "Entendemos que detrás de cada reserva hay una historia. Nuestra tecnología está hecha por personas para personas.",
    },
    {
      icon: "precisionManufacturing",
      title: "Precisión Tecnológica",
      description: "Diseñamos sistemas que optimizan cada interacción sin sacrificar la experiencia del comensal ni la del equipo.",
    },
    {
      icon: "handshake",
      title: "Compromiso Local",
      description: "Acompañamos el crecimiento del sector gastronómico latino con herramientas accesibles, potentes y cercanas.",
    },
  ];

 

  return (
    <PublicPageShell>
      <div className="space-y-20 lg:space-y-24">
        {/*-aqui empieza hero principal-*/}
        <section className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:items-center">
          <div className="min-w-0 lg:col-span-7">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-secondary">
              <T>Nuestra Trayectoria</T>
            </p>
            <h1 className="mb-8 text-5xl font-extrabold leading-[1.05] tracking-tighter text-primary md:text-7xl">
              <T>Modernizando la Hospitalidad Latina</T>
            </h1>
            <p className="max-w-2xl text-xl font-light leading-relaxed text-on-surface-variant md:text-2xl">
              <T>
                Empoderamos a los restaurantes del futuro con tecnología de precisión y la calidez humana que define nuestra cultura.
              </T>
            </p>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-surface-container-low">
              <Image
                alt="Interior de un restaurante latino moderno con iluminación cálida"
                className="object-cover grayscale-[0.2] transition-all duration-700 hover:grayscale-0"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_rm4inJAkhd6s7ObjQ0L6W_zOGCrZUy5MzvNRJNnyYm2KkdP5KKsntxXLjn6Nykp-cfD5pWQaHqcoYcStm-4suF2FtKJY4d2M5lclY41tElOMn9nsWL3nV5FC3CGsAmr2s-jAKM1V1_Hy1ULUa7LH7MHPu2MP0VTgP5JN-pnbvX70pTM2_CmhBt4tTW9uoc7wtbrj1Jzkuij_TXckQt7kvSl5MzM9-XsDrVmZ_wunWefe7JbO3PYmNCj_tLZp9PrHaEE3xRgsgtw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent"></div>
            </div>
          </div>
        </section>

        {/*-aqui empieza historia y filosofia-*/}
        <PublicSection
          eyebrow="Nuestra Filosofía"
          title="Arquitectura del Servicio"
          description="Nacimos de la observación directa en cocinas y salones de Latinoamérica. Cerramos la brecha entre la excelencia gastronómica y la gestión operativa moderna."
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
            <div className="min-w-0 space-y-6 text-lg leading-relaxed text-on-surface-variant lg:col-span-7">
              <p>
                <T>
                  Reserva Latina surge para cerrar esa brecha tecnológica. No somos solo un software de reservas; somos el sistema operativo de la hospitalidad moderna.
                </T>
              </p>
              <p>
                <T>
                  Diseñamos flujos que priorizan tanto la eficiencia del equipo como la emoción del comensal, para que cada interacción sume al negocio.
                </T>
              </p>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <div className="flex min-h-[320px] h-full flex-col justify-between rounded-2xl bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(26,28,28,0.06)]">
                <PublicIcon name="architecture" className="mb-8 h-10 w-10 text-secondary" />
                <blockquote className="text-2xl font-light italic leading-tight text-primary">
                  <T>La tecnología debe ser invisible, pero su impacto en la hospitalidad debe sentirse en cada sonrisa del cliente.</T>
                </blockquote>
                <div className="mt-10 border-t border-surface-container-high pt-6">
                  <p className="font-bold text-primary">
                    <T>Filosofía de Diseño</T>
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    <T>Visión 2024</T>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PublicSection>

        {/*-aqui empieza nuestros pilares-*/}
        <section className="space-y-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-secondary">
              <T>Nuestros Pilares</T>
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
              <T>Lo que defendemos</T>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {values.map((value) => (
              <AboutValueCard key={value.title} {...value} />
            ))}
          </div>
        </section>

        {/*-aqui empieza impacto real-*/}
        <section className="relative overflow-hidden rounded-3xl bg-primary py-20 text-on-primary">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-secondary/20 blur-[100px]"></div>
          <div className="relative z-10 grid grid-cols-1 gap-12 px-8 lg:grid-cols-12 lg:items-center lg:px-12">
            <div className="min-w-0 lg:col-span-5">
              <h2 className="mb-4 text-4xl font-bold tracking-tight text-white! md:text-5xl">
                <T>Impacto Real</T>
              </h2>
              <p className="text-lg font-light text-on-primary/70">
                <T>Crecemos junto a la comunidad gastronómica latina y medimos el éxito con resultados concretos.</T>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
              <AboutMetricCard value="+450" label="Restaurantes" />
              <AboutMetricCard value="1.2M" label="Comensales" />
              <AboutMetricCard value="15" label="Ciudades" />
            </div>
          </div>
        </section>

       

        {/*-aqui empieza cta final-*/}
        <PublicSection
          eyebrow="Únete al movimiento"
          title="Estamos transformando la industria restaurante a restaurante"
          description="Descubre cómo podemos elevar tu negocio con una plataforma pensada para la hospitalidad latina moderna."
          actions={
            <>
              <Link href="/demo" className="rounded-lg bg-primary px-8 py-4 font-bold text-on-primary transition-all hover:bg-zinc-800">
                <T>Solicitar Demo</T>
              </Link>
              <Link href="/pricing" className="rounded-lg bg-surface-container-highest px-8 py-4 font-bold text-primary transition-all hover:bg-surface-container-high">
                <T>Ver Planes</T>
              </Link>
            </>
          }
        />
      </div>
    </PublicPageShell>
  );
}

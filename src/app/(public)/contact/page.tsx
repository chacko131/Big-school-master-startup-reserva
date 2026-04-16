/**
 * Archivo: page.tsx (contact)
 * Responsabilidad: Página de contacto con formulario, info y FAQ.
 * Tipo: UI
 */

import { PublicIcon } from "@/components/public/PublicIcon";
import { T } from "@/components/T";
import Link from "next/link";

//-aqui empieza seccion ContactInfo con datos de contacto-//
interface ContactInfoProps {
  label: string;
  value: string;
  href?: string;
}

function ContactInfo({ label, value, href }: ContactInfoProps) {
  const content = (
    <div className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-widest text-on-primary-container">
        <T>{label}</T>
      </span>
      <p className="text-3xl font-medium tracking-tight">{value}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

//-aqui empieza seccion SocialLinks con iconos de redes-//
function SocialLinks() {
  const socials = [
    { icon: "language" as const, href: "#", label: "Sitio Web" },
    { icon: "share" as const, href: "#", label: "Compartir" },
  ];

  return (
    <div className="space-y-4 pt-4">
      <span className="text-xs font-bold uppercase tracking-widest text-on-primary-container">
        <T>Redes Sociales</T>
      </span>
      <div className="flex gap-6">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            className="transition-colors hover:text-secondary"
            aria-label={social.label}
          >
            <PublicIcon name={social.icon} />
          </a>
        ))}
      </div>
    </div>
  );
}

//-aqui empieza seccion ContactForm con formulario reutilizable-//
interface ContactFormProps {
  className?: string;
}

function ContactForm({ className = "" }: ContactFormProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-surface-container-low p-8 md:p-12 ${className}`}>
      {/* Accent decorativo */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-secondary-container/20 blur-3xl"></div>

      <form className="relative z-10 space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface/70">
              <T>Nombre completo</T>
            </label>
            <input
              className="w-full rounded-lg border-none bg-surface-container-highest p-4 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary"
              placeholder="Mateo Guerrero"
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface/70">
              <T>Nombre del restaurante</T>
            </label>
            <input
              className="w-full rounded-lg border-none bg-surface-container-highest p-4 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary"
              placeholder="La Hacienda"
              type="text"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface/70">
            <T>Correo electrónico</T>
          </label>
          <input
            className="w-full rounded-lg border-none bg-surface-container-highest p-4 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary"
            placeholder="mateo@lahacienda.com"
            type="email"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface/70">
            <T>¿Cómo podemos ayudar?</T>
          </label>
          <textarea
            className="w-full resize-none rounded-lg border-none bg-surface-container-highest p-4 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary"
            placeholder="Cuéntanos sobre tu plano de planta y necesidades de reservas..."
            rows={5}
          />
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-5 text-lg font-bold tracking-tight text-on-primary transition-all hover:opacity-90"
          type="submit"
        >
          <T>Enviar consulta</T>
          <PublicIcon name="arrowForward" />
        </button>
      </form>
    </div>
  );
}

//-aqui empieza seccion FAQCard para tarjetas de preguntas frecuentes-//
interface FAQCardProps {
  icon: "schedule" | "payments" | "devices";
  title: string;
  description: string;
}

function FAQCard({ icon, title, description }: FAQCardProps) {
  return (
    <div className="group cursor-default rounded-xl border border-transparent bg-surface-container-lowest p-10 transition-colors hover:border-outline-variant/20 hover:bg-surface">
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container/30 text-on-secondary-container">
        <PublicIcon name={icon} />
      </div>
      <h3 className="mb-4 text-xl font-bold">
        <T>{title}</T>
      </h3>
      <p className="font-light leading-relaxed text-on-surface-variant">
        <T>{description}</T>
      </p>
    </div>
  );
}




//-aqui empieza pagina ContactPage-//
export default function ContactPage() {
  const faqs: FAQCardProps[] = [
    {
      icon: "schedule",
      title: "Cronograma de Implementación",
      description: "La configuración típica para un restaurante estándar toma 48-72 horas, incluyendo la digitalización del plano de planta y la capacitación del personal.",
    },
    {
      icon: "payments",
      title: "Estructura de Precios",
      description: "No cobramos por comensal. Nuestra tarifa mensual plana incluye reservas ilimitadas, comensales ilimitados y soporte técnico prioritario 24/7.",
    },
    {
      icon: "devices",
      title: "Compatibilidad de Hardware",
      description: "Reserva Latina funciona en cualquier tablet, escritorio o dispositivo móvil moderno. No se requiere compra de hardware propietario.",
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <main className="mx-auto max-w-7xl px-8 py-20 lg:py-32">
        {/*-aqui empieza hero section-*/}
        <div className="mb-32 grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
              <T>Conecta con el Mánager.</T>
            </h1>
            <p className="max-w-md text-xl font-light leading-relaxed text-on-surface-variant">
              <T>Traemos la calidez de la hospitalidad latina a la precisión digital. Nuestro equipo está listo para ayudar en la transformación digital de tu restaurante.</T>
            </p>

            <div className="grid grid-cols-1 gap-12 pt-12">
              <ContactInfo
                label="Soporte Principal"
                value="hola@reservalatina.com"
                href="mailto:hola@reservalatina.com"
              />
              <ContactInfo
                label="Línea Concierge"
                value="+52 (55) 8421-9900"
                href="tel:+525584219900"
              />
              <SocialLinks />
            </div>
          </div>

          <ContactForm />
        </div>

        {/*-aqui empieza seccion FAQ-*/}
        <section>
          <div className="mb-16 flex flex-col items-baseline justify-between gap-8 md:flex-row">
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              <T>Preguntas comunes.</T>
            </h2>
            <Link
              href="#"
              className="border-b-2 border-primary pb-1 font-bold text-primary transition-all hover:border-secondary hover:text-secondary"
            >
              <T>Ver todo el Centro de Ayuda</T>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {faqs.map((faq) => (
              <FAQCard key={faq.title} {...faq} />
            ))}
          </div>
        </section>

     
      </main>
    </div>
  );
}

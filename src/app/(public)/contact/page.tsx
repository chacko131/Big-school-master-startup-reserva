/**
 * Archivo: page.tsx (contact)
 * Responsabilidad: Página de contacto con formulario, info y FAQ.
 * Tipo: UI
 */


import { PublicIcon } from "@/components/public/PublicIcon";
import { T } from "@/components/T";
import Link from "next/link";
import { ContactForm } from "./ContactForm";

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
      description: "Full Haus funciona en cualquier tablet, escritorio o dispositivo móvil moderno. No se requiere compra de hardware propietario.",
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
              <T>Nuestro equipo está listo para ayudarte en la configuración y puesta en marcha de Full Haus en tu restaurante.</T>
            </p>

            <div className="grid grid-cols-1 gap-12 pt-12">
              <ContactInfo
                label="Soporte Principal"
                value="info@fullhaus.es"
                href="mailto:info@fullhaus.es"
              />
              <ContactInfo
                label="Línea Concierge"
                value="+34 623 25 75 92"
                href="tel:+34623257592"
              />
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

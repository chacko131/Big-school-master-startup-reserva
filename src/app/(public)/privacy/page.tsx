/**
 * Archivo: page.tsx (privacy)
 * Responsabilidad: Página de política de privacidad de Full Haus.
 * Tipo: UI
 */

import { PublicPageShell } from "@/components/public/PublicPageShell";

//-aqui empieza pagina PrivacyPage y es para mostrar la política de privacidad-//
export default function PrivacyPage() {
  return (
    <PublicPageShell>
      <div className="mx-auto max-w-3xl space-y-10 py-12">
        <header>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary">Legal</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Política de Privacidad
          </h1>
          <p className="mt-4 text-sm text-on-surface-variant">Última actualización: junio 2026</p>
        </header>

        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low px-8 py-6 text-sm text-on-surface-variant">
          <strong className="text-on-surface">Nota:</strong> Este documento es un borrador temporal. El texto legal definitivo será redactado por un profesional y publicado antes del lanzamiento oficial.
        </div>

        {[
          {
            title: "1. Responsable del tratamiento",
            content: "Full Haus es el responsable del tratamiento de los datos personales recogidos a través de este sitio web y de la plataforma. Contacto: info@fullhaus.es",
          },
          {
            title: "2. Datos que recopilamos",
            content: "Recopilamos los datos necesarios para la prestación del servicio: nombre, correo electrónico, datos del restaurante y datos de pago procesados de forma segura a través de Stripe.",
          },
          {
            title: "3. Finalidad del tratamiento",
            content: "Los datos se utilizan para gestionar tu cuenta, procesar pagos, enviarte comunicaciones relacionadas con el servicio y mejorar la plataforma.",
          },
          {
            title: "4. Base legal",
            content: "El tratamiento se basa en la ejecución del contrato de servicio y, en su caso, en el consentimiento explícito del usuario.",
          },
          {
            title: "5. Conservación de datos",
            content: "Los datos se conservarán mientras dure la relación contractual y durante los plazos legalmente exigidos tras su finalización.",
          },
          {
            title: "6. Derechos del usuario",
            content: "Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición y portabilidad escribiendo a info@fullhaus.es.",
          },
          {
            title: "7. Transferencias internacionales",
            content: "Algunos proveedores de servicio (Stripe, Clerk, Vercel) pueden procesar datos fuera del Espacio Económico Europeo bajo garantías adecuadas.",
          },
        ].map(({ title, content }) => (
          <section key={title} className="space-y-2">
            <h2 className="text-lg font-bold text-primary">{title}</h2>
            <p className="leading-relaxed text-on-surface-variant">{content}</p>
          </section>
        ))}
      </div>
    </PublicPageShell>
  );
}
//-aqui termina pagina PrivacyPage-//

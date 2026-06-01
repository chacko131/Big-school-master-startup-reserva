/**
 * Archivo: page.tsx (terms)
 * Responsabilidad: Página de términos de uso de Full Haus.
 * Tipo: UI
 */

import { PublicPageShell } from "@/components/public/PublicPageShell";

//-aqui empieza pagina TermsPage y es para mostrar los términos de uso-//
export default function TermsPage() {
  return (
    <PublicPageShell>
      <div className="mx-auto max-w-3xl space-y-10 py-12">
        <header>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary">Legal</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Términos de Uso
          </h1>
          <p className="mt-4 text-sm text-on-surface-variant">Última actualización: junio 2026</p>
        </header>

        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low px-8 py-6 text-sm text-on-surface-variant">
          <strong className="text-on-surface">Nota:</strong> Este documento es un borrador temporal. El texto legal definitivo será redactado por un profesional y publicado antes del lanzamiento oficial.
        </div>

        {[
          {
            title: "1. Aceptación de los términos",
            content: "Al acceder y utilizar Full Haus, aceptas los presentes términos de uso. Si no estás de acuerdo, no debes utilizar la plataforma.",
          },
          {
            title: "2. Descripción del servicio",
            content: "Full Haus es una plataforma SaaS de gestión de reservas y operaciones para restaurantes. El servicio incluye un período de prueba gratuito de 60 días, tras el cual se aplican los planes de suscripción vigentes.",
          },
          {
            title: "3. Cuenta de usuario",
            content: "Eres responsable de mantener la confidencialidad de tus credenciales y de todas las actividades realizadas bajo tu cuenta.",
          },
          {
            title: "4. Uso aceptable",
            content: "Queda prohibido el uso de la plataforma para actividades ilícitas, la reventa del servicio sin autorización o cualquier acción que comprometa la seguridad de otros usuarios.",
          },
          {
            title: "5. Pagos y cancelaciones",
            content: "Los pagos se gestionan a través de Stripe. Puedes cancelar tu suscripción en cualquier momento desde el panel de configuración. No se realizan reembolsos por períodos parciales.",
          },
          {
            title: "6. Limitación de responsabilidad",
            content: "Full Haus no será responsable de pérdidas indirectas, lucro cesante o daños derivados del uso o imposibilidad de uso del servicio.",
          },
          {
            title: "7. Modificaciones",
            content: "Nos reservamos el derecho a modificar estos términos. Los cambios sustanciales serán notificados con al menos 30 días de antelación.",
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
//-aqui termina pagina TermsPage-//

/**
 * Archivo: page.tsx (cookies)
 * Responsabilidad: Página de política de cookies de Full Haus.
 * Tipo: UI
 */

import { PublicPageShell } from "@/components/public/PublicPageShell";

//-aqui empieza pagina CookiesPage y es para mostrar la política de cookies-//
export default function CookiesPage() {
  return (
    <PublicPageShell>
      <div className="mx-auto max-w-3xl space-y-10 py-12">
        <header>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary">Legal</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Política de Cookies
          </h1>
          <p className="mt-4 text-sm text-on-surface-variant">Última actualización: junio 2026</p>
        </header>

        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low px-8 py-6 text-sm text-on-surface-variant">
          <strong className="text-on-surface">Nota:</strong> Este documento es un borrador temporal. El texto legal definitivo será redactado por un profesional y publicado antes del lanzamiento oficial.
        </div>

        {[
          {
            title: "1. ¿Qué son las cookies?",
            content: "Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten recordar tus preferencias y mejorar tu experiencia.",
          },
          {
            title: "2. Cookies que utilizamos",
            content: "Utilizamos cookies estrictamente necesarias para el funcionamiento de la plataforma (autenticación, sesión) y cookies de análisis para mejorar el servicio. No utilizamos cookies de publicidad.",
          },
          {
            title: "3. Cookies de terceros",
            content: "Algunos de nuestros proveedores (Clerk para autenticación, Stripe para pagos) pueden instalar sus propias cookies. Consulta sus políticas para más información.",
          },
          {
            title: "4. Control de cookies",
            content: "Puedes configurar tu navegador para rechazar cookies o ser avisado cuando se instalen. Ten en cuenta que algunas funcionalidades de la plataforma pueden no estar disponibles si desactivas las cookies necesarias.",
          },
          {
            title: "5. Conservación",
            content: "Las cookies de sesión se eliminan al cerrar el navegador. Las cookies persistentes tienen una duración máxima de 12 meses.",
          },
          {
            title: "6. Contacto",
            content: "Para cualquier consulta sobre nuestra política de cookies, escríbenos a info@fullhaus.es.",
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
//-aqui termina pagina CookiesPage-//

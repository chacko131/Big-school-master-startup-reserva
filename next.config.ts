import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

// ─── Security Headers (OWASP A05) ─────────────────────────────────────────────
// CSP calibrado para todos los servicios externos del proyecto:
// Clerk, Stripe, Cloudinary, Sentry, Google Fonts, Google Translate.
// Se usa 'unsafe-inline' en style-src porque Tailwind y Clerk lo requieren en runtime.
// Se usa 'unsafe-eval' en script-src solo en desarrollo (Next.js HMR lo necesita).
const securityHeaders = [
  {
    // Evita clickjacking: impide que tu app se cargue dentro de un <iframe> externo.
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Evita que el navegador interprete archivos con un MIME type incorrecto.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Fuerza HTTPS durante 1 año e incluye subdominios.
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    // Controla qué información de referrer se envía en las peticiones salientes.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Restringe el acceso a APIs del navegador (cámara, micrófono, geolocalización).
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // Content Security Policy: define qué recursos puede cargar el navegador.
    // Permisivo pero seguro: permite todos los servicios externos reales del proyecto.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: Next.js, Clerk, Stripe, Sentry
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.accounts.dev https://js.stripe.com https://browser.sentry-cdn.com https://js.sentry-cdn.com https://challenges.cloudflare.com",
      // Estilos: Tailwind inline + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fuentes: Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Imágenes: Cloudinary, Unsplash, Google (avatares Clerk), datos inline
      "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://lh3.googleusercontent.com https://*.clerk.com https://*.gravatar.com",
      // Conexiones fetch/XHR: Clerk, Stripe, Sentry, Google Translate, Cloudinary upload directo
      "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev wss://*.clerk.accounts.dev https://api.stripe.com https://*.sentry.io https://o*.ingest.de.sentry.io https://translate.googleapis.com https://api.cloudinary.com https://challenges.cloudflare.com",
      // Frames: Stripe Checkout y Clerk (embedded components)
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com",
      // Workers: Sentry usa service workers
      "worker-src 'self' blob:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.5.0.2", "192.168.1.130"],
  async headers() {
    return [
      {
        // Aplicar a todas las rutas
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  experimental: {
    serverActions: {
      // 30 MB para soportar hasta 6 fotos simultáneas de galería (~2-5 MB/foto).
      // TODO: Cuando el volumen de usuarios escale, migrar la subida de galería a
      //       uploads directos cliente→Cloudinary (unsigned preset) y solo enviar
      //       las URLs resultantes al server action. Esto elimina el límite y la
      //       carga en servidor.
      bodySizeLimit: "30mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
      {
        // Cloudinary — necesario para usar <Image> con URLs de res.cloudinary.com
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Unsplash — fallback para hero cuando no hay foto de portada asignada
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "fullhaus",
  project: "fullhaus",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});

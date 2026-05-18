/**
 * Archivo: proxy.ts
 * Responsabilidad: Interceptar todas las peticiones y aplicar la autenticación de Clerk.
 * Tipo: servicio
 */

import { clerkMiddleware } from "@clerk/nextjs/server";

//-aqui empieza el middleware de Clerk y es para proteger las rutas de la aplicacion-//
export default clerkMiddleware();
//-aqui termina el middleware de Clerk-//

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

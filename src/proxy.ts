/**
 * Archivo: proxy.ts
 * Responsabilidad: Interceptar todas las peticiones y aplicar la autenticación de Clerk.
 * Tipo: servicio
 */

import { clerkMiddleware } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

//-aqui empieza el middleware de Clerk y es para proteger las rutas de la aplicacion-//
/**
 * Extiende el middleware de Clerk para inyectar el pathname actual como header `x-pathname`.
 * Esto permite que los Server Components del layout lean la ruta activa sin usePathname.
 */
export default clerkMiddleware((auth, req: NextRequest) => {
  const response = NextResponse.next({
    request: {
      headers: new Headers({
        ...Object.fromEntries(req.headers.entries()),
        "x-pathname": req.nextUrl.pathname,
      }),
    },
  });
  return response;
});
//-aqui termina el middleware de Clerk-//

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

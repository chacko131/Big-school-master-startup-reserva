/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el formulario de login de Clerk para el acceso B2B.
 * Tipo: UI
 */

import { SignIn } from "@clerk/nextjs";

//-aqui empieza pagina SignInPage y es para mostrar el formulario real de autenticacion de Clerk-//
/**
 * Renderiza el componente de login de Clerk centrado en pantalla.
 * Usa catch-all route requerida por Clerk para su routing interno.
 */
export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <SignIn />
    </main>
  );
}
//-aqui termina pagina SignInPage-//

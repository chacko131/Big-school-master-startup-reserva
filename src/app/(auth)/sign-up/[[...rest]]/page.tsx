/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el formulario de registro de Clerk para el alta del restaurante.
 * Tipo: UI
 */

import { SignUp } from "@clerk/nextjs";

//-aqui empieza pagina SignUpPage y es para mostrar el formulario real de registro de Clerk-//
/**
 * Renderiza el componente de registro de Clerk centrado en pantalla.
 * Usa catch-all route requerida por Clerk para su routing interno.
 */
export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <SignUp />
    </main>
  );
}
//-aqui termina pagina SignUpPage-//

/**
 * Archivo: page.tsx
 * Responsabilidad: Callback de aceptación de invitación. Valida el token y activa la membership.
 *   El invitado llega aquí tras hacer clic en el email → se loguea con Clerk → acepta.
 * Tipo: UI
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/modules/auth/get-current-user";
import { getUsersInfrastructure } from "@/modules/users/infrastructure/users-infrastructure";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";
import { getNotificationsInfrastructure } from "@/modules/notifications/infrastructure/notifications-infrastructure";
import { AcceptTeamInvitation } from "@/modules/users/application/use-cases/AcceptTeamInvitation/accept-team-invitation.use-case";
import { UserValidationError } from "@/modules/users/domain/errors/user-validation.error";

interface AcceptInvitePageProps {
  searchParams: Promise<{ token?: string }>;
}

//-aqui empieza pagina AcceptInvitePage y es para procesar la aceptacion de la invitacion al equipo-//
/**
 * Página server que acepta el token, activa la membership y redirige al dashboard.
 * Si el usuario no está autenticado, Clerk lo redirige a /sign-in con redirect_url de vuelta aquí.
 * @sideEffect
 */
export default async function AcceptInvitePage({ searchParams }: AcceptInvitePageProps) {
  const { token } = await searchParams;

  if (!token || token.trim().length === 0) {
    redirect("/dashboard");
  }

  let currentUser;
  try {
    currentUser = await requireCurrentUser();
  } catch {
    redirect(`/sign-in?redirect_url=/invite/accept?token=${token}`);
  }

  const { membershipRepository, invitationTokenRepository, userRepository } = getUsersInfrastructure();
  const { restaurantRepository } = getCatalogInfrastructure();
  const { notificationProvider } = getNotificationsInfrastructure();

  const useCase = new AcceptTeamInvitation({
    membershipRepository,
    invitationTokenRepository,
    userRepository,
    restaurantRepository,
    notificationProvider,
  });

  let success = false;
  try {
    await useCase.execute({
      token,
      acceptingUserId: currentUser.id,
      acceptingUserEmail: currentUser.email,
    });
    success = true;
  } catch (error) {
    const message =
      error instanceof UserValidationError
        ? error.message
        : "El enlace de invitación no es válido o ha expirado.";

    return (
      <main className="flex min-h-screen items-center justify-center bg-surface p-8">
        <div className="w-full max-w-md rounded-[28px] bg-surface-container-lowest p-10 text-center shadow-xl">
          <p className="text-4xl">⚠️</p>
          <h1 className="mt-4 text-xl font-black tracking-tight text-primary">
            Invitación no válida
          </h1>
          <p className="mt-3 text-sm leading-7 text-on-surface-variant">{message}</p>
          <Link
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary hover:opacity-90"
            href="/dashboard"
          >
            Ir al dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (success) {
    redirect("/dashboard?inviteAccepted=1");
  }
}
//-aqui termina pagina AcceptInvitePage-//

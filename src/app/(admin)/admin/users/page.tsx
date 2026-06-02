/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista de usuarios globales del panel SaaS con datos reales.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { AdminMetricCard } from "@/components/admin/resumen/AdminMetricCard";
import { getAdminUsersData, type AdminUserRow } from "./actions";

//-aqui empieza constante userAccessDefinitions-//
const userAccessDefinitions = [
  {
    title: "Acceso global",
    description: "Vista consolidada para controlar roles y membresías multi-tenant.",
  },
  {
    title: "Revisión de pertenencia",
    description: "Detectar usuarios con acceso en más de un restaurante si aplica.",
  },
  {
    title: "Soporte interno",
    description: "Facilitar desbloqueos o validaciones manuales desde plataforma.",
  },
] as const;
//-aqui termina constante userAccessDefinitions-//

//-aqui empieza funcion formatRole y es para traducir el rol de membership a texto legible-//
/**
 * Traduce el MembershipRole a un label legible para la tabla.
 * @pure
 */
function formatRole(role: string | null, globalRole: string): string {
  if (globalRole === "SUPER_ADMIN") return "Super Admin";
  if (!role) return "—";

  const roleLabels: Record<string, string> = {
    RESTAURANT_OWNER: "Owner",
    MANAGER: "Manager",
    STAFF_WAITER: "Mesero",
    STAFF_KITCHEN: "Cocina",
    STAFF_BAR: "Bar",
  };

  return roleLabels[role] ?? role;
}
//-aqui termina funcion formatRole-//

//-aqui empieza componente UserAccessRail y es para mostrar el control de accesos-//
/**
 * Renderiza las notas de control del panel de usuarios.
 * @pure
 */
function UserAccessRail() {
  return (
    <section className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        <T>Accesos</T>
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
        <T>Gobierno de cuentas</T>
      </h2>

      <div className="mt-6 space-y-4">
        {userAccessDefinitions.map((accessDefinition) => (
          <article className="rounded-2xl bg-surface-container-low p-4" key={accessDefinition.title}>
            <h3 className="text-sm font-bold text-on-surface">
              <T>{accessDefinition.title}</T>
            </h3>
            <p className="mt-1 text-sm leading-6 text-on-surface-variant">
              <T>{accessDefinition.description}</T>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente UserAccessRail-//

//-aqui empieza componente UserTableRow y es para renderizar una fila de usuario en la tabla-//
/**
 * Renderiza una fila de la tabla de usuarios.
 * @pure
 */
function UserTableRow({ user }: { user: AdminUserRow }) {
  return (
    <div className="grid grid-cols-5 gap-4 px-4 py-4 text-sm" key={user.id}>
      <span className="font-semibold text-on-surface">
        {user.fullName ?? "—"}
      </span>
      <span className="truncate text-on-surface-variant">
        {user.email}
      </span>
      <span className="font-semibold text-primary">
        <T>{formatRole(user.primaryRole, user.globalRole)}</T>
      </span>
      <span className="text-on-surface-variant">
        {user.primaryTenantName ?? "—"}
      </span>
      <span className="font-semibold text-on-surface">
        <T>{user.derivedStatus}</T>
      </span>
    </div>
  );
}
//-aqui termina componente UserTableRow-//

//-aqui empieza pagina AdminUsersPage y es para listar usuarios globales con datos reales-//
/**
 * Renderiza la vista de usuarios del panel admin con datos reales de la base de datos.
 *
 * TODO: El estado "Revisar" no existe en el schema actual. No hay un reviewStatus
 * en User ni Membership. Si se necesita, requiere cambio de Prisma schema.
 */
export default async function AdminUsersPage() {
  const { stats, users } = await getAdminUsersData();

  return (
    <>
      <section className="rounded-[28px] bg-secondary-container px-6 py-8 shadow-sm md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
              <T>Usuarios globales</T>
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-primary md:text-5xl">
              <T>Control de membresías</T>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-7 text-on-surface-variant">
              <T>Vista para revisar acceso, roles y pertenencia a tenants en todo el SaaS.</T>
            </p>
          </div>

          <div className="rounded-[24px] bg-surface-container-low p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              <T>Auditoría</T>
            </p>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              <T>Más adelante esta pantalla alimentará procesos de soporte, desbloqueo y revisión manual de cuentas.</T>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          label="Usuarios totales"
          value={String(stats.totalUsers)}
          caption="cuentas registradas en la plataforma"
          tone="primary"
        />
        <AdminMetricCard
          label="Owners"
          value={String(stats.totalOwners)}
          caption="cuentas con rol propietario activo"
          tone="secondary"
        />
        <AdminMetricCard
          label="Staff activo"
          value={String(stats.totalActiveStaff)}
          caption="usuarios operativos en restaurantes"
          tone="surface"
        />
        <AdminMetricCard
          label="Invitaciones pendientes"
          value={String(stats.totalPendingInvitations)}
          caption="memberships pendientes de aceptar"
          tone="warning"
        />
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-[28px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            <T>Listado</T>
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-primary">
            <T>Usuarios y roles</T>
          </h2>

          <div className="mt-6 overflow-hidden rounded-[24px] border border-outline-variant/20">
            <div className="grid grid-cols-5 gap-4 border-b border-outline-variant/20 bg-surface-container-low px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
              <span>
                <T>Nombre</T>
              </span>
              <span>
                <T>Email</T>
              </span>
              <span>
                <T>Rol</T>
              </span>
              <span>
                <T>Tenant</T>
              </span>
              <span>
                <T>Estado</T>
              </span>
            </div>
            <div className="divide-y divide-outline-variant/20 bg-surface-container-lowest">
              {users.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-on-surface-variant">
                  <T>No hay usuarios registrados todavía.</T>
                </div>
              ) : (
                users.map((user) => (
                  <UserTableRow key={user.id} user={user} />
                ))
              )}
            </div>
          </div>
        </div>

        <UserAccessRail />
      </section>

      <button className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant/20 px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low" type="button">
        <OnboardingIcon name="person" className="h-4 w-4" />
        <T>Revisar accesos</T>
      </button>
    </>
  );
}
//-aqui termina pagina AdminUsersPage-//

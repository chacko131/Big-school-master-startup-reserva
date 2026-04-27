/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar la vista MVP de usuarios globales del panel SaaS.
 * Tipo: UI
 */

import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";

interface UserMetricDefinition {
  label: string;
  value: string;
  caption: string;
  tone: "primary" | "secondary" | "surface" | "warning";
}

interface UserRowDefinition {
  name: string;
  email: string;
  role: string;
  tenant: string;
  status: string;
}

interface UserAccessDefinition {
  title: string;
  description: string;
}

const userMetricDefinitions: ReadonlyArray<UserMetricDefinition> = [
  {
    label: "Usuarios totales",
    value: "412",
    caption: "cuentas activas y revisables",
    tone: "primary",
  },
  {
    label: "Owners",
    value: "128",
    caption: "cuentas con rol propietario",
    tone: "secondary",
  },
  {
    label: "Staff activo",
    value: "196",
    caption: "usuarios operativos en restaurantes",
    tone: "surface",
  },
  {
    label: "Invitados",
    value: "22",
    caption: "pendientes de verificación o acceso",
    tone: "warning",
  },
] as const;

const userRowDefinitions: ReadonlyArray<UserRowDefinition> = [
  {
    name: "Julian Rossi",
    email: "julian@casaluma.com",
    role: "Owner",
    tenant: "Casa Luma",
    status: "Activo",
  },
  {
    name: "Carla Méndez",
    email: "carla@taquerianorte.com",
    role: "Manager",
    tenant: "Taquería Norte",
    status: "Activo",
  },
  {
    name: "Leo Vargas",
    email: "leo@maresdelsur.com",
    role: "Host",
    tenant: "Mareas del Sur",
    status: "Revisar",
  },
  {
    name: "Ana Pineda",
    email: "ana@saborandino.com",
    role: "Support",
    tenant: "Sabor Andino",
    status: "Pendiente",
  },
] as const;

const userAccessDefinitions: ReadonlyArray<UserAccessDefinition> = [
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

//-aqui empieza funcion getUserToneClassName y es para pintar el tono de las metricas-//
/**
 * Devuelve la clase visual para el tono de una métrica de usuarios.
 *
 * @pure
 */
function getUserToneClassName(tone: UserMetricDefinition["tone"]): string {
  switch (tone) {
    case "primary":
      return "bg-primary text-on-primary";
    case "secondary":
      return "bg-secondary-container text-secondary";
    case "surface":
      return "bg-surface-container-low text-on-surface";
    case "warning":
      return "bg-warning-container text-warning";
    default:
      return "bg-surface-container-low text-on-surface";
  }
}
//-aqui termina funcion getUserToneClassName-//

//-aqui empieza componente UserMetricCard y es para mostrar una metrica de usuarios-//
interface UserMetricCardProps {
  label: string;
  value: string;
  caption: string;
  tone: UserMetricDefinition["tone"];
}

/**
 * Renderiza una tarjeta de métrica del panel de usuarios.
 *
 * @pure
 */
function UserMetricCard({ label, value, caption, tone }: UserMetricCardProps) {
  return (
    <article className={`rounded-[24px] px-5 py-6 shadow-sm ${getUserToneClassName(tone)}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-80">
        <T>{label}</T>
      </p>
      <p className="mt-3 text-4xl font-black tracking-tight">
        <T>{value}</T>
      </p>
      <p className="mt-2 text-sm leading-5 opacity-80">
        <T>{caption}</T>
      </p>
    </article>
  );
}
//-aqui termina componente UserMetricCard-//

//-aqui empieza componente UserAccessRail y es para mostrar el control de accesos-//
/**
 * Renderiza las notas de control del panel de usuarios.
 *
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

//-aqui empieza pagina AdminUsersPage y es para listar usuarios globales-//
/**
 * Renderiza la vista de usuarios del panel admin.
 */
export default function AdminUsersPage() {
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
        {userMetricDefinitions.map((metricDefinition) => (
          <UserMetricCard
            caption={metricDefinition.caption}
            key={metricDefinition.label}
            label={metricDefinition.label}
            tone={metricDefinition.tone}
            value={metricDefinition.value}
          />
        ))}
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
              {userRowDefinitions.map((userDefinition) => (
                <div className="grid grid-cols-5 gap-4 px-4 py-4 text-sm" key={userDefinition.email}>
                  <span className="font-semibold text-on-surface">
                    <T>{userDefinition.name}</T>
                  </span>
                  <span className="text-on-surface-variant">
                    {userDefinition.email}
                  </span>
                  <span className="font-semibold text-primary">
                    <T>{userDefinition.role}</T>
                  </span>
                  <span className="text-on-surface-variant">
                    <T>{userDefinition.tenant}</T>
                  </span>
                  <span className="font-semibold text-on-surface">
                    <T>{userDefinition.status}</T>
                  </span>
                </div>
              ))}
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

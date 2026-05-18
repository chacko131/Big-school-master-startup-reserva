/**
 * Archivo: TeamPermissionsPanel.tsx
 * Responsabilidad: Mostrar y editar los permisos de página por rol del restaurante
 *   en formato acordeón — un bloque colapsable por cada rol configurable.
 * Tipo: UI
 */

"use client";

import { useState, useTransition } from "react";
import { T } from "@/components/T";
import { type MembershipRole } from "@/modules/users/domain/entities/user-restaurant-membership.entity";
import { type DashboardSectionKey } from "@/constants/dashboard";

export interface PermissionRowView {
  role: MembershipRole;
  pageKey: DashboardSectionKey;
  canView: boolean;
  canEdit: boolean;
}

interface TeamPermissionsPanelProps {
  restaurantId: string;
  rows: PermissionRowView[];
  pageKeys: ReadonlyArray<{ key: DashboardSectionKey; label: string }>;
  upsertAction: (formData: FormData) => Promise<void>;
}

//-aqui empieza constante ROLE_META y es para mostrar nombre y descripcion de cada rol-//
const ROLE_META: Record<MembershipRole, { label: string; description: string; color: string }> = {
  RESTAURANT_OWNER: { label: "Propietario", description: "Acceso total siempre", color: "bg-primary/10 text-primary" },
  MANAGER:          { label: "Gerente",    description: "Gestión general del restaurante",  color: "bg-secondary/10 text-secondary" },
  STAFF_WAITER:     { label: "Camarero",   description: "Atención de sala y reservas",      color: "bg-tertiary/10 text-tertiary" },
  STAFF_KITCHEN:    { label: "Cocina",     description: "Operativa de cocina",              color: "bg-warning/10 text-warning" },
  STAFF_BAR:        { label: "Barra",      description: "Gestión de barra y bebidas",       color: "bg-success/10 text-success" },
};
//-aqui termina constante ROLE_META-//

const CONFIGURABLE_ROLES: ReadonlyArray<MembershipRole> = [
  "MANAGER", "STAFF_WAITER", "STAFF_KITCHEN", "STAFF_BAR",
];

//-aqui empieza componente PermissionToggle y es para un toggle pill de Ver/Editar por seccion-//
/**
 * Toggle que llama al server action inmediatamente al cambiar.
 */
function PermissionToggle({
  restaurantId,
  role,
  pageKey,
  field,
  checked,
  peerChecked,
  upsertAction,
}: {
  restaurantId: string;
  role: MembershipRole;
  pageKey: DashboardSectionKey;
  field: "canView" | "canEdit";
  checked: boolean;
  peerChecked: boolean;
  upsertAction: (formData: FormData) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newValue = !checked;
    const fd = new FormData();
    fd.set("restaurantId", restaurantId);
    fd.set("role", role);
    fd.set("pageKey", pageKey);

    if (field === "canView") {
      fd.set("canView", String(newValue));
      fd.set("canEdit", String(peerChecked && newValue));
    } else {
      fd.set("canView", String(newValue ? true : peerChecked));
      fd.set("canEdit", String(newValue));
    }

    startTransition(() => void upsertAction(fd));
  };

  const label = field === "canView" ? "Ver" : "Editar";
  const activeClass = field === "canView"
    ? "bg-primary/15 text-primary border-primary/30"
    : "bg-secondary/15 text-secondary border-secondary/30";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={isPending}
      onClick={handleToggle}
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        checked
          ? activeClass
          : "border-outline-variant/30 bg-surface text-on-surface-variant hover:bg-surface-container",
      ].join(" ")}
    >
      <span className={[
        "h-1.5 w-1.5 rounded-full transition-colors",
        checked ? "bg-current" : "bg-outline-variant",
      ].join(" ")} />
      <T>{label}</T>
    </button>
  );
}
//-aqui termina componente PermissionToggle-//

//-aqui empieza componente RoleAccordionItem y es para un bloque colapsable de permisos por rol-//
/**
 * Bloque colapsable que muestra la lista de secciones con sus toggles para un rol.
 */
function RoleAccordionItem({
  restaurantId,
  role,
  pageKeys,
  index,
  upsertAction,
}: {
  restaurantId: string;
  role: MembershipRole;
  pageKeys: ReadonlyArray<{ key: DashboardSectionKey; label: string }>;
  index: Map<string, PermissionRowView>;
  upsertAction: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const meta = ROLE_META[role];

  const enabledCount = pageKeys.filter(({ key }) => index.get(`${role}::${key}`)?.canView).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-container/50"
        aria-expanded={open}
      >
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${meta.color}`}>
          {meta.label}
        </span>
        <span className="flex-1">
          <span className="block text-sm font-medium text-on-surface">{meta.description}</span>
          <span className="text-xs text-on-surface-variant">
            {enabledCount === 0
              ? "Sin acceso a ninguna sección"
              : `Acceso a ${enabledCount} de ${pageKeys.length} secciones`}
          </span>
        </span>
        <svg
          className={`h-4 w-4 text-on-surface-variant transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-outline-variant/10 px-5 pb-4 pt-2">
          <div className="space-y-1">
            {pageKeys.map(({ key, label }) => {
              const row = index.get(`${role}::${key}`);
              const canView = row?.canView ?? false;
              const canEdit = row?.canEdit ?? false;
              return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-container/40"
                >
                  <span className="text-sm font-medium text-on-surface">
                    <T>{label}</T>
                  </span>
                  <div className="flex items-center gap-2">
                    <PermissionToggle
                      restaurantId={restaurantId}
                      role={role}
                      pageKey={key}
                      field="canView"
                      checked={canView}
                      peerChecked={canEdit}
                      upsertAction={upsertAction}
                    />
                    <PermissionToggle
                      restaurantId={restaurantId}
                      role={role}
                      pageKey={key}
                      field="canEdit"
                      checked={canEdit}
                      peerChecked={canView}
                      upsertAction={upsertAction}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-on-surface-variant/50">
            <T>Los cambios se guardan automáticamente.</T>
          </p>
        </div>
      )}
    </div>
  );
}
//-aqui termina componente RoleAccordionItem-//

//-aqui empieza componente TeamPermissionsPanel y es para mostrar la lista de roles como acordeon-//
/**
 * Panel principal de permisos. Renderiza un acordeón por cada rol configurable.
 * El propietario siempre tiene acceso total y no aparece en la lista.
 */
export function TeamPermissionsPanel({
  restaurantId,
  rows,
  pageKeys,
  upsertAction,
}: TeamPermissionsPanelProps) {
  //-aqui empieza buildIndex y es para indexar los rows para acceso O(1)-//
  const rowIndex = new Map<string, PermissionRowView>();
  for (const row of rows) {
    rowIndex.set(`${row.role}::${row.pageKey}`, row);
  }
  //-aqui termina buildIndex-//

  return (
    <div className="rounded-[20px] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
        <T>Control de acceso</T>
      </p>
      <h2 className="mt-1 text-lg font-black tracking-tight text-on-surface">
        <T>Permisos por rol</T>
      </h2>
      <p className="mt-1 mb-5 text-sm text-on-surface-variant">
        <T>Abre cada rol para configurar a qué secciones tiene acceso.</T>
      </p>

      <div className="space-y-2">
        {CONFIGURABLE_ROLES.map((role) => (
          <RoleAccordionItem
            key={role}
            restaurantId={restaurantId}
            role={role}
            pageKeys={pageKeys}
            index={rowIndex}
            upsertAction={upsertAction}
          />
        ))}
      </div>

      <p className="mt-4 text-xs text-on-surface-variant/50">
        <T>El propietario siempre tiene acceso total a todas las secciones.</T>
      </p>
    </div>
  );
}
//-aqui termina componente TeamPermissionsPanel-//

/**
 * Archivo: TeamMemberRoleSelect.tsx
 * Responsabilidad: Selector inline de rol para un miembro del equipo. Hace submit del form al cambiar.
 * Tipo: UI
 */

"use client";

import { useTransition } from "react";

export type MembershipRoleOption = {
  value: string;
  label: string;
};

interface TeamMemberRoleSelectProps {
  membershipId: string;
  currentRole: string;
  roles: ReadonlyArray<MembershipRoleOption>;
  disabled: boolean;
  updateAction: (formData: FormData) => Promise<void>;
}

//-aqui empieza componente TeamMemberRoleSelect y es para cambiar el rol de un miembro inline-//
/**
 * Select controlado que envía el formulario en cuanto cambia el valor.
 * Muestra estado de carga durante la transición.
 *
 * @sideEffect — llama a la server action updateAction
 */
export function TeamMemberRoleSelect({
  membershipId,
  currentRole,
  roles,
  disabled,
  updateAction,
}: TeamMemberRoleSelectProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const form = event.currentTarget.form;
    if (form === null) return;
    const formData = new FormData(form);
    startTransition(() => {
      void updateAction(formData);
    });
  }

  return (
    <form>
      <input name="membershipId" type="hidden" value={membershipId} />
      <select
        className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-3 py-1.5 text-xs font-semibold text-on-surface transition-opacity disabled:opacity-50"
        defaultValue={currentRole}
        disabled={disabled || isPending}
        name="newRole"
        onChange={handleChange}
      >
        {roles.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isPending && (
        <span className="ml-2 text-[10px] text-on-surface-variant">Guardando…</span>
      )}
    </form>
  );
}
//-aqui termina componente TeamMemberRoleSelect-//

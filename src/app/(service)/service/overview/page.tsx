/**
 * Archivo: page.tsx
 * Responsabilidad: Vista de control total para dueño y manager.
 * Tipo: UI (server) — placeholder hasta rediseño con Stitch
 */

import { requireServiceRole } from "@/modules/auth/require-service-role";

export default async function OverviewPage() {
  const { role } = await requireServiceRole(["RESTAURANT_OWNER", "MANAGER"]);

  const title = role === "RESTAURANT_OWNER" ? "Vista Propietario" : "Vista Manager";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface p-8 text-on-surface">
      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Módulo de Servicio</p>
      <h1 className="text-4xl font-black tracking-tight">{title}</h1>
      <p className="text-sm text-on-surface-variant">Rol: {role} — Diseño Stitch pendiente de implementar</p>
    </div>
  );
}

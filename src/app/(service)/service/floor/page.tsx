/**
 * Archivo: page.tsx
 * Responsabilidad: Vista de sala del mesero — muestra el estado de las mesas.
 * Tipo: UI (server) — placeholder hasta rediseño con Stitch
 */

import { requireServiceRole } from "@/modules/auth/require-service-role";

export default async function FloorPage() {
  const { role } = await requireServiceRole(["STAFF_WAITER"]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface p-8 text-on-surface">
      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Módulo de Servicio</p>
      <h1 className="text-4xl font-black tracking-tight">Vista Mesero</h1>
      <p className="text-sm text-on-surface-variant">Rol: {role} — Diseño Stitch pendiente de implementar</p>
    </div>
  );
}

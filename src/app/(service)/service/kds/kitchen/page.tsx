/**
 * Archivo: page.tsx
 * Responsabilidad: KDS de cocina — muestra la cola de ítems para el equipo de cocina.
 * Tipo: UI (server) — placeholder hasta rediseño con Stitch
 */

import { requireServiceRole } from "@/modules/auth/require-service-role";

export default async function KitchenKdsPage() {
  const { role } = await requireServiceRole(["STAFF_KITCHEN"]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 p-8 text-white">
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Módulo de Servicio</p>
      <h1 className="text-4xl font-black tracking-tight">KDS Cocina</h1>
      <p className="text-sm text-zinc-400">Rol: {role} — Diseño Stitch modo oscuro pendiente de implementar</p>
    </div>
  );
}

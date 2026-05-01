/**
 * Archivo: FloorPlanAuditLogPlaceholder.tsx
 * Responsabilidad: Placeholder visual para el historial de cambios del plano (audit log).
 *   Muestra claramente que esta feature está pendiente de implementación cuando el
 *   sistema de reservas y usuarios esté activo.
 * Tipo: UI
 */

//-aqui empieza componente FloorPlanAuditLogPlaceholder y es para indicar la feature de audit log pendiente-//
/**
 * Renderiza un placeholder de diseño premium que indica al equipo de desarrollo
 * que el historial de cambios (quién movió qué mesa y cuándo) está pendiente
 * de implementación junto con el sistema de reservas y autenticación de usuarios.
 *
 * @pure
 */
export function FloorPlanAuditLogPlaceholder() {
  return (
    <section
      aria-label="Historial de cambios — pendiente de implementación"
      className="relative overflow-hidden rounded-[32px] border-2 border-dashed border-amber-200 bg-amber-50/60 p-8"
    >
      {/* Etiqueta TODO */}
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 ring-1 ring-amber-200">
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          TODO · Pendiente
        </span>
        <h2 className="text-lg font-black tracking-tight text-amber-900">
          Historial de cambios del plano
        </h2>
      </div>

      {/* Descripción */}
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-amber-800">
        Esta sección mostrará un registro de auditoría con cada modificación realizada sobre el
        plano de mesas: qué mesa se movió, qué usuario lo hizo y en qué momento. Requiere que el
        sistema de reservas y la gestión de usuarios estén activos.
      </p>

      {/* Mock visual de la futura UI — filas skeleton */}
      <div className="space-y-3 opacity-40" aria-hidden="true">
        {[
          { time: "— : —", title: "Cambio de posición", desc: "Mesa movida en el plano" },
          { time: "— : —", title: "Estado actualizado", desc: "Mesa marcada como activa / inactiva" },
          { time: "— : —", title: "Zona reasignada", desc: "Mesa movida entre zonas del restaurante" },
        ].map((row, index) => (
          <div
            key={index}
            className="flex items-start gap-4 rounded-xl bg-white/70 p-4 ring-1 ring-amber-100"
          >
            <div className="w-14 shrink-0 rounded-lg bg-amber-100 px-2 py-1.5 text-center text-[10px] font-bold text-amber-600">
              {row.time}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900">{row.title}</p>
              <p className="mt-0.5 text-xs text-amber-700">{row.desc}</p>
            </div>
            <div className="h-4 w-20 rounded-md bg-amber-100" />
          </div>
        ))}
      </div>

      {/* Watermark decorativo */}
      <div
        className="pointer-events-none absolute right-8 top-8 select-none text-[80px] font-black leading-none text-amber-100"
        aria-hidden="true"
      >
        📋
      </div>
    </section>
  );
}
//-aqui termina componente FloorPlanAuditLogPlaceholder-//

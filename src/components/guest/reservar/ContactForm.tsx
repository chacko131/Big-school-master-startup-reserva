"use client";

/**
 * Archivo: ContactForm.tsx
 * Responsabilidad: Recoger los datos de contacto del cliente para finalizar la reserva.
 * Tipo: UI
 */

import Link from "next/link";
import { T } from "@/components/T";

//-aqui empieza funcion ContactForm y es para mostrar el formulario de datos del huésped-//
/**
 * @pure
 */
export function ContactForm() {
  return (
    <section className="space-y-8 border-t border-zinc-200 pt-8">
      <div className="flex items-center gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
          4
        </span>
        <h2 className="font-headline text-2xl font-bold">
          <T>Datos de Contacto</T>
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <label className="px-1 text-sm font-semibold text-on-surface">
            <T>Nombre completo</T>
          </label>
          <input
            className="h-14 w-full rounded-xl border-0 bg-surface-container-highest px-6 transition-all focus:ring-2 focus:ring-primary border-slate-100"
            placeholder="Ej. Juan Pérez"
            type="text"
          />
        </div>
        <div className="space-y-2">
          <label className="px-1 text-sm font-semibold text-on-surface">
            <T>Teléfono</T>
          </label>
          <input
            className="h-14 w-full rounded-xl border-0 bg-surface-container-highest px-6 transition-all focus:ring-2 focus:ring-primary border-slate-100"
            placeholder="+52 55..."
            type="tel"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="px-1 text-sm font-semibold text-on-surface">
          <T>Email (opcional)</T>
        </label>
        <input
          className="h-14 w-full rounded-xl border-0 bg-surface-container-highest px-6 transition-all focus:ring-2 focus:ring-primary border-slate-100"
          placeholder="email@ejemplo.com"
          type="email"
        />
      </div>

      <div className="space-y-2">
        <label className="px-1 text-sm font-semibold text-on-surface">
          <T>Notas o Peticiones Especiales</T>
        </label>
        <textarea
          className="min-h-32 w-full resize-none rounded-xl border-0 bg-surface-container-highest p-6 transition-all focus:ring-2 focus:ring-primary border-slate-100"
          placeholder="Cuéntanos si celebras algo o tienes alguna alergia..."
          rows={4}
        />
      </div>

      <div className="pt-6">
        <Link
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-12 py-5 font-headline text-xl font-extrabold text-on-primary transition-transform active:scale-95 md:w-auto shadow-xl shadow-primary/30"
          href="/reserva/confirmacion"
        >
          <T>Confirmar Reserva</T>
        </Link>
        <p className="mt-4 text-center text-xs text-on-surface/60 md:text-left">
          <T>
            Al reservar, aceptas nuestras políticas de cancelación y términos de
            servicio.
          </T>
        </p>
      </div>
    </section>
  );
}
//-aqui termina funcion ContactForm-//

/**
 * Archivo: ContactForm.tsx
 * Responsabilidad: Formulario de contacto con acción de envío via Resend
 * Tipo: UI (cliente)
 */

"use client";

import { useActionState } from "react";
import { sendContactEmail, type ContactFormState } from "./actions";
import { PublicIcon } from "@/components/public/PublicIcon";
import { T } from "@/components/T";

interface ContactFormProps {
  className?: string;
}

//-aqui empieza estado inicial del formulario-//
const initialState: ContactFormState = null;
//-aqui termina estado inicial-//

//-aqui empieza componente ContactForm-//
export function ContactForm({ className = "" }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    sendContactEmail,
    initialState
  );

  const isSuccess = state?.success === true;
  const isError = state?.success === false;
  const fieldErrors = isError ? state.fieldErrors : undefined;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-surface-container-low p-8 md:p-12 ${className}`}>
      {/* Accent decorativo */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-secondary-container/20 blur-3xl"></div>

      {/* Mensaje de estado del formulario */}
      {isSuccess && (
        <div className="relative z-10 mb-6 rounded-lg bg-green-100 p-4 text-green-800">
          <p className="font-semibold">{state.message}</p>
        </div>
      )}
      {isError && !fieldErrors && (
        <div className="relative z-10 mb-6 rounded-lg bg-red-100 p-4 text-red-800">
          <p className="font-semibold">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="relative z-10 space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface/70" htmlFor="name">
              <T>Nombre completo</T>
            </label>
            <input
              id="name"
              name="name"
              className="w-full rounded-lg border-none bg-surface-container-highest p-4 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary"
              placeholder="Mateo Guerrero"
              type="text"
              required
            />
            {fieldErrors?.name && (
              <p className="text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface/70" htmlFor="restaurant">
              <T>Nombre del restaurante</T>
            </label>
            <input
              id="restaurant"
              name="restaurant"
              className="w-full rounded-lg border-none bg-surface-container-highest p-4 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary"
              placeholder="La Hacienda"
              type="text"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface/70" htmlFor="email">
            <T>Correo electrónico</T>
          </label>
          <input
            id="email"
            name="email"
            className="w-full rounded-lg border-none bg-surface-container-highest p-4 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary"
            placeholder="mateo@lahacienda.com"
            type="email"
            required
          />
          {fieldErrors?.email && (
            <p className="text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface/70" htmlFor="message">
            <T>¿Cómo podemos ayudar?</T>
          </label>
          <textarea
            id="message"
            name="message"
            className="w-full resize-none rounded-lg border-none bg-surface-container-highest p-4 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary"
            placeholder="Cuéntanos sobre tu plano de planta y necesidades de reservas..."
            rows={5}
            required
          />
          {fieldErrors?.message && (
            <p className="text-sm text-red-600">{fieldErrors.message}</p>
          )}
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-5 text-lg font-bold tracking-tight text-on-primary transition-all hover:opacity-90 disabled:opacity-50"
          type="submit"
          disabled={isPending || isSuccess}
        >
          {isPending ? (
            <T>Enviando...</T>
          ) : isSuccess ? (
            <T>Enviado</T>
          ) : (
            <>
              <T>Enviar consulta</T>
              <PublicIcon name="arrowForward" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
//-aqui termina componente ContactForm-//

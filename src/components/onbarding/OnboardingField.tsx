/**
 * Archivo: OnboardingField.tsx
 * Responsabilidad: Estandarizar la presentación de campos del onboarding.
 * Tipo: UI
 */

import type { ReactNode } from "react";
import { T } from "@/components/T";

interface OnboardingFieldProps {
  htmlFor: string;
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

//-aqui empieza componente OnboardingField y es para encapsular etiquetas y ayudas de formulario-//
/**
 * Renderiza un campo del onboarding con su etiqueta, ayuda opcional y contenido.
 */
export function OnboardingField({ htmlFor, label, hint, className = "", children }: OnboardingFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-[11px] font-bold uppercase tracking-[0.22em] text-on-primary-container" htmlFor={htmlFor}>
        <T>{label}</T>
      </label>
      {children}
      {hint ? (
        <p className="text-[11px] leading-5 text-on-surface-variant">
          <T>{hint}</T>
        </p>
      ) : null}
    </div>
  );
}
//-aqui termina componente OnboardingField-//

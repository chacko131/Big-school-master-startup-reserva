/**
 * Archivo: NewReservationButton.tsx
 * Responsabilidad: Botón que abre el modal de nueva reserva (client boundary).
 * Tipo: UI
 */

"use client";

import { useState } from "react";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { NewReservationModal } from "./NewReservationModal";

//-aqui empieza componente NewReservationButton y es para disparar la apertura del modal-//
/**
 * Botón + modal para crear nueva reserva. Actúa como client boundary.
 * @sideEffect
 */
export function NewReservationButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:opacity-90"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <OnboardingIcon name="checkCircle" className="h-4 w-4" />
        <T>Nueva reserva</T>
      </button>

      <NewReservationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
//-aqui termina componente NewReservationButton-//

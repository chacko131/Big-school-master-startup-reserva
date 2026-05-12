"use client";

/**
 * Archivo: ReservationForm.tsx
 * Responsabilidad: Orquestador client del flujo de reserva pública.
 *   Centraliza el estado de partySize, date y time; conecta los pickers con el ContactForm
 *   y llama createGuestReservationAction al confirmar. En éxito navega a /reserva/confirmacion.
 * Tipo: UI
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PartySizePicker } from "@/components/guest/PartySizePicker";
import { DatePicker } from "@/components/guest/DatePicker";
import { TimeSlotPicker } from "@/components/guest/TimeSlotPicker";
import { ReservationContactForm } from "@/components/guest/reservar/ReservationContactForm";
import { ReservationSummary } from "@/components/guest/ReservationSummary";
import { createGuestReservationAction } from "@/app/(guest)/[restaurantSlug]/reservar/actions";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReservationFormProps {
  restaurantSlug: string;
  restaurantName: string;
  availableSlots: string[];
  closedDays: string[];
  defaultPartySize: number;
  defaultDate?: string;
  defaultTime?: string;
}

//-aqui empieza componente ReservationForm y es para orquestar el estado compartido de los pickers y el submit de la reserva-//
/**
 * @sideEffect — llama createGuestReservationAction y navega en éxito
 */
export function ReservationForm({
  restaurantSlug,
  restaurantName,
  availableSlots,
  closedDays,
  defaultPartySize,
  defaultDate,
  defaultTime,
}: ReservationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const todayStr = (() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  })();

  const [partySize, setPartySize] = useState<number>(defaultPartySize);
  const [date, setDate]           = useState<string>(defaultDate ?? todayStr);
  const [time, setTime]           = useState<string>(defaultTime ?? availableSlots[0] ?? "");

  const [submitError, setSubmitError]           = useState<string | null>(null);
  const [alternativeSlots, setAlternativeSlots] = useState<string[]>([]);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);

  //-aqui empieza funcion handleSubmit y es para enviar el formulario de reserva al servidor-//
  function handleSubmit(formData: FormData): void {
    formData.set("partySize", String(partySize));
    formData.set("date", date);
    formData.set("time", selectedAlternative ?? time);

    setSubmitError(null);
    setAlternativeSlots([]);

    const action = createGuestReservationAction.bind(null, restaurantSlug);

    startTransition(async () => {
      try {
        const result = await action(formData);
        if (result.success && typeof result.reservationId === "string" && result.reservationId.trim() !== "") {
          router.push(`/reserva/confirmacion?reservationId=${encodeURIComponent(result.reservationId)}`);
          return;
        }
        setSubmitError(result.error ?? "Error desconocido.");
        setAlternativeSlots(result.alternativeSlots ?? []);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error inesperado al crear la reserva.";
        setSubmitError(msg);
        setAlternativeSlots([]);
      }
    });
  }
  //-aqui termina funcion handleSubmit-//

  //-aqui empieza funcion handleTimeChange y es para sincronizar el picker de hora y limpiar alternativa seleccionada-//
  function handleTimeChange(newTime: string): void {
    setTime(newTime);
    setSelectedAlternative(null);
  }
  //-aqui termina funcion handleTimeChange-//

  //-aqui empieza funcion handleSelectAlternative y es para seleccionar un slot alternativo y reflejar en el picker-//
  function handleSelectAlternative(slot: string): void {
    setSelectedAlternative(slot);
    setTime(slot);
  }
  //-aqui termina funcion handleSelectAlternative-//

  return (
    <div className="flex flex-col gap-16 lg:flex-row">
      <div className="grow space-y-16 lg:max-w-2xl">
        <PartySizePicker
          defaultValue={partySize}
          onSelect={setPartySize}
        />
        <DatePicker
          defaultDate={date}
          closedDays={closedDays}
          onSelect={setDate}
        />
        <TimeSlotPicker
          slots={availableSlots}
          defaultTime={time}
          onSelect={handleTimeChange}
        />
        <ReservationContactForm
          isPending={isPending}
          submitError={submitError}
          alternativeSlots={alternativeSlots}
          selectedAlternative={selectedAlternative}
          onSelectAlternative={handleSelectAlternative}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="lg:w-96">
        <ReservationSummary
          restaurantName={restaurantName}
          partySize={partySize}
          date={date}
          time={selectedAlternative ?? time}
        />
      </div>
    </div>
  );
}
//-aqui termina componente ReservationForm-//

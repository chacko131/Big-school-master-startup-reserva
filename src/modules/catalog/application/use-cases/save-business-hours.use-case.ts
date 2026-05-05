/**
 * Archivo: save-business-hours.use-case.ts
 * Responsabilidad: Reemplazar todos los horarios de un restaurante por los proporcionados.
 * Tipo: lógica
 */

import { randomUUID } from "node:crypto";
import { BusinessHours, type DayOfWeek } from "../../domain/entities/business-hours.entity";
import { type BusinessHoursRepository } from "../ports/business-hours-repository.port";

export interface BusinessHourInput {
  day: DayOfWeek;
  opensAt: string;
  closesAt: string;
  isClosed: boolean;
}

export interface SaveBusinessHoursInput {
  restaurantId: string;
  hours: BusinessHourInput[];
}

//-aqui empieza funcion SaveBusinessHours y es para persistir los horarios completos del restaurante-//
/**
 * Elimina los horarios anteriores y guarda los nuevos en una operación atómica.
 * @sideEffect
 */
export class SaveBusinessHours {
  constructor(private readonly businessHoursRepository: BusinessHoursRepository) {}

  async execute(input: SaveBusinessHoursInput): Promise<void> {
    if (input.hours.length === 0) {
      await this.businessHoursRepository.deleteByRestaurantId(input.restaurantId);
      return;
    }

    const entities = input.hours.map((h) =>
      BusinessHours.create({
        id: randomUUID(),
        restaurantId: input.restaurantId,
        day: h.day,
        opensAt: h.isClosed ? "00:00" : h.opensAt,
        closesAt: h.isClosed ? "00:00" : h.closesAt,
        isClosed: h.isClosed,
      })
    );

    await this.businessHoursRepository.saveAll(entities);
  }
}
//-aqui termina funcion SaveBusinessHours-//

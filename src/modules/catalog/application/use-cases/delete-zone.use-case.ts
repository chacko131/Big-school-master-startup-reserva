/**
 * Archivo: delete-zone.use-case.ts
 * Responsabilidad: Eliminar una zona de restaurante por su identificador.
 * Tipo: lógica
 */

import { type ZoneRepository } from "../ports/zone-repository.port";

interface DeleteZoneInput {
  zoneId: string;
}

//-aqui empieza caso de uso DeleteZone y es para eliminar una zona del restaurante-//
/**
 * Elimina una zona por ID. Las mesas asociadas quedan con zoneId=null por la regla OnDelete: SetNull de la BD.
 * @sideEffect
 */
export class DeleteZone {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  async execute(input: DeleteZoneInput): Promise<void> {
    if (input.zoneId.trim().length === 0) {
      throw new Error("zoneId is required to delete a zone.");
    }

    await this.zoneRepository.delete(input.zoneId);
  }
}
//-aqui termina caso de uso DeleteZone-//

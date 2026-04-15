/**
 * Archivo: guest-repository.port.ts
 * Responsabilidad: Definir el puerto de persistencia para huéspedes.
 * Tipo: lógica
 */

import { Guest } from "../../domain/entities/guest.entity";

export interface GuestRepository {
  findById(id: string): Promise<Guest | null>;
  save(guest: Guest): Promise<Guest>;
}

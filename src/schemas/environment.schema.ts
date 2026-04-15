/**
 * Archivo: environment.schema.ts
 * Responsabilidad: Validar las variables de entorno mínimas necesarias para la infraestructura.
 * Tipo: lógica
 */

import { z } from "zod";

export const environmentSchema = z.object({
  DATABASE_URL: z.string().trim().min(1, "DATABASE_URL is required."),
});

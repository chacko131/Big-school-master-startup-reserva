/**
 * Archivo: price-range.ts
 * Responsabilidad: Constantes y utilidades para rangos de precio de restaurantes
 * Tipo: constants
 */

import { type PriceRange } from "@/modules/catalog/domain/entities/restaurant.entity";

export interface PriceRangeOption {
  value: PriceRange;
  label: string;
  description: string;
}

export const PRICE_RANGE_OPTIONS: ReadonlyArray<PriceRangeOption> = [
  { value: "BUDGET", label: "€", description: "Menos de 15 € por persona" },
  { value: "MODERATE", label: "€€", description: "15 – 35 € por persona" },
  { value: "UPSCALE", label: "€€€", description: "35 – 60 € por persona" },
  { value: "FINE_DINING", label: "€€€€", description: "Más de 60 € por persona" },
];

//-aqui empieza funcion getPriceRangeLabel y es para obtener la etiqueta €, €€, etc.-//
/**
 * @pure
 */
export function getPriceRangeLabel(priceRange: PriceRange | null | undefined): string {
  if (!priceRange) return "";
  return PRICE_RANGE_OPTIONS.find((opt) => opt.value === priceRange)?.label ?? "";
}
//-aqui termina funcion getPriceRangeLabel-//

//-aqui empieza funcion getPriceRangeDescription y es para obtener la descripcion numerica del rango-//
/**
 * @pure
 */
export function getPriceRangeDescription(priceRange: PriceRange | null | undefined): string {
  if (!priceRange) return "";
  return PRICE_RANGE_OPTIONS.find((opt) => opt.value === priceRange)?.description ?? "";
}
//-aqui termina funcion getPriceRangeDescription-//

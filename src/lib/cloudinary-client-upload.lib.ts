/**
 * Archivo: cloudinary-client-upload.lib.ts
 * Responsabilidad: Subir un archivo directamente a la API de Cloudinary desde el navegador.
 *                  Recibe una firma generada por el servidor — el API secret nunca sale
 *                  del servidor. Solo envía bytes a Cloudinary, sin pasar por Next.js.
 * Tipo: lib (función pura con side-effect de red — solo en cliente)
 */

import { type RestaurantImage } from "@/modules/catalog/domain/entities/restaurant.entity";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface CloudinaryUploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

interface CloudinaryUploadApiResponse {
  secure_url: string;
  public_id: string;
}

// ─── Función principal ────────────────────────────────────────────────────────

//-aqui empieza funcion uploadFileToCloudinary y es para subir un File directamente a Cloudinary desde el navegador-//
/**
 * Sube un archivo a Cloudinary usando una firma generada por el servidor.
 * El API secret nunca llega al cliente — solo se usa la firma resultante.
 *
 * @pure false — realiza una petición de red
 */
export async function uploadFileToCloudinary(
  file: File,
  signature: CloudinaryUploadSignature
): Promise<RestaurantImage> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`;

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`[Cloudinary] Error al subir imagen: ${response.status} — ${errorBody}`);
  }

  const result = (await response.json()) as CloudinaryUploadApiResponse;

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}
//-aqui termina funcion uploadFileToCloudinary-//

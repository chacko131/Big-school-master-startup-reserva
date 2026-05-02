/**
 * Archivo: cloudinary.service.ts
 * Responsabilidad: Centralizar la integración con Cloudinary para subida y eliminación de imágenes.
 * Tipo: servicio
 */

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

// Cloudinary tomará automáticamente la variable de entorno CLOUDINARY_URL
// si existe, pero podemos asegurarnos de que use https.
cloudinary.config({
  secure: true,
});

export interface UploadImageResult {
  url: string;
  publicId: string;
}

export const cloudinaryService = {
  //-aqui empieza funcion uploadImage y es para subir un archivo File (desde un FormData) a Cloudinary-//
  /**
   * Sube una imagen a Cloudinary desde un objeto File nativo de la web.
   * Útil para usarse directamente dentro de Server Actions en Next.js.
   * @sideEffect
   */
  async uploadImage(file: File, folder: string): Promise<UploadImageResult> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folder },
        (error, result?: UploadApiResponse) => {
          if (error) {
            reject(error);
            return;
          }
          if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            reject(new Error("Error desconocido al subir imagen a Cloudinary: no hay resultado."));
          }
        }
      );

      uploadStream.end(buffer);
    });
  },
  //-aqui termina funcion uploadImage-//

  //-aqui empieza funcion uploadBase64Image y es para subir una imagen en formato base64 a Cloudinary-//
  /**
   * Sube una imagen a Cloudinary usando una cadena en base64.
   * @sideEffect
   */
  async uploadBase64Image(base64String: string, folder: string): Promise<UploadImageResult> {
    const result = await cloudinary.uploader.upload(base64String, {
      folder,
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  },
  //-aqui termina funcion uploadBase64Image-//

  //-aqui empieza funcion deleteImage y es para eliminar permanentemente una imagen de Cloudinary mediante su ID-//
  /**
   * Elimina una imagen de Cloudinary usando su publicId.
   * @sideEffect
   */
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      // result.result suele ser "ok" si se eliminó correctamente o "not found"
      return result.result === "ok";
    } catch (error) {
      console.error("Error al eliminar la imagen en Cloudinary:", error);
      return false;
    }
  },
  //-aqui termina funcion deleteImage-//

  //-aqui empieza funcion extractPublicIdFromUrl y es para sacar el ID de la URL guardada en DB-//
  /**
   * Extrae el publicId de una URL segura de Cloudinary.
   * Util para poder borrar imágenes cuando en la DB solo guardamos la URL completa.
   * @pure
   */
  extractPublicIdFromUrl(url: string): string | null {
    try {
      // Ejemplo de URL: https://res.cloudinary.com/df8u5wrwe/image/upload/v1715000000/folder/subfolder/image_name.jpg
      const parts = url.split("/upload/");
      if (parts.length !== 2) return null;

      // parts[1] = "v1715000000/folder/subfolder/image_name.jpg"
      const urlWithoutUpload = parts[1];
      
      // Quitamos la versión (vXXXXXXX/)
      const pathWithoutVersion = urlWithoutUpload.replace(/^v\d+\//, "");
      
      // Quitamos la extensión (.jpg, .png, etc)
      const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf("."));
      
      // Si no hay extensión, devolvemos el string completo
      return publicId || pathWithoutVersion;
    } catch (error) {
      return null;
    }
  }
  //-aqui termina funcion extractPublicIdFromUrl-//
};

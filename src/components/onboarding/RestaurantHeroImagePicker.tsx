/**
 * Archivo: RestaurantHeroImagePicker.tsx
 * Responsabilidad: Convertir la imagen de portada del onboarding en un selector de imagen
 *   interactivo. El usuario puede hacer clic en la foto para cambiarla; si no lo hace,
 *   la imagen por defecto se usará al enviar el formulario.
 * Tipo: UI (Client Component)
 */

"use client";

import { useState, useCallback, useEffect } from "react";

// ─── Constantes ─────────────────────────────────────────────────────────────

const DEFAULT_HERO_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAEvBWiEo9SMYt3pMijHVngt4jLuAeL8bjtsPYz05vIgvKEFAGiRxSVsvp8WaCslUrmCvdbi9TV1BLLx5X-frrP-AxwiH4pLkgu-8zt30jFxuukuo8lGRZA3Ul0kBSD-eg9qc_BrXg7_eYmVhAku1QICwJEKQBUExIuQowY3vzvdTvzpJ40vWapud419pHNTGxhKnCYIemxv_Lj3_hwzpfnKFa8GcpLoRtwkhPsTJggwWgcm6oZ6SE-tN725UUrCvgudKpDDgO4yiw";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface RestaurantHeroImagePickerProps {
  /** ID del <input type="file"> oculto dentro del <form> padre */
  fileInputId: string;
  /** ID del <form> al que pertenece este input (atributo HTML form="") */
  formId: string;
  /**
   * URL de la imagen ya persistida en BD. Se usa como fuente inicial cuando el
   * usuario regresa al paso de onboarding sin haber seleccionado un archivo nuevo.
   */
  initialImageUrl?: string | null;
}

// ─── Componente ──────────────────────────────────────────────────────────────

//-aqui empieza componente RestaurantHeroImagePicker y es para gestionar el picker de foto de portada en el onboarding-//
/**
 * Renderiza la foto de portada del restaurante como un área interactiva.
 * Al hacer clic, activa el input de archivo oculto que vive en el form padre.
 * Muestra un preview inmediato de la imagen seleccionada.
 */
export function RestaurantHeroImagePicker({
  fileInputId,
  formId,
  initialImageUrl,
}: RestaurantHeroImagePickerProps) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Si hay imagen persistida en BD y el usuario no ha elegido una nueva, la mostramos.
  const resolvedInitialSrc = initialImageUrl ?? DEFAULT_HERO_SRC;
  const hasPersistedImage = Boolean(initialImageUrl);

  // Log solo en el primer render (mount) para confirmar hidratación desde BD.
  useEffect(() => {
    if (hasPersistedImage && initialImageUrl) {
      console.log("[HeroImagePicker] Imagen persistida cargada desde BD:", initialImageUrl);
    } else {
      console.log("[HeroImagePicker] Sin imagen persistida — mostrando por defecto.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //-aqui empieza funcion handleFileChange y es para leer el archivo seleccionado y generar preview-//
  /**
   * Lee el archivo seleccionado con FileReader para mostrar un preview inmediato.
   * @sideEffect
   */
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        console.log("[HeroImagePicker] No se seleccionó ningún archivo.");
        return;
      }

      console.log("[HeroImagePicker] Archivo seleccionado:", {
        name: file.name,
        type: file.type,
        sizeKB: (file.size / 1024).toFixed(2),
      });

      if (!file.type.startsWith("image/")) {
        console.warn(
          "[HeroImagePicker] El archivo no es una imagen válida:",
          file.type
        );
        return;
      }

      setSelectedFileName(file.name);

      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewSrc(result);
        console.log(
          "[HeroImagePicker] Preview generado correctamente para:",
          file.name
        );
      };

      reader.onerror = () => {
        console.error(
          "[HeroImagePicker] Error al leer el archivo para el preview."
        );
      };

      reader.readAsDataURL(file);
    },
    []
  );
  //-aqui termina funcion handleFileChange-//

  // Preview nuevo > imagen de BD > imagen por defecto
  const displayedSrc = previewSrc ?? resolvedInitialSrc;
  // Hay imagen "custom" si el usuario seleccionó una nueva O si hay una persistida en BD
  const hasCustomImage = previewSrc !== null || hasPersistedImage;

  return (
    <div className="flex flex-col gap-3">
      {/*
       * El <label> apunta al input oculto del form mediante htmlFor.
       * cursor-pointer + role="button" comunica la interactividad.
       */}
      <label
        htmlFor={fileInputId}
        aria-label="Haz clic para elegir una foto de portada"
        className="relative block cursor-pointer overflow-hidden rounded-2xl bg-surface-container-high shadow-[0_20px_40px_rgba(26,28,28,0.08)] focus-within:ring-2 focus-within:ring-primary"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ─── Imagen (default o preview) ─────────────────────────────── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={
            hasCustomImage
              ? `Preview de tu foto: ${selectedFileName}`
              : "Interior elegante de un restaurante con iluminación cálida y mesas preparadas"
          }
          className="h-auto w-full object-cover transition-transform duration-500"
          style={{ transform: isHovered ? "scale(1.03)" : "scale(1)" }}
          src={displayedSrc}
        />

        {/* ─── Gradiente base ─────────────────────────────────────────── */}
        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent" />

        {/* ─── Overlay de interacción (hover / estado) ─────────────────── */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-300"
          style={{ opacity: isHovered ? 1 : 0.7 }}
        >
          {/* Fondo translúcido visible en hover */}
          <div
            className="absolute inset-0 bg-black/40 transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0 }}
          />

          <div className="relative z-10 flex flex-col items-center gap-2 text-white">
            {/* Ícono de cámara (SVG inline para no añadir dependencias) */}
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300"
              style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
                <path
                  fillRule="evenodd"
                  d="M9 2 7.17 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.17L15 2H9Zm3 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <p className="text-center text-sm font-semibold drop-shadow">
              {hasCustomImage ? "Cambiar foto" : "Haz clic para elegir tu foto"}
            </p>

            {!hasCustomImage && (
              <p className="max-w-[180px] text-center text-xs font-normal text-white/80 drop-shadow">
                Si no subes ninguna, usaremos esta imagen por defecto
              </p>
            )}

            {hasCustomImage && selectedFileName && (
              <p className="max-w-[200px] truncate text-center text-xs font-normal text-white/80 drop-shadow">
                {selectedFileName}
              </p>
            )}
          </div>
        </div>

        {/* ─── Badge inferior "Experiencia premium" ────────────────────── */}
        <div className="absolute bottom-6 left-6 text-white">
          <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]">
            {/* Ícono restaurante simplificado */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7Zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4Z" />
            </svg>
            Experiencia premium
          </div>
          <p className="text-sm font-medium text-white/90">
            {hasCustomImage ? "Foto personalizada" : "Reserva Latina Pro Suite"}
          </p>
        </div>

        {/* ─── Badge "Tu foto" cuando hay imagen personalizada ────────── */}
        {hasCustomImage && (
          <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary shadow-lg">
            Tu foto ✓
          </div>
        )}
      </label>

      {/* ─── Texto de ayuda debajo de la imagen ─────────────────────────── */}
      <p className="text-center text-xs text-on-surface-variant">
        {previewSrc !== null && selectedFileName
          ? `Foto seleccionada: ${selectedFileName} — haz clic en la imagen para cambiarla`
          : hasPersistedImage
            ? "Foto guardada — haz clic en la imagen para cambiarla"
            : "Imagen por defecto — haz clic en la foto para personalizarla"}
      </p>

      {/*
       * Input real: está aquí en el DOM del Client Component pero también se
       * sincroniza con el form externo mediante el id que referencia el label.
       * El onChange aquí actualiza el preview; el value se envía via FormData
       * porque el input tiene el name="heroImage" que el Server Action lee.
       */}
      <input
        id={fileInputId}
        form={formId}
        name="heroImage"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />
    </div>
  );
}
//-aqui termina componente RestaurantHeroImagePicker-//

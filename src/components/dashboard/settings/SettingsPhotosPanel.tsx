/**
 * Archivo: SettingsPhotosPanel.tsx
 * Responsabilidad: Gestionar la foto de portada y la galería del restaurante.
 *                  Las imágenes se suben DIRECTAMENTE a Cloudinary desde el navegador
 *                  (cliente → Cloudinary). El servidor solo genera la firma y persiste las URLs.
 *                  Nunca pasan archivos binarios por Next.js.
 * Tipo: UI (Client Component)
 */

"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import {
  uploadFileToCloudinary,
  type CloudinaryUploadSignature,
} from "@/lib/cloudinary-client-upload.lib";
import { type RestaurantImage } from "@/modules/catalog/domain/entities/restaurant.entity";
import { NotificationBanner } from "@/components/ui/NotificationBanner";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface PhotosInitialValues {
  heroImage: RestaurantImage | null;
  galleryImages: RestaurantImage[];
}

export interface PhotoUrlsPayload {
  heroImage?: RestaurantImage | null;
  removedGalleryIds: string[];
  newGalleryImages: RestaurantImage[];
}

interface SettingsPhotosPanelProps {
  initialValues: PhotosInitialValues;
  errorMessage?: string;
  successMessage?: string;
  /** Server Action: genera la firma para subir directamente a Cloudinary */
  generateSignatureAction: (folder: string) => Promise<CloudinaryUploadSignature>;
  /** Server Action: recibe solo URLs y persiste en BD */
  savePhotoUrlsAction: (payload: PhotoUrlsPayload) => Promise<void>;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const DEFAULT_HERO_URL =
  "https://res.cloudinary.com/dvfptzqig/image/upload/v1740941916/reserva-latina/mock-restaurant.jpg";

const MAX_GALLERY_IMAGES = 6;

const HERO_FOLDER = "reserva-latina/restaurants";
const GALLERY_FOLDER = "reserva-latina/restaurants/gallery";

// ─── Sub-componente: Hero Picker ──────────────────────────────────────────────

//-aqui empieza componente HeroPicker y es para seleccionar la foto de portada con previsualización-//
function HeroPicker({
  currentUrl,
  onFileChange,
  isUploading,
}: {
  currentUrl: string;
  onFileChange: (file: File | null) => void;
  isUploading: boolean;
}) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    console.log("[Photos] Hero seleccionado:", { name: file.name, sizeKB: (file.size / 1024).toFixed(2) });
    setPreviewUrl(URL.createObjectURL(file));
    onFileChange(file);
  }

  return (
    <div className="space-y-3">
      <div
        className={`group relative h-52 w-full overflow-hidden rounded-2xl border-2 border-dashed border-outline-variant/40 transition-all ${isUploading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-primary/60"}`}
        onClick={() => !isUploading && inputRef.current?.click()}
        title={isUploading ? "Subiendo..." : "Haz clic para cambiar la foto de portada"}
      >
        <Image
          alt="Foto de portada del restaurante"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          src={previewUrl}
        />
        {!isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-sm font-semibold text-white">Cambiar foto de portada</span>
            <span className="text-xs text-white/70">JPG, PNG o WebP · Sin límite de tamaño</span>
          </div>
        )}
      </div>

      <input accept="image/*" className="sr-only" onChange={handleFileChange} ref={inputRef} type="file" />

      <p className="text-xs text-on-surface-variant">
        Esta imagen se muestra como portada en la página pública. Si no cambias nada, se mantiene la actual.
      </p>
    </div>
  );
}
//-aqui termina componente HeroPicker-//

// ─── Sub-componente: Gallery Manager ─────────────────────────────────────────

//-aqui empieza componente GalleryManager y es para gestionar la galería con previsualización local-//
function GalleryManager({
  initialImages,
  isUploading,
  onRemovedIdsChange,
  onNewFilesChange,
}: {
  initialImages: RestaurantImage[];
  isUploading: boolean;
  onRemovedIdsChange: (ids: string[]) => void;
  onNewFilesChange: (files: File[]) => void;
}) {
  const [removedPublicIds, setRemovedPublicIds] = useState<string[]>([]);
  const [newFilesLocal, setNewFilesLocal] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleExisting = initialImages.filter((img) => !removedPublicIds.includes(img.publicId));
  const totalCount = visibleExisting.length + newFilesLocal.length;
  const canAddMore = totalCount < MAX_GALLERY_IMAGES && !isUploading;

  function handleAddFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const available = MAX_GALLERY_IMAGES - totalCount;
    const toAdd = files.slice(0, available);
    console.log("[Photos] Fotos de galería seleccionadas:", toAdd.map((f) => f.name));
    const nextFiles = [...newFilesLocal, ...toAdd];
    setNewFilesLocal(nextFiles);
    setNewPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
    onNewFilesChange(nextFiles);
    e.target.value = "";
  }

  function handleRemoveExisting(publicId: string) {
    const next = [...removedPublicIds, publicId];
    setRemovedPublicIds(next);
    onRemovedIdsChange(next);
  }

  function handleRemoveNew(index: number) {
    const nextFiles = newFilesLocal.filter((_, i) => i !== index);
    setNewFilesLocal(nextFiles);
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
    onNewFilesChange(nextFiles);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visibleExisting.map((img) => (
          <GalleryThumb key={img.publicId} onRemove={() => handleRemoveExisting(img.publicId)} url={img.url} disabled={isUploading} />
        ))}
        {newPreviews.map((url, i) => (
          <GalleryThumb key={`new-${i}`} isNew onRemove={() => handleRemoveNew(i)} url={url} disabled={isUploading} />
        ))}
        {canAddMore && (
          <button
            className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low text-on-surface-variant transition-all hover:border-primary/60 hover:text-primary"
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-xs font-semibold">Añadir foto</span>
            <span className="text-[10px] opacity-60">{MAX_GALLERY_IMAGES - totalCount} restantes</span>
          </button>
        )}
      </div>
      <input accept="image/*" className="sr-only" multiple onChange={handleAddFiles} ref={inputRef} type="file" />
      <p className="text-xs text-on-surface-variant">
        Máximo {MAX_GALLERY_IMAGES} fotos. Las imágenes se suben directamente a Cloudinary sin pasar por el servidor.
      </p>
    </div>
  );
}
//-aqui termina componente GalleryManager-//

// ─── Sub-componente: Thumbnail ────────────────────────────────────────────────

function GalleryThumb({ url, onRemove, isNew = false, disabled = false }: { url: string; onRemove: () => void; isNew?: boolean; disabled?: boolean }) {
  return (
    <div className="group relative h-32 overflow-hidden rounded-xl border border-outline-variant/20">
      <Image alt="Foto de la galería" className="object-cover" fill sizes="(max-width: 640px) 50vw, 33vw" src={url} />
      {isNew && (
        <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-on-primary">Nueva</span>
      )}
      {!disabled && (
        <button
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-error"
          onClick={onRemove}
          title="Eliminar foto"
          type="button"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

//-aqui empieza componente SettingsPhotosPanel y es para gestionar las fotos del restaurante con upload directo a Cloudinary-//
/**
 * Panel de gestión de fotos. Flujo:
 *  1. Usuario selecciona archivos (previsualización local, sin subir nada aún)
 *  2. Al hacer "Guardar":
 *     a. Pide firma al servidor (Server Action ligero)
 *     b. Sube archivos DIRECTO a Cloudinary desde el navegador
 *     c. Envía solo las URLs resultantes al Server Action de persistencia
 * El servidor de Next.js nunca recibe binarios — solo JSON ligero.
 */
export function SettingsPhotosPanel({
  initialValues,
  errorMessage,
  successMessage,
  generateSignatureAction,
  savePhotoUrlsAction,
}: SettingsPhotosPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  // Acumuladores — no en DOM, gestionados por los sub-componentes via callbacks
  const heroFileRef = useRef<File | null>(null);
  const newGalleryFilesRef = useRef<File[]>([]);
  const removedIdsRef = useRef<string[]>([]);

  const isUploading = isPending;

  const labelHeadingCls = "block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant";

  //-aqui empieza funcion handleSubmit y es para orquestar el upload a Cloudinary y la persistencia en BD-//
  /**
   * Orquesta el proceso completo:
   * 1. Obtiene firma del servidor
   * 2. Sube archivos directamente a Cloudinary (sin pasar por Next.js)
   * 3. Persiste las URLs resultantes en BD via server action
   * @sideEffect
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(undefined);

    const hasHeroChange = heroFileRef.current !== null;
    const hasNewGallery = newGalleryFilesRef.current.length > 0;
    const hasRemovals = removedIdsRef.current.length > 0;

    if (!hasHeroChange && !hasNewGallery && !hasRemovals) {
      console.log("[Photos] Sin cambios que guardar");
      return;
    }

    startTransition(async () => {
      try {
        const payload: PhotoUrlsPayload = {
          removedGalleryIds: removedIdsRef.current,
          newGalleryImages: [],
        };

        // ── 1. Subir hero si cambió ──────────────────────────────────────────
        if (hasHeroChange && heroFileRef.current) {
          setUploadStatus("Subiendo foto de portada...");
          console.log("[Photos] Solicitando firma para hero...");
          const heroSig = await generateSignatureAction(HERO_FOLDER);
          console.log("[Photos] Firma obtenida. Subiendo a Cloudinary...");
          const heroResult = await uploadFileToCloudinary(heroFileRef.current, heroSig);
          console.log("[Photos] ✅ Hero subida:", heroResult.url);
          payload.heroImage = heroResult;
        }

        // ── 2. Subir fotos nuevas de galería ─────────────────────────────────
        if (hasNewGallery) {
          const totalGallery = newGalleryFilesRef.current.length;
          console.log("[Photos] Solicitando firma para galería...");
          const gallerySig = await generateSignatureAction(GALLERY_FOLDER);

          for (let i = 0; i < newGalleryFilesRef.current.length; i++) {
            const file = newGalleryFilesRef.current[i];
            setUploadStatus(`Subiendo foto ${i + 1} de ${totalGallery}...`);
            console.log(`[Photos] Subiendo galería ${i + 1}/${totalGallery}:`, file.name);
            const result = await uploadFileToCloudinary(file, gallerySig);
            console.log(`[Photos] ✅ Galería ${i + 1} subida:`, result.url);
            payload.newGalleryImages.push(result);
          }
        }

        // ── 3. Persistir solo URLs en BD ─────────────────────────────────────
        setUploadStatus("Guardando en base de datos...");
        console.log("[Photos] Persistiendo URLs en BD:", payload);
        await savePhotoUrlsAction(payload);

        // ── 4. Navegar — el server action NO hace redirect (para evitar que
        //    el catch lo interprete como error). Navegamos desde el cliente
        //    con recarga completa para limpiar todo el estado. ────────────────
        console.log("[Photos] ✅ Todo guardado. Navegando...");
        window.location.href = "/dashboard/settings?photosSaved=photos";

      } catch (err) {
        console.error("[Photos] ❌ Error durante el proceso:", err);
        setLocalError("Hubo un error al subir las fotos. Comprueba tu conexión e inténtalo de nuevo.");
        setUploadStatus("");
      }
    });
  }
  //-aqui termina funcion handleSubmit-//

  const displayError = localError ?? errorMessage;

  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-sm">
      {/* ─── Cabecera ──────────────────────────────────────────────────── */}
      <div className="border-b border-outline-variant/10 p-8">
        <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
          Fotos del restaurante
        </h3>
        <p className="mt-1 text-sm text-on-surface-variant">
          La foto de portada y la galería son lo primero que ven tus clientes.
          Las imágenes se suben directamente a Cloudinary sin límite de tamaño.
        </p>
      </div>

      {/* ─── Formulario ────────────────────────────────────────────────── */}
      <form className="space-y-8 p-8" onSubmit={handleSubmit}>
        {displayError ? (
          <NotificationBanner
            key={`photos-error-${displayError}`}
            description={displayError}
            tone="error"
            title="No se pudieron guardar las fotos"
          />
        ) : null}

        {successMessage ? (
          <NotificationBanner
            key={`photos-success-${successMessage}`}
            description={successMessage}
            tone="success"
            title="Fotos actualizadas"
          />
        ) : null}

        {/* Foto de portada */}
        <div className="space-y-3">
          <span className={labelHeadingCls}>Foto de portada</span>
          <HeroPicker
            currentUrl={initialValues.heroImage?.url ?? DEFAULT_HERO_URL}
            isUploading={isUploading}
            onFileChange={(file) => { heroFileRef.current = file; }}
          />
        </div>

        {/* Galería */}
        <div className="space-y-3">
          <span className={labelHeadingCls}>
            Galería ({initialValues.galleryImages.length}/{MAX_GALLERY_IMAGES})
          </span>
          <GalleryManager
            initialImages={initialValues.galleryImages}
            isUploading={isUploading}
            onNewFilesChange={(files) => { newGalleryFilesRef.current = files; }}
            onRemovedIdsChange={(ids) => { removedIdsRef.current = ids; }}
          />
        </div>

        {/* Estado de progreso */}
        {isPending && uploadStatus && (
          <div className="flex items-center gap-3 rounded-lg bg-primary/5 px-4 py-3 text-sm text-primary">
            <svg className="h-4 w-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" d="M4 12a8 8 0 018-8v8z" fill="currentColor" />
            </svg>
            {uploadStatus}
          </div>
        )}

        {/* Acción */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" d="M4 12a8 8 0 018-8v8z" fill="currentColor" />
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Guardar fotos
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
//-aqui termina componente SettingsPhotosPanel-//

/**
 * Archivo: SettingsMenuPanel.tsx
 * Responsabilidad: Panel interactivo para CRUD completo de la carta del restaurante.
 *                  Gestiona categorías y platos con feedback visual y logs de consola.
 * Tipo: UI (client component)
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchMenuCategoriesAction,
  addMenuCategoryAction,
  updateMenuCategoryAction,
  deleteMenuCategoryAction,
  addMenuItemAction,
  updateMenuItemAction,
  deleteMenuItemAction,
} from "@/app/(dashboard)/dashboard/settings/menu-actions";
import { type MenuCategoryPrimitives } from "@/modules/catalog/domain/entities/menu-category.entity";
import { type MenuItemPrimitives } from "@/modules/catalog/domain/entities/menu-item.entity";
import {
  uploadFileToCloudinary,
  type CloudinaryUploadSignature,
} from "@/lib/cloudinary-client-upload.lib";
import { useRef } from "react";
import Image from "next/image";

// ─── Tipos internos ──────────────────────────────────────────────────────────

type CategoryWithItems = MenuCategoryPrimitives & { items: MenuItemPrimitives[] };

interface SettingsMenuPanelProps {
  generateSignatureAction: (folder: string) => Promise<CloudinaryUploadSignature>;
}

const MENU_IMAGES_FOLDER = "reserva-latina/menu-items";

// ─── Clases reutilizables ────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-lg border-0 bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface outline-none ring-1 ring-transparent transition-all focus:ring-primary placeholder:font-normal placeholder:text-outline";

const btnPrimaryCls =
  "rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed";

const btnSecondaryCls =
  "rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low";

const labelCls =
  "block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant";

// ─── Componente principal ────────────────────────────────────────────────────

//-aqui empieza componente SettingsMenuPanel y es para gestionar la carta del restaurante-//
/**
 * Panel CRUD completo para categorías y platos.
 * Muestra logs en consola del navegador para seguir el flujo completo.
 */
export function SettingsMenuPanel({ generateSignatureAction }: SettingsMenuPanelProps) {
  const [categories, setCategories] = useState<CategoryWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  //-aqui empieza funcion loadCategories y es para cargar las categorías desde el servidor-//
  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await fetchMenuCategoriesAction();

    if (result.success && result.data) {
      setCategories(result.data);
    } else {
      setError(result.error ?? "Error desconocido");
    }

    setIsLoading(false);
  }, []);
  //-aqui termina funcion loadCategories-//

  useEffect(() => {
    let cancelled = false;

    fetchMenuCategoriesAction().then((result) => {
      if (cancelled) return;

      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        setError(result.error ?? "Error desconocido");
      }

      setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  //-aqui empieza funcion showSuccess y es para mostrar mensaje temporal de éxito-//
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };
  //-aqui termina funcion showSuccess-//

  return (
    <section className="overflow-hidden rounded-[28px] bg-surface-container-lowest shadow-sm">
      {/* ─── Cabecera ─────────────────────────────────────────────────── */}
      <div className="border-b border-outline-variant/10 p-8">
        <h3 className="text-xl font-black tracking-tight text-primary md:text-2xl">
          Carta del restaurante
        </h3>
        <p className="mt-1 text-sm text-on-surface-variant">
          Gestiona las categorías y platos que se mostrarán a tus clientes.
        </p>
      </div>

      <div className="space-y-6 p-8">
        {/* ─── Feedback ─────────────────────────────────────────────── */}
        {error ? (
          <div className="rounded-lg bg-error/10 p-4 text-sm font-semibold text-error">
            {error}
          </div>
        ) : null}

        {successMsg ? (
          <div className="rounded-lg bg-primary/10 p-4 text-sm font-semibold text-primary">
            {successMsg}
          </div>
        ) : null}

        {/* ─── Formulario nueva categoría ───────────────────────────── */}
        <AddCategoryForm
          onCreated={(cat) => {
            setCategories((prev) => [...prev, { ...cat, items: [] }]);
            showSuccess(`Categoría "${cat.name}" creada`);
          }}
        />

        {/* ─── Loading ──────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="py-12 text-center text-sm text-on-surface-variant">
            Cargando carta...
          </div>
        ) : null}

        {/* ─── Lista de categorías ──────────────────────────────────── */}
        {!isLoading && categories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-outline-variant/30 py-12 text-center">
            <p className="text-sm text-on-surface-variant">
              Aún no has creado ninguna categoría. Empieza añadiendo una arriba.
            </p>
          </div>
        ) : null}

        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            generateSignatureAction={generateSignatureAction}
            onDeleted={(id) => {
              setCategories((prev) => prev.filter((c) => c.id !== id));
              showSuccess("Categoría eliminada");
            }}
            onItemsChanged={() => loadCategories()}
            onUpdated={(updated) => {
              setCategories((prev) =>
                prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
              );
              showSuccess(`Categoría "${updated.name}" actualizada`);
            }}
          />
        ))}
      </div>
    </section>
  );
}
//-aqui termina componente SettingsMenuPanel-//

// ─── Subcomponente: Formulario de nueva categoría ────────────────────────────

//-aqui empieza componente AddCategoryForm y es para el formulario de alta de categoría-//
function AddCategoryForm({ onCreated }: { onCreated: (cat: MenuCategoryPrimitives) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setSaving(true);

    const result = await addMenuCategoryAction(name.trim(), description.trim() || undefined);

    if (result.success && result.data) {
      onCreated(result.data);
      setName("");
      setDescription("");
      setOpen(false);
    }

    setSaving(false);
  };

  if (!open) {
    return (
      <button
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary/80 disabled:opacity-50"
        onClick={() => setOpen(true)}
        type="button"
      >
        + Nueva categoría
      </button>
    );
  }

  return (
    <form className="rounded-xl border border-outline-variant/20 p-6 space-y-4" onSubmit={handleSubmit}>
      <p className={labelCls}>Nueva categoría</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          className={inputCls}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre (ej: Entrantes, Postres...)"
          required
          type="text"
          value={name}
        />
        <input
          className={inputCls}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción (opcional)"
          type="text"
          value={description}
        />
      </div>
      <div className="flex gap-2">
        <button className={btnPrimaryCls} disabled={saving || !name.trim()} type="submit">
          {saving ? "Guardando..." : "Añadir categoría"}
        </button>
        <button className={btnSecondaryCls} onClick={() => setOpen(false)} type="button">
          Cancelar
        </button>
      </div>
    </form>
  );
}
//-aqui termina componente AddCategoryForm-//

// ─── Subcomponente: Tarjeta de categoría con platos ──────────────────────────

interface CategoryCardProps {
  category: CategoryWithItems;
  generateSignatureAction: (folder: string) => Promise<CloudinaryUploadSignature>;
  onUpdated: (cat: MenuCategoryPrimitives) => void;
  onDeleted: (id: string) => void;
  onItemsChanged: () => void;
}

//-aqui empieza componente CategoryCard y es para mostrar y gestionar una categoría con sus platos-//
function CategoryCard({ category, generateSignatureAction, onUpdated, onDeleted, onItemsChanged }: CategoryCardProps) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddItem, setShowAddItem] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [editDesc, setEditDesc] = useState(category.description ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filteredItems = searchQuery.trim()
    ? category.items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : category.items;

  const handleUpdate = async () => {
    if (!editName.trim()) return;

    setSaving(true);

    const result = await updateMenuCategoryAction(category.id, {
      name: editName.trim(),
      description: editDesc.trim() || null,
    });

    if (result.success && result.data) {
      onUpdated(result.data);
      setEditing(false);
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`¿Eliminar la categoría "${category.name}" y todos sus platos?`);

    if (!confirmed) return;

    setDeleting(true);

    const result = await deleteMenuCategoryAction(category.id);

    if (result.success) {
      onDeleted(category.id);
    }

    setDeleting(false);
  };

  return (
    <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
      {/* ─── Header de categoría ───────────────────────────────────── */}
      <div className="border-b border-outline-variant/10 bg-surface-container-low/50 p-5">
        {editing ? (
          <div className="space-y-3">
            <div className="flex flex-1 gap-3">
              <input
                className={`${inputCls} flex-1`}
                onChange={(e) => setEditName(e.target.value)}
                value={editName}
              />
              <input
                className={`${inputCls} flex-1`}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Descripción"
                value={editDesc}
              />
            </div>
            <div className="flex gap-2">
              <button className={btnPrimaryCls} disabled={saving} onClick={handleUpdate} type="button">
                {saving ? "..." : "Guardar"}
              </button>
              <button className={btnSecondaryCls} onClick={() => setEditing(false)} type="button">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            {/* Lado izquierdo: toggle + info */}
            <button
              className="flex items-center gap-3 min-w-0 flex-1 text-left"
              onClick={() => setExpanded((prev) => !prev)}
              type="button"
            >
              <span
                className={`text-on-surface-variant transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
              >
                ▶
              </span>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-on-surface truncate">
                  {category.name}
                  <span className="ml-2 text-xs font-normal text-on-surface-variant">
                    ({category.items.length} {category.items.length === 1 ? "plato" : "platos"})
                  </span>
                </h4>
                {category.description ? (
                  <p className="text-xs text-on-surface-variant truncate">{category.description}</p>
                ) : null}
              </div>
            </button>

            {/* Lado derecho: acciones */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary transition-colors hover:bg-primary/80"
                onClick={() => { setShowAddItem(true); setExpanded(true); }}
                type="button"
              >
                + Plato
              </button>
              <button
                className="rounded-lg bg-tertiary/10 px-3 py-1.5 text-xs font-bold text-tertiary transition-colors hover:bg-tertiary/20"
                onClick={() => setEditing(true)}
                type="button"
              >
                ✏️ Editar
              </button>
              <button
                className="rounded-lg bg-error/10 px-3 py-1.5 text-xs font-bold text-error transition-colors hover:bg-error/20 disabled:opacity-50"
                disabled={deleting}
                onClick={handleDelete}
                type="button"
              >
                {deleting ? "..." : "🗑️ Eliminar"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Contenido plegable ─────────────────────────────────────── */}
      {expanded ? (
        <>
          {/* ─── Buscador de platos ──────────────────────────────── */}
          {category.items.length > 0 ? (
            <div className="border-b border-outline-variant/10 bg-surface-container-low/30 px-5 py-3">
              <input
                className={`${inputCls} py-2! text-xs!`}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Buscar plato por nombre..."
                type="text"
                value={searchQuery}
              />
            </div>
          ) : null}

          {/* ─── Formulario nuevo plato (arriba de la lista) ──────── */}
          {showAddItem ? (
            <AddItemForm
              categoryId={category.id}
              generateSignatureAction={generateSignatureAction}
              onCancel={() => setShowAddItem(false)}
              onCreated={() => {
                onItemsChanged();
                setShowAddItem(false);
              }}
            />
          ) : null}

          {/* ─── Lista de platos ─────────────────────────────────── */}
          <div className="divide-y divide-outline-variant/10">
            {filteredItems.map((item) => (
              <MenuItemRow
                key={item.id}
                generateSignatureAction={generateSignatureAction}
                item={item}
                onChanged={onItemsChanged}
              />
            ))}

            {category.items.length > 0 && filteredItems.length === 0 ? (
              <div className="py-6 text-center text-xs text-on-surface-variant">
                Sin resultados para &quot;{searchQuery}&quot;
              </div>
            ) : null}

            {category.items.length === 0 && !showAddItem ? (
              <div className="py-6 text-center text-xs text-on-surface-variant">
                Sin platos todavía
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
//-aqui termina componente CategoryCard-//

// ─── Subcomponente: Fila de plato ────────────────────────────────────────────

//-aqui empieza componente MenuItemRow y es para mostrar y gestionar un plato individual-//
function MenuItemRow({
  item,
  generateSignatureAction,
  onChanged,
}: {
  item: MenuItemPrimitives;
  generateSignatureAction: (folder: string) => Promise<CloudinaryUploadSignature>;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editDesc, setEditDesc] = useState(item.description ?? "");
  const [editPrice, setEditPrice] = useState(item.price !== null ? String(item.price) : "");
  const [editAllergens, setEditAllergens] = useState(item.allergens.join(", "));
  const [editImageUrl, setEditImageUrl] = useState(item.imageUrl ?? "");
  const [editImagePublicId, setEditImagePublicId] = useState(item.imagePublicId ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //-aqui empieza funcion handleImageUpload y es para subir foto del plato a Cloudinary-//
  const handleImageUpload = async (file: File) => {
    setUploading(true);

    try {
      const signature = await generateSignatureAction(MENU_IMAGES_FOLDER);

      const uploaded = await uploadFileToCloudinary(file, signature);

      setEditImageUrl(uploaded.url);
      setEditImagePublicId(uploaded.publicId);

      // Si no estamos en modo edición, guardamos directamente la imagen
      if (!editing) {
        const result = await updateMenuItemAction(item.id, { imageUrl: uploaded.url, imagePublicId: uploaded.publicId });

        if (result.success) {
          onChanged();
        }
      }
    } catch {
      // Error de subida silenciado
    }

    setUploading(false);
  };
  //-aqui termina funcion handleImageUpload-//

  const handleUpdate = async () => {
    if (!editName.trim()) return;

    setSaving(true);

    const parsedPrice = editPrice.trim() === "" ? null : Number(editPrice);
    const parsedAllergens = editAllergens
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    const result = await updateMenuItemAction(item.id, {
      name: editName.trim(),
      description: editDesc.trim() || null,
      price: parsedPrice,
      allergens: parsedAllergens,
      imageUrl: editImageUrl.trim() || null,
      imagePublicId: editImageUrl.trim() ? editImagePublicId.trim() || null : null,
    });

    if (result.success) {
      onChanged();
      setEditing(false);
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`¿Eliminar el plato "${item.name}"?`);

    if (!confirmed) return;

    setDeleting(true);

    const result = await deleteMenuItemAction(item.id);

    if (result.success) {
      onChanged();
    }

    setDeleting(false);
  };

  if (editing) {
    return (
      <div className="space-y-3 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            className={inputCls}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Nombre del plato"
            value={editName}
          />
          <input
            className={inputCls}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Descripción"
            value={editDesc}
          />
          <input
            className={inputCls}
            onChange={(e) => setEditPrice(e.target.value)}
            placeholder="Precio (ej: 12.50)"
            type="number"
            step="0.01"
            min="0"
            value={editPrice}
          />
          <input
            className={inputCls}
            onChange={(e) => setEditAllergens(e.target.value)}
            placeholder="Alérgenos (gluten, lactosa...)"
            value={editAllergens}
          />
        </div>

        {/* ─── Foto del plato ───────────────────────────────────── */}
        <div className="flex items-center gap-4">
          {editImageUrl ? (
            <Image
              alt={editName}
              className="h-16 w-16 rounded-lg object-cover ring-1 ring-outline-variant/20"
              src={editImageUrl}
              width={64}
              height={64}
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface-container-low text-xs text-outline">
              Sin foto
            </div>
          )}
          <div className="space-y-1">
            <input
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
              ref={fileInputRef}
              type="file"
            />
            <button
              className={btnSecondaryCls}
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              {uploading ? "Subiendo..." : "Cambiar foto"}
            </button>
            {editImageUrl ? (
              <button
                className="block text-xs text-error hover:underline"
                onClick={() => { setEditImageUrl(""); setEditImagePublicId(""); }}
                type="button"
              >
                Quitar foto
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex gap-2">
          <button className={btnPrimaryCls} disabled={saving || uploading} onClick={handleUpdate} type="button">
            {saving ? "..." : "Guardar"}
          </button>
          <button className={btnSecondaryCls} onClick={() => setEditing(false)} type="button">
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 px-5 py-3 hover:bg-surface-container-low/30 transition-colors">
      {/* Thumbnail */}
      {item.imageUrl ? (
        <Image
          alt={item.name}
          className="h-10 w-10 rounded-lg object-cover ring-1 ring-outline-variant/20 shrink-0"
          src={item.imageUrl}
          width={40}
          height={40}
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-low text-[10px] text-outline shrink-0">
          📷
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-on-surface truncate">{item.name}</p>
        {item.description ? (
          <p className="text-xs text-on-surface-variant truncate">{item.description}</p>
        ) : null}
        {item.allergens.length > 0 ? (
          <p className="text-[10px] text-outline mt-0.5">Alérgenos: {item.allergens.join(", ")}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-sm font-bold text-primary">
          {item.price !== null ? `${Number(item.price).toFixed(2)} €` : "Consultar"}
        </span>
        <button
          className="rounded-lg bg-tertiary/10 px-3 py-1.5 text-xs font-semibold text-tertiary transition-colors hover:bg-tertiary/20"
          onClick={() => setEditing(true)}
          type="button"
        >
          ✏️ Editar
        </button>
        <button
          className="rounded-lg bg-error/10 p-1.5 text-error transition-colors hover:bg-error/20 disabled:opacity-50"
          disabled={deleting}
          onClick={handleDelete}
          type="button"
          title="Eliminar plato"
        >
          {deleting ? (
            <span className="inline-block h-4 w-4 text-xs">...</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
//-aqui termina componente MenuItemRow-//

// ─── Subcomponente: Formulario de nuevo plato ────────────────────────────────

//-aqui empieza componente AddItemForm y es para el formulario de alta de plato-//
function AddItemForm({
  categoryId,
  generateSignatureAction,
  onCreated,
  onCancel,
}: {
  categoryId: string;
  generateSignatureAction: (folder: string) => Promise<CloudinaryUploadSignature>;
  onCreated: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [allergens, setAllergens] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //-aqui empieza funcion handleFileSelected y es para previsualizar la imagen seleccionada-//
  const handleFileSelected = (file: File) => {
    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };
  //-aqui termina funcion handleFileSelected-//

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setSaving(true);

    let uploadedImageUrl: string | undefined;
    let uploadedImagePublicId: string | undefined;

    // Si hay imagen, subirla primero a Cloudinary
    if (imageFile) {
      try {
        const signature = await generateSignatureAction(MENU_IMAGES_FOLDER);
        const uploaded = await uploadFileToCloudinary(imageFile, signature);
        uploadedImageUrl = uploaded.url;
        uploadedImagePublicId = uploaded.publicId;
      } catch {
        // Error de subida silenciado
      }
    }

    const parsedPrice = price.trim() === "" ? null : Number(price);
    const parsedAllergens = allergens
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    const result = await addMenuItemAction(categoryId, name.trim(), {
      description: description.trim() || undefined,
      price: parsedPrice,
      allergens: parsedAllergens.length > 0 ? parsedAllergens : undefined,
      imageUrl: uploadedImageUrl,
      imagePublicId: uploadedImagePublicId,
    });

    if (result.success) {
      onCreated();
    }

    setSaving(false);
  };

  return (
    <form className="border-t border-outline-variant/10 p-4 space-y-3" onSubmit={handleSubmit}>
      <p className={labelCls}>Nuevo plato</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          className={inputCls}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del plato *"
          required
          type="text"
          value={name}
        />
        <input
          className={inputCls}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
          type="text"
          value={description}
        />
        <input
          className={inputCls}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Precio (ej: 12.50)"
          type="number"
          step="0.01"
          min="0"
          value={price}
        />
        <input
          className={inputCls}
          onChange={(e) => setAllergens(e.target.value)}
          placeholder="Alérgenos (gluten, lactosa...)"
          type="text"
          value={allergens}
        />
      </div>

      {/* ─── Foto del plato (opcional) ────────────────────────────── */}
      <div className="flex items-center gap-4">
        {imagePreview ? (
          <Image
            alt="Preview"
            className="h-14 w-14 rounded-lg object-cover ring-1 ring-outline-variant/20"
            src={imagePreview}
            width={56}
            height={56}
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface-container-low text-xs text-outline">
            📷
          </div>
        )}
        <div>
          <input
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelected(file);
            }}
            ref={fileInputRef}
            type="file"
          />
          <button
            className={btnSecondaryCls}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            {imageFile ? "Cambiar foto" : "Añadir foto"}
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button className={btnPrimaryCls} disabled={saving || !name.trim()} type="submit">
          {saving ? "Guardando..." : "Añadir plato"}
        </button>
        <button className={btnSecondaryCls} onClick={onCancel} type="button">
          Cancelar
        </button>
      </div>
    </form>
  );
}
//-aqui termina componente AddItemForm-//

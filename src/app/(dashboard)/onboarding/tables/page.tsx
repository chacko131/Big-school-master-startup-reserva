/**
 * Archivo: page.tsx
 * Responsabilidad: Renderizar el paso de configuración de mesas dentro del onboarding del restaurante.
 * Tipo: UI
 */

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ONBOARDING_TOTAL_STEPS, getOnboardingStepNumber, getOnboardingSteps } from "@/constants/onboarding";
import { T } from "@/components/T";
import { OnboardingIcon } from "@/components/onboarding/OnboardingIcon";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { TablesOnboardingForm, type TablesOnboardingInitialRow, tablesOnboardingFormId } from "@/components/onboarding/TablesOnboardingForm";
import { AddDiningTable } from "@/modules/catalog/application/use-cases/add-dining-table.use-case";
import { RestaurantNotFoundError } from "@/modules/catalog/application/errors/restaurant-not-found.error";
import { getCatalogInfrastructure } from "@/modules/catalog/infrastructure/catalog-infrastructure";

interface TablesOnboardingPageProps {
  searchParams: Promise<{ restaurantId?: string | string[]; error?: string | string[] }>;
}

interface TablesOnboardingDraftRow {
  id: string;
  name: string;
  capacity: number;
  isCombinable: boolean;
  sortOrder: number;
}

interface TablesOnboardingDraft {
  restaurantId: string;
  rows: TablesOnboardingDraftRow[];
}

const tablesPageLayoutClassName = "flex w-full max-w-6xl flex-col gap-12";
const tablesDraftCookieName = "onboarding_tables_draft";
const onboardingRestaurantIdCookieName = "onboarding_restaurant_id";

const onboardingCookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  path: "/onboarding",
  sameSite: "lax" as const,
};

const persistedTableSchema = z.object({
  id: z.string().trim(),
  name: z.string().trim().min(1),
  capacity: z.number().int().min(1),
  isCombinable: z.boolean(),
  sortOrder: z.number().int().min(1),
});

const tablesOnboardingSchema = z.object({
  restaurantId: z.string().trim().min(1),
  rows: z.array(persistedTableSchema).min(1),
});

const tablesDraftSchema = z.object({
  restaurantId: z.string().trim(),
  rows: z.array(
    z.object({
      id: z.string().trim(),
      name: z.string().trim(),
      capacity: z.number().int().min(0),
      isCombinable: z.boolean(),
      sortOrder: z.number().int().min(1),
    }),
  ),
});

//-aqui empieza funcion saveTablesOnboardingAction y es para persistir las mesas del onboarding-//
/**
 * Guarda y sincroniza las mesas del restaurante dentro del onboarding.
 * @sideEffect
 */
async function saveTablesOnboardingAction(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const draftInput = buildTablesDraftFromFormData(formData);

  cookieStore.set(tablesDraftCookieName, serializeTablesDraft(draftInput), onboardingCookieOptions);

  const parsedInput = normalizeTablesInput(draftInput);

  if (!parsedInput.success) {
    redirect(`/onboarding/tables?restaurantId=${draftInput.restaurantId}&error=${parsedInput.error}`);
  }

  const duplicateNames = findDuplicateTableNames(parsedInput.data.rows);

  if (duplicateNames.length > 0) {
    redirect(`/onboarding/tables?restaurantId=${parsedInput.data.restaurantId}&error=duplicateTableName`);
  }

  try {
    const catalogInfrastructure = getCatalogInfrastructure();
    const addDiningTable = new AddDiningTable(catalogInfrastructure.restaurantRepository, catalogInfrastructure.diningTableRepository);
    const idsToKeep: string[] = [];

    for (const tableRow of parsedInput.data.rows) {
      const diningTableId = tableRow.id.length > 0 ? tableRow.id : randomUUID();

      idsToKeep.push(diningTableId);

      await addDiningTable.execute({
        id: diningTableId,
        restaurantId: parsedInput.data.restaurantId,
        name: tableRow.name,
        capacity: tableRow.capacity,
        isActive: true,
        isCombinable: tableRow.isCombinable,
        sortOrder: tableRow.sortOrder,
      });
    }

    await catalogInfrastructure.diningTableRepository.deleteMissingByRestaurantId(parsedInput.data.restaurantId, idsToKeep);
    cookieStore.set(onboardingRestaurantIdCookieName, parsedInput.data.restaurantId, onboardingCookieOptions);
  } catch (error) {
    if (error instanceof RestaurantNotFoundError) {
      redirect("/onboarding/restaurant");
    }

    if (isDuplicateDiningTableNameError(error)) {
      redirect(`/onboarding/tables?restaurantId=${parsedInput.data.restaurantId}&error=duplicateTableName`);
    }

    throw error;
  }

  redirect(`/onboarding/plan?restaurantId=${parsedInput.data.restaurantId}`);
}
//-aqui termina funcion saveTablesOnboardingAction y se va autilizar en el submit del onboarding-//

//-aqui empieza funcion buildTablesDraftFromFormData y es para convertir el formData en un draft serializable-//
/**
 * Construye el borrador de mesas a partir del `FormData` recibido por el server action.
 * @pure
 */
function buildTablesDraftFromFormData(formData: FormData): TablesOnboardingDraft {
  const restaurantId = String(formData.get("restaurantId") ?? "").trim();
  const rowCount = Number(String(formData.get("rowCount") ?? "0"));
  const rows: TablesOnboardingDraftRow[] = [];

  for (let index = 0; index < rowCount; index += 1) {
    rows.push({
      id: String(formData.get(`tableId-${index}`) ?? "").trim(),
      name: String(formData.get(`tableName-${index}`) ?? "").trim(),
      capacity: Number(String(formData.get(`tableCapacity-${index}`) ?? "0")),
      isCombinable: formData.get(`tableCombinable-${index}`) === "on",
      sortOrder: Number(String(formData.get(`tableSortOrder-${index}`) ?? String(index + 1))),
    });
  }

  return {
    restaurantId,
    rows,
  };
}
//-aqui termina funcion buildTablesDraftFromFormData y se va autilizar en el server action-//

//-aqui empieza funcion normalizeTablesInput y es para validar las filas utiles del formulario-//
/**
 * Normaliza el borrador del formulario y elimina filas vacías antes de validar.
 * @pure
 */
function normalizeTablesInput(
  draft: TablesOnboardingDraft,
):
  | { success: true; data: { restaurantId: string; rows: TablesOnboardingDraftRow[] } }
  | { success: false; error: "invalidForm" | "emptyTables" } {
  const relevantRows = draft.rows.filter((row) => row.name.length > 0 || row.capacity > 0 || row.id.length > 0 || row.isCombinable);

  if (relevantRows.length === 0) {
    return { success: false, error: "emptyTables" };
  }

  const parsedInput = tablesOnboardingSchema.safeParse({
    restaurantId: draft.restaurantId,
    rows: relevantRows,
  });

  if (!parsedInput.success) {
    return { success: false, error: "invalidForm" };
  }

  return {
    success: true,
    data: parsedInput.data,
  };
}
//-aqui termina funcion normalizeTablesInput y se va autilizar en el server action-//

//-aqui empieza funcion findDuplicateTableNames y es para detectar nombres repetidos en el mismo formulario-//
/**
 * Devuelve los nombres de mesas repetidos dentro del mismo submit.
 * @pure
 */
function findDuplicateTableNames(rows: TablesOnboardingDraftRow[]): string[] {
  const seenNames = new Set<string>();
  const duplicateNames = new Set<string>();

  for (const row of rows) {
    const normalizedName = row.name.trim().toLowerCase();

    if (seenNames.has(normalizedName)) {
      duplicateNames.add(normalizedName);
      continue;
    }

    seenNames.add(normalizedName);
  }

  return [...duplicateNames];
}
//-aqui termina funcion findDuplicateTableNames y se va autilizar en el server action-//

//-aqui empieza funcion serializeTablesDraft y es para persistir el borrador de mesas en cookie-//
/**
 * Serializa el borrador de mesas para persistirlo temporalmente en cookies.
 * @pure
 */
function serializeTablesDraft(draft: TablesOnboardingDraft): string {
  return JSON.stringify(draft);
}
//-aqui termina funcion serializeTablesDraft y se va autilizar en el server action-//

//-aqui empieza funcion parseTablesDraftCookie y es para rehidratar el borrador de mesas-//
/**
 * Recupera el borrador de mesas desde cookie si el contenido es válido.
 * @pure
 */
function parseTablesDraftCookie(cookieValue: string | undefined): TablesOnboardingDraft | null {
  if (cookieValue === undefined || cookieValue.trim().length === 0) {
    return null;
  }

  try {
    const parsedValue = tablesDraftSchema.safeParse(JSON.parse(cookieValue));

    if (!parsedValue.success) {
      return null;
    }

    return parsedValue.data;
  } catch {
    return null;
  }
}
//-aqui termina funcion parseTablesDraftCookie y se va autilizar en el render-//

//-aqui empieza funcion getInitialTableRows y es para resolver el estado inicial del formulario de mesas-//
/**
 * Resuelve las filas iniciales usando DB o draft persistido cuando corresponde.
 * @pure
 */
function getInitialTableRows(
  persistedRows: TablesOnboardingInitialRow[],
  persistedDraft: TablesOnboardingDraft | null,
  restaurantId: string,
  shouldPreferDraft: boolean,
): TablesOnboardingInitialRow[] {
  if (shouldPreferDraft && persistedDraft !== null && persistedDraft.restaurantId === restaurantId) {
    return persistedDraft.rows.length > 0
      ? persistedDraft.rows.map((row, index) => ({
          rowKey: row.id.length > 0 ? row.id : `draft-row-${index + 1}`,
          id: row.id,
          name: row.name,
          capacity: row.capacity,
          isCombinable: row.isCombinable,
        }))
      : [{ rowKey: "blank-row-1", id: "", name: "", capacity: 0, isCombinable: false }];
  }

  if (persistedRows.length > 0) {
    return persistedRows;
  }

  if (persistedDraft !== null && persistedDraft.restaurantId === restaurantId && persistedDraft.rows.length > 0) {
    return persistedDraft.rows.map((row, index) => ({
      rowKey: row.id.length > 0 ? row.id : `draft-row-${index + 1}`,
      id: row.id,
      name: row.name,
      capacity: row.capacity,
      isCombinable: row.isCombinable,
    }));
  }

  return [{ rowKey: "blank-row-1", id: "", name: "", capacity: 0, isCombinable: false }];
}
//-aqui termina funcion getInitialTableRows y se va autilizar en el render-//

//-aqui empieza funcion isDuplicateDiningTableNameError y es para detectar nombres de mesa repetidos en Prisma-//
/**
 * Detecta si Prisma rechazó el guardado por nombre de mesa duplicado dentro del restaurante.
 * @pure
 */
function isDuplicateDiningTableNameError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return "code" in error && (error as { code?: string }).code === "P2002";
}
//-aqui termina funcion isDuplicateDiningTableNameError y se va autilizar en el catch del onboarding-//

//-aqui empieza componente TablesTipCard y es para aportar contexto operativo sobre la combinacion de mesas-//
function TablesTipCard() {
  return (
    <section className="glass-container flex flex-col items-start gap-6 rounded-[28px] border border-outline-variant/20 p-8 md:flex-row">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed-variant">
        <OnboardingIcon name="help" className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-bold tracking-tight text-primary">
          <T>Tip pro: mesas combinables</T>
        </h4>
        <p className="max-w-3xl text-sm leading-7 text-on-surface-variant">
          <T>
            Marcar mesas como combinables permite que Reserva Latina sugiera acomodos para grupos grandes agrupando mesas adyacentes según tu layout.
          </T>
        </p>
      </div>
    </section>
  );
}
//-aqui termina componente TablesTipCard-//

//-aqui empieza pagina TablesOnboardingPage y es para montar el paso de configuracion de mesas del onboarding-//
/**
 * Presenta la pantalla de configuración inicial de mesas del restaurante.
 */
export default async function TablesOnboardingPage({ searchParams }: TablesOnboardingPageProps) {
  const cookieStore = await cookies();
  const resolvedSearchParams = await searchParams;
  const restaurantIdValue = resolvedSearchParams.restaurantId;
  const queryRestaurantId = Array.isArray(restaurantIdValue) ? restaurantIdValue[0] ?? "" : restaurantIdValue ?? "";
  const cookieRestaurantId = cookieStore.get(onboardingRestaurantIdCookieName)?.value ?? "";
  const restaurantId = queryRestaurantId.length > 0 ? queryRestaurantId : cookieRestaurantId;

  if (restaurantId.length === 0) {
    redirect("/onboarding/restaurant");
  }

  const errorValue = resolvedSearchParams.error;
  const errorKey = Array.isArray(errorValue) ? errorValue[0] ?? "" : errorValue ?? "";
  const errorMessage =
    errorKey === "invalidForm"
      ? "Revisa cada mesa. Hay filas con datos incompletos o capacidades inválidas."
      : errorKey === "emptyTables"
        ? "Añade al menos una mesa antes de continuar."
        : errorKey === "duplicateTableName"
          ? "No puede haber dos mesas con el mismo nombre dentro del restaurante."
          : undefined;

  const catalogInfrastructure = getCatalogInfrastructure();
  const restaurant = await catalogInfrastructure.restaurantRepository.findById(restaurantId);

  if (restaurant === null) {
    redirect("/onboarding/restaurant");
  }

  const diningTables = await catalogInfrastructure.diningTableRepository.findByRestaurantId(restaurantId);
  const persistedDraft = parseTablesDraftCookie(cookieStore.get(tablesDraftCookieName)?.value);
  const persistedRows = diningTables.map((diningTable) => ({
    rowKey: diningTable.id,
    id: diningTable.id,
    name: diningTable.toPrimitives().name,
    capacity: diningTable.toPrimitives().capacity,
    isCombinable: diningTable.toPrimitives().isCombinable,
  }));
  const initialRows = getInitialTableRows(persistedRows, persistedDraft, restaurantId, errorMessage !== undefined);

  const currentStepKey = "tables" as const;
  const currentStepNumber = getOnboardingStepNumber(currentStepKey);
  const onboardingSteps = getOnboardingSteps(currentStepKey);

  return (
    <OnboardingShell
      currentStepNumber={currentStepNumber}
      mobilePrimaryAction={{ label: "Continuar", formId: tablesOnboardingFormId, icon: "arrowForward" }}
      steps={onboardingSteps}
      title="Configuración de mesas"
      totalSteps={ONBOARDING_TOTAL_STEPS}
    >
      <div className={tablesPageLayoutClassName}>
        <TablesOnboardingForm action={saveTablesOnboardingAction} errorMessage={errorMessage} initialRows={initialRows} restaurantId={restaurantId} />
        <TablesTipCard />
      </div>
    </OnboardingShell>
  );
}
//-aqui termina pagina TablesOnboardingPage-//

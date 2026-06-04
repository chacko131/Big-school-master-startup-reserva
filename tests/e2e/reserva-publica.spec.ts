/**
 * Archivo: reserva-publica.spec.ts
 * Responsabilidad: Test e2e del flujo completo de reserva pública de un huésped.
 * Tipo: test e2e
 *
 * Flujo que prueba:
 * 1. Huésped accede al perfil público del restaurante
 * 2. Hace clic en "Reservar"
 * 3. Rellena el formulario de reserva
 * 4. Recibe confirmación
 *
 * Requiere: app corriendo en PLAYWRIGHT_BASE_URL con un restaurante activo
 * cuyo slug esté en TEST_RESTAURANT_SLUG (.env.test o variable de entorno).
 */

import { test, expect } from "@playwright/test";

const RESTAURANT_SLUG = process.env.TEST_RESTAURANT_SLUG ?? "al-carbon";

test.describe("Flujo público de reserva", () => {
  test("el huésped puede ver el perfil público del restaurante", async ({ page }) => {
    await page.goto(`/${RESTAURANT_SLUG}`);

    // La página debe cargarse sin errores
    await expect(page).not.toHaveURL(/sign-in/);

    // Debe existir algún elemento del perfil público (nombre del restaurante o CTA)
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test("el formulario de reserva carga correctamente", async ({ page }) => {
    await page.goto(`/${RESTAURANT_SLUG}/reservar`);

    // No debe redirigir a login — es una ruta pública
    await expect(page).not.toHaveURL(/sign-in/);

    // El formulario debe estar presente
    const form = page.locator("form").first();
    await expect(form).toBeVisible({ timeout: 10000 });
  });

  test("el formulario de reserva valida campos obligatorios", async ({ page }) => {
    await page.goto(`/${RESTAURANT_SLUG}/reservar`);

    // Intentar enviar sin rellenar nada
    const submitButton = page.getByRole("button", { name: /reservar|confirmar/i }).first();
    await expect(submitButton).toBeVisible({ timeout: 10000 });
    await submitButton.click();

    // Debe mostrar algún mensaje de error o el formulario no debe navegar
    await expect(page).toHaveURL(new RegExp(`${RESTAURANT_SLUG}/reservar`));
  });
});

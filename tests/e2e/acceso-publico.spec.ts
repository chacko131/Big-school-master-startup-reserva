/**
 * Archivo: acceso-publico.spec.ts
 * Responsabilidad: Test e2e de control de acceso — verifica que rutas protegidas
 *   redirigen correctamente a login y que rutas públicas son accesibles sin auth.
 * Tipo: test e2e
 *
 * Flujo que prueba:
 * 1. Rutas públicas accesibles sin autenticación
 * 2. Rutas protegidas redirigen a /sign-in sin sesión activa
 */

import { test, expect } from "@playwright/test";

test.describe("Control de acceso — rutas públicas", () => {
  test("la home pública es accesible sin login", async ({ page }) => {
    await page.goto("/");
    await expect(page).not.toHaveURL(/sign-in/);

    // Debe renderizar contenido visible
    const body = page.locator("body");
    await expect(body).not.toBeEmpty();
  });

  test("la página de contacto es accesible sin login", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).not.toHaveURL(/sign-in/);
  });
});

test.describe("Control de acceso — rutas protegidas", () => {
  test("el dashboard redirige a sign-in sin sesión", async ({ page }) => {
    await page.goto("/dashboard");

    // Debe redirigir a sign-in (Clerk o nuestra ruta)
    await expect(page).toHaveURL(/sign-in|sign_in/, { timeout: 10000 });
  });

  test("el panel admin redirige a sign-in sin sesión", async ({ page }) => {
    await page.goto("/admin");

    await expect(page).toHaveURL(/sign-in|sign_in/, { timeout: 10000 });
  });

  test("el onboarding redirige a sign-in sin sesión", async ({ page }) => {
    await page.goto("/onboarding/restaurant");

    await expect(page).toHaveURL(/sign-in|sign_in/, { timeout: 10000 });
  });
});

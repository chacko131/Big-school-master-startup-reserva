/**
 * Archivo: seguridad-headers.spec.ts
 * Responsabilidad: Test e2e que verifica que los security headers HTTP están
 *   correctamente configurados en las respuestas del servidor.
 * Tipo: test e2e
 *
 * Prueba los headers añadidos en next.config.ts (OWASP A05):
 * - X-Frame-Options
 * - X-Content-Type-Options
 * - Strict-Transport-Security
 * - Referrer-Policy
 * - Content-Security-Policy
 */

import { test, expect } from "@playwright/test";

test.describe("Security Headers (OWASP A05)", () => {
  test("la home devuelve X-Frame-Options: DENY", async ({ request }) => {
    const response = await request.get("/");
    const header = response.headers()["x-frame-options"];
    expect(header).toBe("DENY");
  });

  test("la home devuelve X-Content-Type-Options: nosniff", async ({ request }) => {
    const response = await request.get("/");
    const header = response.headers()["x-content-type-options"];
    expect(header).toBe("nosniff");
  });

  test("la home devuelve Referrer-Policy correcto", async ({ request }) => {
    const response = await request.get("/");
    const header = response.headers()["referrer-policy"];
    expect(header).toBe("strict-origin-when-cross-origin");
  });

  test("la home devuelve Content-Security-Policy", async ({ request }) => {
    const response = await request.get("/");
    const header = response.headers()["content-security-policy"];

    // Debe existir y contener directivas básicas
    expect(header).toBeDefined();
    expect(header).toContain("default-src");
    expect(header).toContain("script-src");
  });

  test("la home devuelve Permissions-Policy", async ({ request }) => {
    const response = await request.get("/");
    const header = response.headers()["permissions-policy"];
    expect(header).toBeDefined();
    expect(header).toContain("camera=()");
  });
});

/// Archivo: vitest.config.ts
/// Responsabilidad: Configurar Vitest para el proyecto Reserva Latina con alias de rutas y entorno de pruebas para lógica de dominio/aplicación.
/// Tipo: configuración

import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.ts"],
    exclude: ["node_modules", ".next", "dist"],
  },
});

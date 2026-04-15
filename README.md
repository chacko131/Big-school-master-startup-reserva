# Reserva Latina

SaaS modular para reservas y operación de restaurantes latinos.

## Estado actual

- Base técnica definida con **Next.js 16**, **TypeScript**, **Tailwind v4**, **Prisma 7** y **Neon**.
- Arquitectura modular ya organizada en `src/modules/` y `src/app/`.
- Mapa completo de superficies y páginas documentado en `PRODUCT_SURFACES_MAP.md`.
- Prompt maestro para generación visual documentado en `GOOGLE_STITCH_PROMPT.md`.
- Framework visual base revisado desde `stitch_reserva_latina_saas_design_framework/reserva_latina_modern/DESIGN.md`.
- Sistema visual inicial aplicado en `src/app/layout.tsx` y `src/app/globals.css`.

## Lo que ya está listo

- Estructura de carpetas para superficies públicas, dashboard y admin.
- README de carpeta en las nuevas rutas creadas.
- Tipografía base con `Manrope` y `Inter`.
- Paleta base definida con superficies cálidas, negro, verde y terracota.

## Próximo paso recomendado

- Montar los `layout.tsx` de cada superficie.
- Crear páginas base vacías (`page.tsx`) para navegación real.
- Empezar a traducir los diseños a componentes reutilizables.

## Ejecución local

```bash
pnpm dev
```

Abrir `http://localhost:3000` en el navegador.

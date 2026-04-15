# `catalog/infrastructure/adapters`

Contiene los adaptadores técnicos del módulo `catalog`.

## Qué son aquí

Son las clases o funciones que traducen entre el mundo de la aplicación y una tecnología concreta.

## Para qué sirven

- conectar con Prisma
- hablar con APIs externas
- adaptar formatos técnicos a lo que entiende la aplicación

## Ejemplo mental

- la aplicación pide datos
- el adaptador consulta la tecnología externa
- el resultado vuelve en un formato que la aplicación ya entiende

## Estado actual

Ya existe un acceso del módulo `catalog` al cliente Prisma compartido del proyecto, conectado a Neon desde la capa de servicios.

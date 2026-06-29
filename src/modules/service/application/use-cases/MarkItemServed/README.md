# MarkItemServed

Caso de uso para transicionar un ítem de orden de READY a SERVED.
Utilizado por el mesero desde la vista de sala (`/service/floor`) cuando los platos listos llegan a la mesa.

## Archivos

- **`mark-item-served.use-case.ts`** → Lógica pura: valida que el ítem esté en READY y actualiza el estado a SERVED registrando `servedAt`.

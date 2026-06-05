/**
 * Archivo: seed-menu-ecuador.ts
 * Responsabilidad: Poblar la carta de un restaurante ecuatoriano con categorías y platos reales.
 * SOLO USAR EN DESARROLLO.
 *
 * Uso:
 *   npx tsx prisma/seed-menu-ecuador.ts
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import WebSocket from "ws";
import * as dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = WebSocket;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const RESTAURANT_ID = "ff7e38ef-b7d4-4177-9312-477211f859a1";

// ---------------------------------------------------------------------------
// Datos de la carta
// ---------------------------------------------------------------------------

const MENU: Array<{
  category: string;
  sortOrder: number;
  items: Array<{
    name: string;
    description: string | null;
    price: number;
    allergens: string[];
    sortOrder: number;
  }>;
}> = [
  {
    category: "Sopas y caldos",
    sortOrder: 1,
    items: [
      { name: "Caldo de gallina criolla", description: "Caldo tradicional con gallina de campo, yuca y cilantro.", price: 4.5, allergens: [], sortOrder: 1 },
      { name: "Sopa de bolas de verde", description: "Bolas de plátano verde rellenas de carne en caldo.", price: 5.0, allergens: ["gluten"], sortOrder: 2 },
      { name: "Caldo de 31", description: "Caldo contundente con panza, pata y menudencias de res.", price: 4.0, allergens: [], sortOrder: 3 },
      { name: "Yahuarlocro", description: "Locro de papas con sangre cocinada y aguacate.", price: 5.5, allergens: ["lácteos"], sortOrder: 4 },
      { name: "Sancocho de carne", description: "Cocido de carne de res con yuca, plátano y cilantro.", price: 5.0, allergens: [], sortOrder: 5 },
    ],
  },
  {
    category: "Platos fuertes",
    sortOrder: 2,
    items: [
      { name: "Encebollado mixto", description: "Caldo de albacora y camarón con cebolla curtida y chifles.", price: 7.0, allergens: ["pescado", "mariscos"], sortOrder: 1 },
      { name: "Encebollado de atún", description: "Caldo clásico de albacora con yuca, tomate y cebolla morada.", price: 6.5, allergens: ["pescado"], sortOrder: 2 },
      { name: "Seco de pollo", description: "Guiso de pollo al cilantro con arroz y menestra.", price: 7.5, allergens: [], sortOrder: 3 },
      { name: "Seco de chivo", description: "Chivo estofado con cerveza, especias y arroz blanco.", price: 9.0, allergens: [], sortOrder: 4 },
      { name: "Llapingachos con chorizo", description: "Tortillas de papa con chorizo, salsa de maní y ensalada.", price: 7.0, allergens: ["lácteos"], sortOrder: 5 },
      { name: "Fritada con mote", description: "Cerdo frito dorado con mote pelado, maduro y encurtido.", price: 8.0, allergens: [], sortOrder: 6 },
      { name: "Hornado de Riobamba", description: "Cerdo al horno con llapingachos, mote y salsa de pepa.", price: 9.5, allergens: ["lácteos"], sortOrder: 7 },
      { name: "Tilapia frita con patacones", description: "Tilapia entera frita con patacones, arroz y ensalada.", price: 8.5, allergens: ["pescado"], sortOrder: 8 },
      { name: "Camarones al ajillo", description: "Camarones salteados en aceite de ajo, limón y culantro.", price: 11.0, allergens: ["mariscos"], sortOrder: 9 },
      { name: "Seco de pato", description: "Pato guisado lentamente con chicha y especias andinas.", price: 10.0, allergens: [], sortOrder: 10 },
    ],
  },
  {
    category: "Entradas y snacks",
    sortOrder: 3,
    items: [
      { name: "Ceviche de camarón", description: "Camarones frescos marinados en limón, tomate y cebolla.", price: 6.0, allergens: ["mariscos"], sortOrder: 1 },
      { name: "Ceviche de concha negra", description: "Conchas negras curtidas en limón con cebolla y culantro.", price: 7.0, allergens: ["mariscos"], sortOrder: 2 },
      { name: "Patacones con hogao", description: "Plátano verde frito aplastado con salsa de tomate y cebolla.", price: 3.5, allergens: [], sortOrder: 3 },
      { name: "Bolón de verde con queso", description: "Bola de plátano verde frita rellena de queso fresco.", price: 4.0, allergens: ["lácteos"], sortOrder: 4 },
      { name: "Empanadas de viento", description: "Empanadas fritas de masa de harina rellenas de queso.", price: 3.0, allergens: ["gluten", "lácteos"], sortOrder: 5 },
      { name: "Chifles con guacamole", description: "Chifles de plátano verde con guacamole casero.", price: 3.5, allergens: [], sortOrder: 6 },
    ],
  },
  {
    category: "Bebidas",
    sortOrder: 4,
    items: [
      { name: "Jugo de naranjilla", description: "Naranjilla natural licuada con agua y azúcar.", price: 2.5, allergens: [], sortOrder: 1 },
      { name: "Jugo de maracuyá", description: "Maracuyá fresco con agua y azúcar al gusto.", price: 2.5, allergens: [], sortOrder: 2 },
      { name: "Chicha morada", description: "Bebida andina de maíz morado con piña y canela.", price: 2.0, allergens: [], sortOrder: 3 },
      { name: "Agua de Jamaica", description: "Infusión de flor de hibisco fría con azúcar.", price: 2.0, allergens: [], sortOrder: 4 },
      { name: "Colada morada", description: "Colada festiva de harina de maíz negro con frutas.", price: 3.0, allergens: ["gluten"], sortOrder: 5 },
      { name: "Cerveza artesanal Quito", description: "Cerveza lager artesanal con notas cítricas.", price: 4.0, allergens: ["gluten"], sortOrder: 6 },
      { name: "Agua mineral", description: null, price: 1.5, allergens: [], sortOrder: 7 },
      { name: "Gaseosa", description: null, price: 1.5, allergens: [], sortOrder: 8 },
    ],
  },
  {
    category: "Postres",
    sortOrder: 5,
    items: [
      { name: "Dulce de higos con queso", description: "Higos en almíbar de panela servidos con queso fresco.", price: 4.0, allergens: ["lácteos"], sortOrder: 1 },
      { name: "Arroz con leche", description: "Arroz cremoso con canela, leche y azúcar.", price: 3.5, allergens: ["lácteos"], sortOrder: 2 },
      { name: "Pristiños con miel de panela", description: "Buñuelos andinos fritos bañados en miel de panela.", price: 3.5, allergens: ["gluten", "huevo"], sortOrder: 3 },
      { name: "Helado de paila de mora", description: "Helado artesanal de mora batido en paila de bronce.", price: 3.0, allergens: ["lácteos"], sortOrder: 4 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Script principal
// ---------------------------------------------------------------------------

async function main() {
  console.log(`🌿 Iniciando seed de carta ecuatoriana para restaurante ${RESTAURANT_ID}…`);

  let totalCategories = 0;
  let totalItems = 0;

  for (const cat of MENU) {
    // Buscar si ya existe la categoría para no duplicar
    const existing = await prisma.menuCategory.findFirst({
      where: { restaurantId: RESTAURANT_ID, name: cat.category },
    });

    const categoryId = existing?.id ?? undefined;

    const category = categoryId
      ? await prisma.menuCategory.update({
          where: { id: categoryId },
          data: { sortOrder: cat.sortOrder, isActive: true },
        })
      : await prisma.menuCategory.create({
          data: {
            restaurantId: RESTAURANT_ID,
            name: cat.category,
            sortOrder: cat.sortOrder,
            isActive: true,
          },
        });

    totalCategories++;
    console.log(`  📂 Categoría: ${category.name} (${category.id})`);

    for (const item of cat.items) {
      const existingItem = await prisma.menuItem.findFirst({
        where: { categoryId: category.id, name: item.name },
      });

      if (existingItem) {
        await prisma.menuItem.update({
          where: { id: existingItem.id },
          data: {
            description: item.description,
            price: item.price,
            allergens: item.allergens,
            sortOrder: item.sortOrder,
            isAvailable: true,
          },
        });
        console.log(`    ↻ Actualizado: ${item.name}`);
      } else {
        await prisma.menuItem.create({
          data: {
            categoryId: category.id,
            name: item.name,
            description: item.description,
            price: item.price,
            allergens: item.allergens,
            sortOrder: item.sortOrder,
            isAvailable: true,
          },
        });
        console.log(`    ✓ Creado:     ${item.name}`);
      }

      totalItems++;
    }
  }

  console.log(`\n✅ Seed completado — ${totalCategories} categorías, ${totalItems} platos.`);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

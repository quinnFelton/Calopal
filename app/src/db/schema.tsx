import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const foods = sqliteTable('foods', {
  // Auto-generated ID
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // String fields
  name: text('name').notNull(),
  
  // Integer fields
  calories: integer('calories').notNull(),
  carbs: integer('carbs').notNull(),
  proteins: integer('proteins').notNull(),
  fats: integer('fats').notNull(),
  
  // DATETIME field - SQLite stored as ISO string
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const meals = sqliteTable('meals', {
  // Auto-generated ID
  id: integer('id').primaryKey({ autoIncrement: true }),
  // String fields
  name: text('name').notNull(),
  
  // Integer fields
  food: integer('food').notNull(),
  quantity: integer('quantity').notNull(),
  
  // DATETIME field - SQLite stored as ISO string
  date: text('consumed_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// Export Task to use as an interface in app

//foods
export type Food = typeof foods.$inferSelect;
export type InsertFood = typeof foods.$inferInsert;
//meals
export type Meal = typeof meals.$inferSelect;
export type InsertMeal = typeof meals.$inferInsert;

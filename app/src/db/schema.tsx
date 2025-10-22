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

// Export Task to use as an interface in your app
export type Food = typeof foods.$inferSelect;

export type InsertFood = typeof foods.$inferInsert;

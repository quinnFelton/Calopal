import { sql } from 'drizzle-orm';
import { float } from 'drizzle-orm/mysql-core';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const foods = sqliteTable('foods', {
  // Auto-generated ID
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // String fields
  name: text('name').notNull(),
  
  // Float fields for macros
  calories: float('calories').notNull(),
  carbs: float('carbs').notNull(),
  proteins: float('proteins').notNull(),
  fats: float('fats').notNull(),
  
  // Boolean field to track source
  isFromApi: integer('is_from_api', { mode: 'boolean' }).notNull().default(false),
  
  // DATETIME field - SQLite stored as ISO string
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const meals = sqliteTable('meals', {
  // Auto-generated ID
  id: integer('id').primaryKey({ autoIncrement: true }),
  // String fields
  name: text('name').notNull(),
  
  // Float fields for macros
  calories: float('calories').notNull(),
  carbs: float('carbs').notNull(),
  proteins: float('proteins').notNull(),
  fats: float('fats').notNull(),
  
  // DATETIME field - SQLite stored as ISO string
  date: text('consumed_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const meal_components = sqliteTable('meal_components', {
  // ID for Meal connected to Food items
  mealId: integer('meal_id').notNull(),
  // ID for Food item in the Meal
  foodId: integer('food_id').notNull(),
  // Quantity of the food item in the meal (FLOAT)
  quantity: float('quantity').notNull().default(1.0),
});

export const goals = sqliteTable('goals', {
  // Auto-generated ID
  id: integer('id').primaryKey({ autoIncrement: true }),
  //Macro type
  macroType: text('macro_type').notNull(), // e.g., 'calories', 'carbs', 'proteins', 'fats'
  // Goal Min or Goal Max
  minOrMax: integer('min_or_max', { mode: 'boolean' }).notNull(), // true = Min, false = Max
  // Target value for the macro
  targetValue: integer('target_value').notNull(),
  // Completed amount for the macro
  completedValue: integer('completed_value').notNull().default(0),
  // DATETIME field - SQLite stored as ISO string
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  // Completed Yes/No
  isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().default(0),
});

// Export Task to use as an interface in app

//foods
export type Food = typeof foods.$inferSelect;
export type InsertFood = typeof foods.$inferInsert;

//meals
export type Meal = typeof meals.$inferSelect;
export type InsertMeal = typeof meals.$inferInsert;

//meal_components
export type MealComponent = typeof meal_components.$inferSelect;
export type InsertMealComponent = typeof meal_components.$inferInsert;

//goals
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

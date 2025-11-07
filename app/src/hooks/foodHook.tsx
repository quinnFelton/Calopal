import { eq, sql } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";
import { useDrizzle } from "../db/drizzle";
import { foods, type Food, type InsertFood } from "../db/schema";

  // Shape used when creating a new Food from the UI
// All nutrient fields are integers
export type NewFoodInput = {
  name: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  isFromApi?: boolean; // Optional, defaults to false for user-input
};// New foods normalization before insert
function normalizeNewFood(input: NewFoodInput): NewFoodInput {
  return {
    name: input.name.trim(),
    calories: Number.parseInt(String(input.calories), 10) || 0,
    carbs: Number.parseInt(String(input.carbs), 10) || 0,
    proteins: Number.parseInt(String(input.proteins), 10) || 0,
    fats: Number.parseInt(String(input.fats), 10) || 0,
    isFromApi: input.isFromApi ?? false, // Preserve isFromApi flag if set, default false
  };
}

export function useFoods() {
  const db = useDrizzle();
  const [items, setItems] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load all foods (newest first by created_at)
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Order by createdAt DESC;
      const rows =
        (await db
          .select()
          .from(foods)
          .orderBy(sql`${foods.createdAt} DESC`)
          .all?.()) ??
        (await db.select().from(foods).orderBy(sql`${foods.createdAt} DESC`));
      setItems(rows as Food[]);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [db]);
  //making sure it loads initially
  useEffect(() => {
    load();
  }, [load]);

  // Add a new food. Returns the inserted Food row if possible.
  // By default, prevents duplicates by case-sensitive name; set allowDuplicateName=true to skip the check.
  const addFood = useCallback(
    async (
      input: NewFoodInput,
      options?: { allowDuplicateName?: boolean }
    ): Promise<Food | null> => {
      const { allowDuplicateName = false } = options ?? {};
      const normalized = normalizeNewFood(input);

      if (!normalized.name) {
        throw new Error("Name is required.");
      }

      // Optional: block duplicates by exact name
      if (!allowDuplicateName) {
        const existing =
          (await db
            .select()
            .from(foods)
            .where(eq(foods.name, normalized.name))
            .limit(1)
            .all?.()) ??
          (await db
            .select()
            .from(foods)
            .where(eq(foods.name, normalized.name))
            .limit(1));
        if (Array.isArray(existing) && existing[0]) {
          // Already exists; return it
          return existing[0] as Food;
        }
      }

      // Insert
      // Might not need the .run() depending on Drizzle version due to hotswapping
      await (db.insert(foods).values({
        name: normalized.name,
        calories: normalized.calories,
        carbs: normalized.carbs,
        proteins: normalized.proteins,
        fats: normalized.fats,
        isFromApi: normalized.isFromApi ?? false, // Default to false for user input
        // createdAt defaults to CURRENT_TIMESTAMP in schema
      } as InsertFood).run?.() ?? db.insert(foods).values({
        name: normalized.name,
        calories: normalized.calories,
        carbs: normalized.carbs,
        proteins: normalized.proteins,
        fats: normalized.fats,
        isFromApi: normalized.isFromApi ?? false,
      } as InsertFood));

      // Refresh local cache
      await load();

      // Best-effort: return the newly inserted row by name (in case duplicates are allowed,
      // this returns the newest by createdAt)
      const latestByName =
        (await db
          .select()
          .from(foods)
          .where(eq(foods.name, normalized.name))
          .orderBy(sql`${foods.createdAt} DESC`)
          .limit(1)
          .all?.()) ??
        (await db
          .select()
          .from(foods)
          .where(eq(foods.name, normalized.name))
          .orderBy(sql`${foods.createdAt} DESC`)
          .limit(1));
      return (Array.isArray(latestByName) ? latestByName[0] : null) as Food | null;
    },
    [db, load]
  );


   // Quick search by name (LIKE %term%), case-insensitive-ish using lower().
   // NOTE: SQLite’s LIKE is case-insensitive for ASCII, may need some adjustment

  const searchFoods = useCallback(
    async (term: string): Promise<Food[]> => {
      const q = term.trim();
      if (!q) return [];
      const rows =
        (await db
          .select()
          .from(foods)
          .where(sql`lower(${foods.name}) LIKE lower('%' || ${q} || '%')`)
          .orderBy(sql`${foods.createdAt} DESC`)
          .all?.()) ??
        (await db
          .select()
          .from(foods)
          .where(sql`lower(${foods.name}) LIKE lower('%' || ${q} || '%')`)
          .orderBy(sql`${foods.createdAt} DESC`));
      return rows as Food[];
    },
    [db]
  );

  return {
    items,
    loading,
    error,
    refresh: load,
    addFood,
    searchFoods,
  };
}

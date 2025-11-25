import { eq, sql } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";
import { useDrizzle } from "../db/drizzle";
import { foods, meal_components, meals, type InsertMeal, type InsertMealComponent, type Meal } from "../db/schema";

// Shape used when creating a new Meal from the UI
export type NewMealInput = {
  name: string;
  date?: string; // ISO date string, defaults to today
};

// Normalize meal input before insert
function normalizeNewMeal(input: NewMealInput): NewMealInput {
  return {
    name: input.name.trim(),
    date: input.date ?? new Date().toISOString(),
  };
}

// Shape for meal component input
export type NewMealComponentInput = {
  mealId: number;
  foodId: number;
  quantity: number;
};

export function useMeals() {
  const db = useDrizzle();
  const [items, setItems] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load all meals (newest first by date)
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows =
        (await db
          .select()
          .from(meals)
          .orderBy(sql`${meals.date} DESC`)
          .all?.()) ??
        (await db.select().from(meals).orderBy(sql`${meals.date} DESC`));
      setItems(rows as Meal[]);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  // Making sure it loads initially
  useEffect(() => {
    load();
  }, [load]);

  // Create a new meal. Returns the inserted Meal row if possible.
  const createMeal = useCallback(
    async (input: NewMealInput): Promise<Meal | null> => {
      const normalized = normalizeNewMeal(input);

      if (!normalized.name) {
        throw new Error("Meal name is required.");
      }

      try {
        // Insert the meal
        await (db
          .insert(meals)
          .values({
            name: normalized.name,
            date: normalized.date,
            calories: 0,
            carbs: 0,
            proteins: 0,
            fats: 0,
          } as InsertMeal)
          .run?.() ??
          db.insert(meals).values({
            name: normalized.name,
            date: normalized.date,
            calories: 0,
            carbs: 0,
            proteins: 0,
            fats: 0,
          } as InsertMeal));

        // Refresh local cache
        await load();

        // Best-effort: return the newly inserted row by name and date (newest first)
        const latest =
          (await db
            .select()
            .from(meals)
            .where(eq(meals.name, normalized.name))
            .orderBy(sql`${meals.date} DESC`)
            .limit(1)
            .all?.()) ??
          (await db
            .select()
            .from(meals)
            .where(eq(meals.name, normalized.name))
            .orderBy(sql`${meals.date} DESC`)
            .limit(1));
        return (Array.isArray(latest) ? latest[0] : null) as Meal | null;
      } catch (e) {
        setError(e as Error);
        return null;
      }
    },
    [db, load]
  );

  // Add a meal component (link food -> meal with quantity)
  const addMealComponent = useCallback(
    async (input: NewMealComponentInput): Promise<void> => {
      try {
        await (db
          .insert(meal_components)
          .values({
            mealId: input.mealId,
            foodId: input.foodId,
            quantity: input.quantity,
          } as InsertMealComponent)
          .run?.() ??
          db.insert(meal_components).values({
            mealId: input.mealId,
            foodId: input.foodId,
            quantity: input.quantity,
          } as InsertMealComponent));
      } catch (e) {
        setError(e as Error);
      }
    },
    [db]
  );

  // Recalculate macros for a given mealId by summing each component's food macros * quantity
  const recalcMealMacros = useCallback(
    async (mealId: number) => {
      try {
        // Load components joined with foods
        const comps =
          (await db
            .select()
            .from(meal_components)
            .leftJoin(foods, eq(meal_components.foodId, foods.id))
            .where(eq(meal_components.mealId, mealId))
            .all?.()) ??
          (await db
            .select()
            .from(meal_components)
            .leftJoin(foods, eq(meal_components.foodId, foods.id))
            .where(eq(meal_components.mealId, mealId)));

        let totalCalories = 0;
        let totalCarbs = 0;
        let totalProteins = 0;
        let totalFats = 0;

        for (const row of Array.isArray(comps) ? comps : []) {
          const anyRow = row as any;
          const comp = anyRow.meal_components ?? anyRow;
          const food = anyRow.foods ?? anyRow;
          const qty = Number(comp?.quantity ?? 1);
          const cals = Number(food?.calories ?? 0);
          const carbsVal = Number(food?.carbs ?? 0);
          const prot = Number(food?.proteins ?? 0);
          const fatsVal = Number(food?.fats ?? 0);

          totalCalories += cals * qty;
          totalCarbs += carbsVal * qty;
          totalProteins += prot * qty;
          totalFats += fatsVal * qty;
        }

        // Update meal row with recalculated macros
        await (db
          .update(meals)
          .set({
            calories: Math.round(totalCalories),
            carbs: Math.round(totalCarbs),
            proteins: Math.round(totalProteins),
            fats: Math.round(totalFats),
          })
          .where(eq(meals.id, mealId))
          .run?.() ??
          db
            .update(meals)
            .set({
              calories: Math.round(totalCalories),
              carbs: Math.round(totalCarbs),
              proteins: Math.round(totalProteins),
              fats: Math.round(totalFats),
            })
            .where(eq(meals.id, mealId)));

        return { calories: totalCalories, carbs: totalCarbs, proteins: totalProteins, fats: totalFats };
      } catch (e) {
        setError(e as Error);
        return null;
      }
    },
    [db]
  );

  // Get a meal row by id (no components, just the meal record)
  const getMealById = useCallback(
    async (mealId: number): Promise<Meal | null> => {
      try {
        const rows =
          (await db
            .select()
            .from(meals)
            .where(eq(meals.id, mealId))
            .all?.()) ??
          (await db.select().from(meals).where(eq(meals.id, mealId)));
        return Array.isArray(rows) && rows.length ? (rows[0] as Meal) : null;
      } catch (e) {
        setError(e as Error);
        return null;
      }
    },
    [db]
  );

  // Get all foods and their per-food macros for a meal
  const getFoodsForMeal = useCallback(
    async (mealId: number) => {
      try {
        const comps =
          (await db
            .select()
            .from(meal_components)
            .leftJoin(foods, eq(meal_components.foodId, foods.id))
            .where(eq(meal_components.mealId, mealId))
            .all?.()) ??
          (await db
            .select()
            .from(meal_components)
            .leftJoin(foods, eq(meal_components.foodId, foods.id))
            .where(eq(meal_components.mealId, mealId)));

        const list: any[] = [];
        for (const row of Array.isArray(comps) ? comps : []) {
          const anyRow = row as any;
          const comp = anyRow.meal_components ?? anyRow;
          const food = anyRow.foods ?? anyRow;
          const qty = Number(comp?.quantity ?? 1);
          list.push({
            food,
            quantity: qty,
            macros: {
              calories: (Number(food?.calories) || 0) * qty,
              carbs: (Number(food?.carbs) || 0) * qty,
              proteins: (Number(food?.proteins) || 0) * qty,
              fats: (Number(food?.fats) || 0) * qty,
            },
          });
        }
        return list;
      } catch (e) {
        setError(e as Error);
        return [];
      }
    },
    [db]
  );

  // Get meal details including components and food macros per component
  const getMealDetails = useCallback(
    async (mealId: number) => {
      try {
        const mealRows =
          (await db
            .select()
            .from(meals)
            .where(eq(meals.id, mealId))
            .all?.()) ??
          (await db.select().from(meals).where(eq(meals.id, mealId)));
        const meal = Array.isArray(mealRows) ? (mealRows[0] as Meal) : null;
        if (!meal) return null;

        const comps =
          (await db
            .select()
            .from(meal_components)
            .leftJoin(foods, eq(meal_components.foodId, foods.id))
            .where(eq(meal_components.mealId, mealId))
            .all?.()) ??
          (await db
            .select()
            .from(meal_components)
            .leftJoin(foods, eq(meal_components.foodId, foods.id))
            .where(eq(meal_components.mealId, mealId)));

        const componentsDetail: any[] = [];
        let agg = { calories: 0, carbs: 0, proteins: 0, fats: 0 };

        for (const row of Array.isArray(comps) ? comps : []) {
          const anyRow = row as any;
          const comp = anyRow.meal_components ?? anyRow;
          const food = anyRow.foods ?? anyRow;
          const qty = Number(comp?.quantity ?? 1);
          const item = {
            mealComponent: comp,
            food,
            quantity: qty,
            macros: {
              calories: (Number(food?.calories) || 0) * qty,
              carbs: (Number(food?.carbs) || 0) * qty,
              proteins: (Number(food?.proteins) || 0) * qty,
              fats: (Number(food?.fats) || 0) * qty,
            },
          };
          agg.calories += item.macros.calories;
          agg.carbs += item.macros.carbs;
          agg.proteins += item.macros.proteins;
          agg.fats += item.macros.fats;
          componentsDetail.push(item);
        }

        return { meal, components: componentsDetail, aggregated: agg };
      } catch (e) {
        setError(e as Error);
        return null;
      }
    },
    [db]
  );

  // Add a component then recalculate meal macros
  const addComponentAndRecalc = useCallback(
    async (mealId: number, foodId: number, quantity: number) => {
      try {
        await addMealComponent({ mealId, foodId, quantity } as NewMealComponentInput);
        return await recalcMealMacros(mealId);
      } catch (e) {
        setError(e as Error);
        return null;
      }
    },
    [addMealComponent, recalcMealMacros]
  );

  // Quick search by meal name (LIKE %term%), case-insensitive
  const searchMeals = useCallback(
    async (term: string): Promise<Meal[]> => {
      const q = term.trim();
      if (!q) return [];
      const rows =
        (await db
          .select()
          .from(meals)
          .where(sql`lower(${meals.name}) LIKE lower('%' || ${q} || '%')`)
          .orderBy(sql`${meals.date} DESC`)
          .all?.()) ??
        (await db
          .select()
          .from(meals)
          .where(sql`lower(${meals.name}) LIKE lower('%' || ${q} || '%')`)
          .orderBy(sql`${meals.date} DESC`));
      return rows as Meal[];
    },
    [db]
  );

  return {
    items,
    loading,
    error,
    load,
    createMeal,
    addMealComponent,
    recalcMealMacros,
    getMealDetails,
    getMealById,
    getFoodsForMeal,
    addComponentAndRecalc,
    searchMeals,
  } as const;
}

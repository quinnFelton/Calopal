import { eq, sql } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";
import { useDrizzle } from "../db/drizzle";
import { foods, goals, type Food, type Goal, type InsertGoal } from "../db/schema";

// Shape used when creating a new Goal from the UI
export type NewGoalInput = {
  macroType: string; // 'calories' | 'carbs' | 'proteins' | 'fats'
  minOrMax: boolean; // true = Min, false = Max
  targetValue: number;
};

function normalizeNewGoal(input: NewGoalInput): NewGoalInput {
  return {
    macroType: String(input.macroType).trim(),
    minOrMax: !!input.minOrMax,
    targetValue: Number.parseInt(String(input.targetValue), 10) || 0,
  };
}

export function useGoals() {
  const db = useDrizzle();
  const [items, setItems] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows =
        (await db
          .select()
          .from(goals)
          .orderBy(sql`${goals.createdAt} DESC`)
          .all?.()) ??
        (await db.select().from(goals).orderBy(sql`${goals.createdAt} DESC`));
      setItems(rows as Goal[]);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    load();
  }, [load]);

  const addGoal = useCallback(
    async (input: NewGoalInput): Promise<Goal | null> => {
      const normalized = normalizeNewGoal(input);
      if (!normalized.macroType) throw new Error("macroType is required");

      await (db.insert(goals).values({
        macroType: normalized.macroType,
        minOrMax: normalized.minOrMax ? 1 : 0,
        targetValue: normalized.targetValue,
        completedValue: 0,
        isCompleted: 0,
      } as InsertGoal).run?.() ?? db.insert(goals).values({
        macroType: normalized.macroType,
        minOrMax: normalized.minOrMax ? 1 : 0,
        targetValue: normalized.targetValue,
        completedValue: 0,
        isCompleted: 0,
      } as InsertGoal));

      await load();

      const latest =
        (await db
          .select()
          .from(goals)
          .where(eq(goals.macroType, normalized.macroType))
          .orderBy(sql`${goals.createdAt} DESC`)
          .limit(1)
          .all?.()) ??
        (await db
          .select()
          .from(goals)
          .where(eq(goals.macroType, normalized.macroType))
          .orderBy(sql`${goals.createdAt} DESC`)
          .limit(1));
      return (Array.isArray(latest) ? latest[0] : null) as Goal | null;
    },
    [db, load]
  );

  const updateGoal = useCallback(
    async (id: number, updates: Partial<NewGoalInput & { targetValue?: number }>) => {
      const u: any = {};
      if (updates.macroType !== undefined) u.macroType = String(updates.macroType);
      if (updates.minOrMax !== undefined) u.minOrMax = updates.minOrMax ? 1 : 0;
      if (updates.targetValue !== undefined)
        u.targetValue = Number.parseInt(String(updates.targetValue), 10) || 0;

      await db.update(goals).set(u).where(eq(goals.id, id)).run?.();
      await load();
    },
    [db, load]
  );

  const deleteGoal = useCallback(
    async (id: number) => {
      await db.delete(goals).where(eq(goals.id, id)).run?.();
      await load();
    },
    [db, load]
  );

  // Add a food item (by id) and quantity to a goal's completedValue.
  // This will fetch the food, compute the contribution based on the goal's macroType,
  // update completedValue and set isCompleted when target reached/exceeded (for Max)
  const addFoodToGoal = useCallback(
    async (goalId: number, foodId: number, quantity: number = 1) => {
      // fetch goal and food
      const [goalRows, foodRows] = await Promise.all([
        (await db.select().from(goals).where(eq(goals.id, goalId)).limit(1).all?.()) ??
          (await db.select().from(goals).where(eq(goals.id, goalId)).limit(1)),
        (await db.select().from(foods).where(eq(foods.id, foodId)).limit(1).all?.()) ??
          (await db.select().from(foods).where(eq(foods.id, foodId)).limit(1)),
      ]);

      const goal = Array.isArray(goalRows) ? goalRows[0] : null;
      const food = Array.isArray(foodRows) ? (foodRows[0] as Food) : null;
      if (!goal) throw new Error("Goal not found");
      if (!food) throw new Error("Food not found");

      const macro = String(goal.macroType) as keyof Food;
      // safe lookup and numeric conversion
      const base = Number((food as any)[macro] ?? 0);
      const delta = Number(quantity) * base;

      const newCompleted = Number(goal.completedValue || 0) + delta;
      const isCompleted = goal.minOrMax
        ? newCompleted <= Number(goal.targetValue)
        : newCompleted >= Number(goal.targetValue);

      await db
        .update(goals)
        .set({ completedValue: Math.round(newCompleted), isCompleted: isCompleted ? 1 : 0 })
        .where(eq(goals.id, goalId))
        .run?.();

      await load();
    },
    [db, load]
  );

  const getCompletedGoals = useCallback(async (): Promise<Goal[]> => {
    const rows =
      (await db.select().from(goals).where(eq(goals.isCompleted, 1)).all?.()) ??
      (await db.select().from(goals).where(eq(goals.isCompleted, 1)));
    return rows as Goal[];
  }, [db]);

  return {
    items,
    loading,
    error,
    refresh: load,
    addGoal,
    updateGoal,
    deleteGoal,
    addFoodToGoal,
    getCompletedGoals,
  };
}

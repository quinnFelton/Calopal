import { eq, sql } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";
import { useDrizzle } from "../db/drizzle";
import { goals, meals, type Goal, type InsertGoal } from "../db/schema";

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
      
      const updatedRows =
        (await db.select().from(goals).where(eq(goals.id, id)).limit(1).all?.()) ??
        (await db.select().from(goals).where(eq(goals.id, id)).limit(1));
      
      const updatedGoal = Array.isArray(updatedRows) ? (updatedRows[0] as Goal) : null;
      
      if (updatedGoal) {
        const completedValue = Number(updatedGoal.completedValue || 0);
        const targetValue = Number(updatedGoal.targetValue || 0);
        const minOrMax = updatedGoal.minOrMax === 1 || updatedGoal.minOrMax === true;
        
        const isCompleted = minOrMax 
          ? completedValue >= targetValue 
          : completedValue <= targetValue;
        
        await db.update(goals).set({ isCompleted }).where(eq(goals.id, id)).run?.();
      }
      
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

  // Add a meal's macros to all goals created on the same day
  // This fetches the meal, finds all goals for that day, and updates their completedValue
  // based on the meal's macros (calories, carbs, proteins, fats)
  const addMealToGoals = useCallback(
    async (mealId: number) => {
      try {
        // Fetch the meal
        const mealRows =
          (await db.select().from(meals).where(eq(meals.id, mealId)).limit(1).all?.()) ??
          (await db.select().from(meals).where(eq(meals.id, mealId)).limit(1));

        const meal = Array.isArray(mealRows) ? (mealRows[0] as any) : null;
        if (!meal) throw new Error("Meal not found");

        // Extract meal's date (just the date part without time)
        const mealDate = String(meal.date).split('T')[0];

        // Fetch all goals created on the same day
        // Goals are created during onboarding, so we need to find goals where createdAt matches the meal's date
        const goalsRows =
          (await db
            .select()
            .from(goals)
            .where(sql`DATE(${goals.createdAt}) = ${mealDate}`)
            .all?.()) ??
          (await db
            .select()
            .from(goals)
            .where(sql`DATE(${goals.createdAt}) = ${mealDate}`));

        const goalsForDay = Array.isArray(goalsRows) ? (goalsRows as Goal[]) : [];

        // For each goal, add the corresponding macro from the meal to completedValue
        for (const goal of goalsForDay) {
          const macroType = String(goal.macroType).toLowerCase();
          const mealMacro = Number((meal as any)[macroType] ?? 0);

          const newCompleted = Number(goal.completedValue || 0) + mealMacro;
          const isCompleted = goal.minOrMax
            ? newCompleted <= Number(goal.targetValue)
            : newCompleted >= Number(goal.targetValue);

          await db
            .update(goals)
            .set({ completedValue: Math.round(newCompleted), isCompleted: isCompleted })
            .where(eq(goals.id, goal.id))
            .run?.();
        }

        await load();
      } catch (e) {
        throw e;
      }
    },
    [db, load]
  );

  const getCompletedGoals = useCallback(async (): Promise<Goal[]> => {
    const rows =
      (await db.select().from(goals).where(eq(goals.isCompleted, true)).all?.()) ??
      (await db.select().from(goals).where(eq(goals.isCompleted, true)));
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
    addMealToGoals,
    getCompletedGoals,
  };
}

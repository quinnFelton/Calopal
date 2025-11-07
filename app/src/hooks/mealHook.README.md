# useMeals (mealHook) — README

This document explains how to use the updated `useMeals()` hook in `app/src/hooks/mealHook.tsx`.
It's intended for frontend developers who need to create and manage meals and meal components (food items inside meals), and to fetch computed macros (calories, carbs, proteins, fats) at both the meal and per-food levels.

---

## What the hook provides

Call `const { ... } = useMeals()` inside a React component to access the API. The hook returns the following helpers and state:

- `items`: Meal[] — cached list of meals (ordered by `date` / `consumed_at` DESC).
- `loading`: boolean — whether the hook is currently loading meals.
- `error`: Error | null — last error encountered.
- `load()`: Promise<void> — reload the `items` list from the DB.
- `createMeal(input: InsertMeal)`: Promise<Meal | null> — insert a meal row (basic).
- `addMealComponent(input: InsertMealComponent)`: Promise<void> — insert a single meal component (link food to meal).

New higher-level helpers (convenience APIs):
- `addComponentAndRecalc(mealId: number, foodId: number, quantity: number): Promise<{ calories:number, carbs:number, proteins:number, fats:number } | null>`
  - Adds a meal component then recalculates and updates the meal's macros in the `meals` table. Returns the new totals or `null` on error.
- `recalcMealMacros(mealId: number): Promise<{ calories:number, carbs:number, proteins:number, fats:number } | null>`
  - Recalculate macros for the given meal from the `meal_components` table and update the `meals` row.
- `getMealDetails(mealId: number): Promise<{ meal: Meal; components: Array<{ mealComponent:any; food:any; quantity:number; macros: {calories,carbs,proteins,fats} }>; aggregated: {calories,carbs,proteins,fats} } | null>`
  - Returns the meal row, full component detail (including joined `food` data) and aggregated totals.
- `getFoodsForMeal(mealId: number): Promise<Array<{ food:any; quantity:number; macros:{calories,carbs,proteins,fats} }>>`
  - Returns a flattened list of foods for a meal and per-food macros calculated with quantity.

> Note: The hook builds on the shared `db` from `useDrizzle()` and uses Drizzle-ORM queries and joins. Joined rows may be returned in a driver-dependent shape; the hook normalizes common shapes internally.

---

## Important assumptions and behavior

- Totals written back to the `meals` table are rounded using `Math.round`. If you need different rounding behavior, modify the hook.
- The hook uses `useDrizzle()` (the shared Drizzle instance). Ensure `useDatabaseMigrations()`/migration setup runs on app startup so the schema is present.

---




## Example usage — add a single component and recalc

If you want to add a food to an existing meal and immediately update totals:

```tsx
import React from 'react';
import { Button } from 'react-native-paper';
import { useMeals } from '../hooks/mealHook';

export default function AddComponentExample({ mealId }: { mealId: number }) {
  const { addComponentAndRecalc } = useMeals();

  async function handleAdd() {
    const result = await addComponentAndRecalc(mealId, 7, 0.5); // foodId=7, half portion
    if (result) console.log('New totals', result);
  }

  return <Button onPress={handleAdd}>Add Food To Meal</Button>;
}
```

---

## Example usage — read meal details or foods for a meal

To present meal details including each food and the per-food macros:

```tsx
import React, { useEffect, useState } from 'react';
import { useMeals } from '../hooks/mealHook';

export default function MealView({ mealId }: { mealId: number }) {
  const { getMealDetails } = useMeals();
  const [detail, setDetail] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const d = await getMealDetails(mealId);
      setDetail(d);
    })();
  }, [mealId]);

  if (!detail) return null;

  return (
    <>
      <Text>{detail.meal.name}</Text>
      <Text>Totals: {detail.aggregated.calories} cal</Text>
      {detail.components.map((c: any) => (
        <View key={c.mealComponent?.foodId ?? Math.random()}>
          <Text>{c.food?.name ?? 'Unknown'}</Text>
          <Text>Quantity: {c.quantity}</Text>
          <Text>Calories: {c.macros.calories}</Text>
        </View>
      ))}
    </>
  );
}
```

Alternatively, use `getFoodsForMeal(mealId)` if you only need a flattened list of foods and per-food macros.

---

## Edge cases & tips

- Concurrency: If multiple UI flows update the same meal concurrently, consider using an optimistic UI pattern or locking to avoid race conditions.
- Performance: Creating a meal with many components will perform several DB operations—batching could be added if needed.
- Schema changes/migrations: Ensure your `drizzle/migrations.js` and on-device migration flow includes the new `meal_components` table.

---

## Testing

- The hook is easy to unit-test by mocking `useDrizzle()` to return a fake `db` object with spies for `select`, `insert`, `update` and verifying the expected calls and returned computed macros.

---

## Where to look next in code

- Hook implementation: `app/src/hooks/mealHook.tsx`
- Schema definitions (table columns, types): `app/src/db/schema.tsx`
- Shared DB and migrations: `app/src/db/drizzle.tsx` and `drizzle/migrations.js`


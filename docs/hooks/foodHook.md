useFoods Hook – Developer Guide

A React hook for listing, adding, and searching Foods stored in the on-device SQLite database via Drizzle ORM (Expo).

Purpose

Encapsulates DB access so screens/components don’t write SQL.

Normalizes user input (strings → integers, trimmed names).

Prevents duplicate names by default (configurable).

Exposes a simple API: items, loading, error, refresh, addFood, searchFoods.

Prerequisites & Assumptions

App is wrapped with SQLiteProvider and  DB is initialized/migrated before screens render.

You have useDrizzle() available (built from useSQLiteContext()).

Schema matches:

// foods table
name: text (required)
calories: integer
carbs: integer
proteins: integer
fats: integer
createdAt: text (defaults to CURRENT_TIMESTAMP)


Import
import { useFoods } from "@/hooks/useFoods"; // adjust path to your project


API
Return shape
type UseFoodsReturn = {
  items: Food[];                // current foods in memory (newest first)
  loading: boolean;             // true while fetching/adding
  error: Error | null;          // last load/add error (if any)
  refresh: () => Promise<void>; // re-fetch the list
  addFood: (
    input: NewFoodInput,
    options?: { allowDuplicateName?: boolean }
  ) => Promise<Food | null>;    // inserts a food (see behavior)
  searchFoods: (term: string) => Promise<Food[]>; // LIKE search by name
};

Types
export type NewFoodInput = {
  name: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
};

// From your schema:
export type Food = {
  id: number;
  name: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  createdAt: string | null; // default timestamp
};

Behavior Details

Initial load: The hook auto-loads foods on mount, ordering by createdAt DESC.

Normalization: name is trimmed; numeric fields are coerced to integers (invalid → 0).

Duplicates: addFood blocks exact name duplicates by default (allowDuplicateName=false).

Pass { allowDuplicateName: true } to bypass.

On duplicate (blocked), the existing row is returned (no new insert).

After insert: The list is refreshed (refresh()).

Return of addFood: Best-effort returns the newest row with that name (or null).

Search: searchFoods(term) finds rows by name using LIKE '%term%' (case-insensitive via lower()).

Errors: Any error during load/insert sets error and rethrows in addFood so screens can show toasts, etc.

Common Usage
List + Add
import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { useFoods } from "@/hooks/useFoods";

export default function FoodsScreen() {
  const { items, loading, error, addFood, refresh } = useFoods();
  const [name, setName]       = useState("");
  const [cal, setCal]         = useState("0");
  const [carbs, setCarbs]     = useState("0");
  const [proteins, setProt]   = useState("0");
  const [fats, setFats]       = useState("0");

  const onAdd = async () => {
    try {
      await addFood({
        name,
        calories: parseInt(cal || "0", 10),
        carbs: parseInt(carbs || "0", 10),
        proteins: parseInt(proteins || "0", 10),
        fats: parseInt(fats || "0", 10),
      });
      setName(""); setCal("0"); setCarbs("0"); setProt("0"); setFats("0");
    } catch (e) {
      // show toast or error UI
      console.warn("Add food failed:", e);
    }
  };

  if (loading) return <Text>Loading…</Text>;
  if (error)   return <Text style={{ color: "red" }}>{String(error)}</Text>;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Foods</Text>

      <View style={{ gap: 8, marginBottom: 12 }}>
        <TextInput placeholder="Name" value={name} onChangeText={setName} />
        <TextInput placeholder="Calories" value={cal} onChangeText={setCal} keyboardType="numeric" />
        <TextInput placeholder="Carbs" value={carbs} onChangeText={setCarbs} keyboardType="numeric" />
        <TextInput placeholder="Proteins" value={proteins} onChangeText={setProt} keyboardType="numeric" />
        <TextInput placeholder="Fats" value={fats} onChangeText={setFats} keyboardType="numeric" />
        <Button title="Add Food" onPress={onAdd} />
        <Button title="Refresh" onPress={refresh} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <Text>
            {item.name} — {item.calories} kcal (C{item.carbs}/P{item.proteins}/F{item.fats})
          </Text>
        )}
      />
    </View>
  );
}

Search
const results = await searchFoods("banana");


Use this for autocomplete dropdowns or a search page.

Error Handling Patterns

Add form: Wrap addFood in try/catch to surface validation or DB failures.

Page load: If error is set, show a retry button that calls refresh().

Validation: The hook throws if name is empty.

Performance Tips

Defer refresh() if you’re inserting many rows consecutively (batch insert → one refresh).

For huge lists, paginate (add LIMIT/OFFSET) or filter where appropriate.

Add an index on foods(name) if search becomes slow.

Testing Notes

Unit: Mock useDrizzle() to return a fake db with spies for select/insert.

Integration: Use a test SQLite file and verify addFood → refresh updates state.

Check duplicate handling (allowDuplicateName true/false).

Gotchas

On some Drizzle/Expo versions, .all() / .run() may vary. This hook already falls back if one isn’t available.

SQLite LIKE case-sensitivity varies beyond ASCII; lower() is used here for a “good enough” case-insensitive match.

Quick Reference
const { items, loading, error, refresh, addFood, searchFoods } = useFoods();

// add
await addFood({ name: "Oats", calories: 150, carbs: 27, proteins: 5, fats: 3 });

// search
const matches = await searchFoods("oat");

// reload
await refresh();
import { eq, sql } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";
import { useDrizzle } from "../db/drizzle";
import { cosmetics, type Cosmetic, type InsertCosmetic } from "../db/schema";

export type NewCosmeticInput = {
  name: string;
  visible: boolean;
  x_pos: number;
  y_pos: number;
  angle: number;
  scale: number;
  imagePath: string;
  anchoredToPet: boolean;
};

function normalizeCosmetic(input: NewCosmeticInput): NewCosmeticInput {
  return {
    name: input.name.trim(),
    visible: !!input.visible,
    x_pos:  Number.parseInt(String(input.x_pos), 10) || 0,
    y_pos:  Number.parseInt(String(input.y_pos), 10) || 0,
    angle:  Number.parseInt(String(input.angle), 10) || 0,
    scale:  Number.parseInt(String(input.scale), 10) || 1,
    imagePath: input.imagePath.trim(),
    anchoredToPet: !!input.anchoredToPet,
  };
}

export const defaultCosmetics: NewCosmeticInput[] = [
  {
    name: "Cat Bed",
    imagePath: "assets/images/Cosmetics/cat_bed_processed.png",
    anchoredToPet: false,
    visible: false,
    x_pos: 200,
    y_pos: 100,
    angle: 0,
    scale: 1,
  },
  {
    name: "Cat Food",
    imagePath: "assets/images/Cosmetics/cat_food_processed.png",
    anchoredToPet: false,
    visible: false,
    x_pos: 0,
    y_pos: 0,
    angle: 0,
    scale: 1,
  },
  {
    name: "Cat Tree",
    imagePath: "assets/images/Cosmetics/cat_tree_processed.png",
    anchoredToPet: false,
    visible: false,
    x_pos: 10,
    y_pos: 20,
    angle: 5,
    scale: 1,
  },
];

export function useCosmetics() {
  const db = useDrizzle();
  const [items, setItems] = useState<Cosmetic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows =
        (await db.select().from(cosmetics).orderBy(sql`${cosmetics.cosmeticId} DESC`).all?.()) ??
        (await db.select().from(cosmetics).orderBy(sql`${cosmetics.cosmeticId} DESC`));
      setItems(rows as Cosmetic[]);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    load();
  }, [load]);

  const addCosmetic = useCallback(
    async (input: NewCosmeticInput): Promise<Cosmetic | null> => {
      const normalized = normalizeCosmetic(input);
      if (!normalized.name) throw new Error("Name is required.");

      await (db.insert(cosmetics).values({
        name: normalized.name,
        visible: normalized.visible,
        x_pos: normalized.x_pos,
        y_pos: normalized.y_pos,
        angle: normalized.angle,
        scale: normalized.scale,
        imagePath: normalized.imagePath,
        anchoredToPet: normalized.anchoredToPet,
      } as InsertCosmetic));

      await load();
      return null;
    },
    [db, load]
  );

  const toggleVisible = useCallback(
    async (id: number, visible: boolean) => {
      await db.update(cosmetics).set({ visible }).where(eq(cosmetics.cosmeticId, id));
      await load();
    },
    [db, load]
  );

  const updateCosmetic = useCallback(
    async (id: number, updates: Partial<Cosmetic>) => {
      const existing = items.find((c) => c.cosmeticId === id);
      if (!existing) throw new Error("Cosmetic not found.");

      if (existing.anchoredToPet) {
        // If anchored, restrict position + angle updates
        delete updates.x_pos;
        delete updates.y_pos;
        delete updates.angle;
      }

      // name and imagePath are immutable
      delete updates.name;
      delete updates.imagePath;

      await db.update(cosmetics).set(updates).where(eq(cosmetics.cosmeticId, id));
      await load();
    },
    [db, items, load]
  );

  const initializeDefaultCosmetics = useCallback(
    async () => {
      try {
        // Check if cosmetics table is empty
        const existingRows =
          (await db.select().from(cosmetics).limit(1).all?.()) ??
          (await db.select().from(cosmetics).limit(1));
        
        if (Array.isArray(existingRows) && existingRows.length > 0) {
          // Cosmetics already exist, don't add defaults
          return;
        }

        // Add all default cosmetics
        for (const defaultCosmetic of defaultCosmetics) {
          await addCosmetic(defaultCosmetic);
        }
      } catch (e) {
        console.error('Error initializing default cosmetics:', e);
      }
    },
    [db, addCosmetic]
  );

  return {
    items,
    loading,
    error,
    refresh: load,
    addCosmetic,
    toggleVisible,
    updateCosmetic,
    initializeDefaultCosmetics,
  };
}

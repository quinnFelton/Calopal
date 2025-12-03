import { eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';
import { useDrizzle } from '../db/drizzle';
import { userDetails, type InsertUserDetail, type UserDetail } from '../db/schema';

export function useOnboarding() {
  const db = useDrizzle();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<{ onboardingCompleted: boolean | null }>({ onboardingCompleted: null });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Get the first (and should be only) user record
      const rows =
        (await db
          .select()
          .from(userDetails)
          .limit(1)
          .all?.()) ??
        (await db.select().from(userDetails).limit(1));
      setUser(Array.isArray(rows) ? (rows[0] as UserDetail) : null);
      const completed = rows ? Boolean((rows[0] as UserDetail).onboardingCompleted) : null;
      setStatus({ onboardingCompleted: completed });
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    console.log("Status changed:", status.onboardingCompleted);
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  // Initialize user on first launch (if no record exists)
  const initializeUser = useCallback(
    async (userName: string, petName: string): Promise<UserDetail | null> => {
      try {
        const existing =
          (await db.select().from(userDetails).limit(1).all?.()) ??
          (await db.select().from(userDetails).limit(1));
        
        // If a user already exists, don't create a duplicate
        if (Array.isArray(existing) && existing.length > 0) {
          return existing[0] as UserDetail;
        }

        // Create initial user record (onboarding not yet complete)
        await (db.insert(userDetails).values({
          userName: userName.trim(),
          petName: petName.trim(),
          goalsCompleted: 0,
          petState: 12,
          onboardingCompleted: false,
        } as InsertUserDetail).run?.() ?? 
          db.insert(userDetails).values({
            userName: userName.trim(),
            petName: petName.trim(),
            goalsCompleted: 0,
            petState: 12,
            onboardingCompleted: false,
          } as InsertUserDetail));

        await load();
        const latest =
          (await db.select().from(userDetails).limit(1).all?.()) ??
          (await db.select().from(userDetails).limit(1));
        return Array.isArray(latest) ? (latest[0] as UserDetail) : null;
      } catch (e) {
        setError(e as Error);
        return null;
      }
    },
    [db, load]
  );

  // Mark onboarding as complete
  const completeOnboarding = useCallback(async () => {
    try {
      if (!user) throw new Error('No user found');
      await db
        .update(userDetails)
        .set({ onboardingCompleted: true })
        .where(eq(userDetails.userName, user.userName))
        .run?.();
      await load();
    } catch (e) {
      setError(e as Error);
    }
  }, [db, user, load]);

  // Update user data (name, pet name, etc.)
  const updateUser = useCallback(
    async (updates: Partial<InsertUserDetail>) => {
      try {
        if (!user) throw new Error('No user found');
        const u: any = {};
        if (updates.userName !== undefined) u.userName = String(updates.userName);
        if (updates.petName !== undefined) u.petName = String(updates.petName);
        if (updates.goalsCompleted !== undefined) u.goalsCompleted = Number(updates.goalsCompleted);
        if (updates.petState !== undefined) u.petState = Number(updates.petState);

        await db
          .update(userDetails)
          .set(u)
          .where(eq(userDetails.userName, user.userName))
          .run?.();
        await load();
      } catch (e) {
        setError(e as Error);
      }
    },
    [db, user, load]
  );

  // Update lastLoggedIn to current timestamp
  const updateLastLoggedIn = useCallback(async () => {
    try {
      if (!user) throw new Error('No user found');
      const now = new Date().toISOString();
      await db
        .update(userDetails)
        .set({ lastLoggedIn: now })
        .where(eq(userDetails.userName, user.userName))
        .run?.();
      await load();
    } catch (e) {
      setError(e as Error);
    }
  }, [db, user, load]);

  // Add an integer to goalsCompleted
  const addGoalsCompleted = useCallback(
    async (amount: number) => {
      try {
        if (!user) throw new Error('No user found');
        const newTotal = (user.goalsCompleted ?? 0) + amount;
        await db
          .update(userDetails)
          .set({ goalsCompleted: newTotal })
          .where(eq(userDetails.userName, user.userName))
          .run?.();
        await load();
      } catch (e) {
        setError(e as Error);
      }
    },
    [db, user, load]
  );

  const getGoalsCompleted = useCallback((): number => {
    return user?.goalsCompleted ?? 0;
  }, [user]);

  const setGoalsCompleted = useCallback(
    async (newTotal: number) => {
      try {
        if (!user) throw new Error('No user found');
        await db
          .update(userDetails)
          .set({ goalsCompleted: newTotal })
          .where(eq(userDetails.userName, user.userName))
          .run?.();
        await load();
      } catch (e) {
        setError(e as Error);
      }
    },
    [db, user, load]
  );

  return {
    user,
    loading,
    error,
    status,
    refresh: load,
    initializeUser,
    completeOnboarding,
    updateUser,
    updateLastLoggedIn,
    addGoalsCompleted,
    getGoalsCompleted,
    setGoalsCompleted,
  };
}

import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useMemo } from 'react';
import migrations from '../../../drizzle/migrations';
import * as schema from './schema';



export function useDrizzle() {
  const sqlite = useSQLiteContext();
  const db = useMemo(() => drizzle(sqlite, { schema }), [sqlite]);
  return db;
}

export function useDatabaseMigrations() {
  const db = useDrizzle();
  const { success, error } = useMigrations(db, migrations);
  const ready = Boolean(success || error);

  useEffect(() => {
    if (error) console.error('Database migration failed:', error);
    if (success) console.log('Database migrations applied successfully.');
  }, [success, error]);

  return { ready, success, error } as const;
}

export function DatabaseGate({ children }: { children: React.ReactNode }) {
  const { ready } = useDatabaseMigrations();
  if (!ready) return null;
  return <>{children}</>;
}
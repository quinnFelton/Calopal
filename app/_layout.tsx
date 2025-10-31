import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { Suspense, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import migrations from '../drizzle/migrations';

export const DATABASE_NAME = 'calopal.db';

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);

  const [loaded, unloaded] = useFonts({
    'Pixel': require('../assets/font/PixelatedEleganceRegular-ovyAA.ttf'),
  });

  useEffect(() => {
    if (loaded || unloaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, unloaded]);

  if (!loaded && !unloaded) {
    return null;
  }
  //Line 18 to 30 is from Expo documentation of the useFonts hook. Basically it checks if the font is loaded
  //and only hides the splash screen once the font fully loads.

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Calopal Database' }} />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}
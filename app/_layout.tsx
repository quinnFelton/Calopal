import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDatabaseMigrations } from './src/db/drizzle'; // updated import


export const DATABASE_NAME = 'calopal.db';

// Simple loader (probably want something fancier for prod and should be componentized)
function Loader() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" />
    </View>
  );
}

// Renders children only after migrations finish
function DatabaseGate({ children }: { children: React.ReactNode }) {
  const { ready, success, error } = useDatabaseMigrations();

  useEffect(() => {
    if (error) console.error('Database migration failed:', error);
    if (success) console.log('Database migrations applied successfully.');
  }, [success, error]);

  if (!ready) return <Loader />;
  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Pixel: require('../assets/font/PixelatedEleganceRegular-ovyAA.ttf'),
  });

  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return <Loader />;

  return (
    <Suspense fallback={<Loader />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <DatabaseGate>
          <Stack>
            <Stack.Screen name="index" options={{ title: 'Calopal Database' }} />
          </Stack>
        </DatabaseGate>
      </SQLiteProvider>
    </Suspense>
  );
}

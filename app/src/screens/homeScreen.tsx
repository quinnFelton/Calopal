import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from "expo-image";
import { Button } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CatAnim from "../components/catHomeAnim";
import { styles } from "../style/styles";

import { defaultCosmetics, useCosmetics } from "../hooks/cosmeticHook";
import { useOnboarding } from "../hooks/onboardingHook";
import { useGoals } from "../hooks/goalHook";
import { useEffect } from "react";


// IF SIZE IN CATANIME IS CHANGED, VALUES IN CATHOMEANIM MUST BE CHANGED ACCORDINGLY SINCE ITS KINDA HARDCODED WITH THE SIZE

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user, updateLastLoggedIn, refresh: refreshUser } = useOnboarding();
    const { items, addGoal, refresh: refreshGoals } = useGoals();

    function sameDay(a: string, b: string) {
        return a.slice(0, 10) === b.slice(0, 10);
    }

    function getGoalsFromDay(dateStr: string) {
        return items.filter(g => sameDay(g.createdAt, dateStr));
    }

    useEffect(() => {
        if (!user || items.length === 0) return;

        const today = new Date().toISOString().slice(0, 10);
        const last = user.lastLoggedIn
            ? user.lastLoggedIn.slice(0, 10)
            : null;

        // Not the first login today? Skip
        if (last === today) return;

        console.log("✨ First login today — copying yesterday’s goals...");

        async function createGoalsFromYesterday() {
            const todayDate = new Date();
            const yesterdayDate = new Date(todayDate);
            yesterdayDate.setDate(todayDate.getDate() - 1);

            const yesterday = yesterdayDate.toISOString().slice(0, 10);

            // Read yesterday’s goals
            const yGoals = getGoalsFromDay(yesterday);

            console.log("Yesterday's goals:", yGoals);

            // If no goals yesterday → nothing to copy
            if (yGoals.length === 0) {
                console.log("No goals from yesterday — nothing created.");
                await updateLastLoggedIn();
                await refreshUser();
                return;
            }

            // Create today's goals by copying macroType/target/minOrMax
            for (const g of yGoals) {
                await addGoal({
                    macroType: g.macroType,
                    minOrMax: g.minOrMax === 1,   // convert DB int → bool
                    targetValue: g.targetValue
                });
            }

            await refreshGoals();
            await updateLastLoggedIn();
            await refreshUser();

            console.log("📅 New goals created for today!");
        }

        createGoalsFromYesterday();
    }, [user, items]);



  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left','right']}>
        <ImageBackground source={require('../../../assets/images/home_bg.jpg')} contentFit="cover" style={styles.backgroundImage}>
          <CatAnim size = {140}/>
        </ImageBackground>
        <Button mode='contained'
          onPress={() => navigation.navigate('CosmeticScreen')}
          style={styles.cosmeticButton}>
          Add Decorations
        </Button>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
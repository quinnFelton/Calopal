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

        (async () => {
                if (!user.lastLoggedIn) {
                    await updateLastLoggedIn();
                    await refreshUser();
                    return;
                }

                const lastDate = new Date(user.lastLoggedIn);
                const now = new Date();
                const msPerDay = 1000 * 60 * 60 * 24;
                const daysPassed = Math.floor((now.getTime() - lastDate.getTime()) / msPerDay);

                if (daysPassed > 0) {
                    const decayAmount = daysPassed * 2;
                    const newPetState = Math.max(0, (user.petState ?? 0) - decayAmount);

                    console.log(
                        `Pet state decayed: ${user.petState} → ${newPetState} over ${daysPassed} day(s)`
                    );

                    await updateUser({ petState: newPetState });
                    await updateLastLoggedIn();
                    await refreshUser();
                }
            })();

            // --- PET STATE GAIN FROM TODAY'S COMPLETED GOALS ---
            (async () => {
                if (!user) return;

                const completed = await getCompletedGoals();
                const todayStr = new Date().toISOString().slice(0, 10);

                const todaysCompleted = completed.filter(g =>
                    String(g.createdAt).slice(0, 10) === todayStr
                );

                const count = todaysCompleted.length;
                let gain = 0;

                if (count === 2) gain = 2;
                else if (count === 3) gain = 4;
                else if (count >= 4) gain = 5;

                if (gain > 0) {
                    const newPetState = (user.petState ?? 0) + gain;

                    console.log(
                        `Pet state increased from goals: completed ${count} → +${gain}, new state = ${newPetState}`
                    );

                    await updateUser({ petState: newPetState });
                    await refreshUser();
                }
            })();

        console.log("First login today — copying yesterday’s goals...");

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

            console.log("New goals created for today!");
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
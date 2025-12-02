import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { type Goal } from "../db/schema";
import { GlobalProvider } from "./src/context/GlobalContext";
import { useCosmetics } from "./src/hooks/cosmeticHook";
import { useGoals } from "./src/hooks/goalHook";
import { useOnboarding } from "./src/hooks/onboardingHook";
import AddMeal from "./src/screens/AddMeal";
import APIScreen from "./src/screens/apiScreen";
import CosmeticScreen from "./src/screens/CosmeticScreen";
import FoodDriver from "./src/screens/foodDriver";
import FoodList from "./src/screens/foodList";
import GoalScreen from "./src/screens/goalScreen";
import HomeScreen from "./src/screens/homeScreen";
import MealList from "./src/screens/mealList";
import Onboarding from "./src/screens/onboardingScreen";
import { styles } from "./src/style/styles";


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from "./src/screens/onboardingScreen";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function sameDay(day_a: string, day_b: string): boolean {
  // day_a and day_b must both be ISO timestamps
  return (day_a.slice(0, 10) === day_b.slice(0, 10));
}

function getGoalsFromDay(items: Goal[], date: string): Goal[] {
  return items.filter(item => {
    return sameDay(date, item.createdAt);
  });
}

function getMostRecentGoalDate(items: Goal[]): string {
  const day = new Date(0);
  for (const goal of items) {
    const goalDay = new Date(goal.createdAt);
    if (goalDay > day) {
      day.setTime(goalDay.getTime());
    }
  }
  return day.toISOString();
}

//Bottom most nav is for APIScreen, which should be temporary.

function NavBar() {
    return(
        <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarActiveTintColor: 'yellow',
              tabBarInactiveTintColor: 'black',
              tabBarActiveBackgroundColor: '#CDB500',
              tabBarInactiveBackgroundColor: '#CDB500',
              animation: 'shift',
              tabBarShowLabel: false,
              headerShown: false,
              //tabBarStyle:{},
            })}
            backBehavior= 'firstRoute'
          >
            <Tab.Screen
              name="Home"
              component = {HomeScreen}
              options={{
                tabBarIcon: ({size,focused,color}) => {
                  return (
                    <Image source={require('../assets/images/home_icon.png')}
                    style={{width: 30, height: 30, top: +6, tintColor: focused ? 'yellow' : 'black'}}/>
                  );
                },
              }}/>
            <Tab.Screen
              name="Goals"
              component = {GoalScreen}
              options={{
                tabBarIcon: ({size,focused,color}) => {
                  return (
                    <Image source={require('../assets/images/checkered_flag.png')}
                    style={{width: 50, height: 30, top: +6, tintColor: focused ? 'yellow' : 'black'}}/>
                  );
                },
              }}/>
            <Tab.Screen
              name="Input"
              component = {MealList}
              options={{
                tabBarIcon: ({size,focused,color}) => {
                  return (
                    <Image source={require('../assets/images/food_icon.png')}
                    style={{width: 35, height: 35, top: +6, tintColor: focused ? 'yellow' : 'black'}}/>
                  );
                },
              }}/>
          {/*
          <Tab.Screen
            name="Test"
            component = {Onboarding}
            options={{
              tabBarIcon: ({size,focused,color}) => {
                return (
                  <Image source={require('../assets/images/food_icon.png')}
                  style={{width: 35, height: 35, top: +6, tintColor: focused ? 'yellow' : 'black'}}/>
                );
              },
            }}/>
        */}
          </Tab.Navigator>
    );
}

function handleOnboardingScreen(initializeUser, completeOnboarding) {
    console.log("Onboarding never done. Starting Onboarding.");
      return <OnboardingScreen initializeUser={initializeUser} completeOnboarding={completeOnboarding}/>;
}

function handleMainAppScreen() {
    console.log("Onboarding completed. Starting Main App.");
      return (
        <Stack.Navigator>
          <Stack.Screen
            name='NavBar'
            component={NavBar}
            options={{headerShown: false}}
          />

          <Stack.Group screenOptions= {{presentation: 'modal'}}>
            <Stack.Screen name='apiScreen' component={APIScreen} options={{ headerShown: false }}/>
            <Stack.Screen name='foodDriver' component={FoodDriver} options={{ headerShown: false }}/>
            <Stack.Screen name='CosmeticScreen' component={CosmeticScreen} options={{ headerShown: false }}/>
            <Stack.Screen name='foodList' component={FoodList} options={{ headerShown: false }}/>
            <Stack.Screen name='mealList' component={MealList} options={{ headerShown: false }}/>
            <Stack.Screen name='addMeal' component={AddMeal} options={{ headerShown: false }}/>
            <Stack.Screen name='Onboarding' component={Onboarding} options={{ headerShown: false }}/>
          </Stack.Group>
        </Stack.Navigator>
      );
}

export default function Index() {

    const calories_name = "calories";
    const carbs_name = "carbs";
    const protein_name = "proteins";
    const fats_name = "fats";

    const { user, loading, status, error, refresh: refreshOnboarding, initializeUser, completeOnboarding, updateLastLoggedIn } = useOnboarding();
    const { items, refresh: refreshGoals, addGoal } = useGoals();

    const handleNewLogin = async () => {
      if (!user) return; // do nothing if user is null

      const now = new Date();
      const now_string = now.toISOString();
      let lastLogin_string = user.LastLoggedIn;
      if (lastLogin_string === null) {
          lastLogin_string = getMostRecentGoalDate(items).toISOString();
      }
      const lastLogin = new Date({ time: lastLogin_string });

      // New day
      if (sameDay(now_string, lastLogin_string) !== true ) {
        // TODO: Mark past goals as passed or failed

        // TODO: Set new goals
        const lastGoals = getGoalsFromDay(items, lastLogin_string);
        const lastCaloriesGoal = lastGoals.find(goal => goal.MacroType == calories_name);
        const lastProteinsGoal = lastGoals.find(goal => goal.MacroType == protein_name);
        const lastFatsGoal = lastGoals.find(goal => goal.MacroType == fats_name);
        const lastCarbsGoal = lastGoals.find(goal => goal.MacroType == carbs_name);

        if (lastCaloriesGoal !== null) {
          await addGoal({
            macroType: calories_name,
            minOrMax: lastCaloriesGoal.minOrMax,
            targetValue: lastCaloriesGoal.targetValue
          });
        }
        if (lastProteinsGoal !== null) {
          await addGoal({
            macroType: protein_name,
            minOrMax: lastProteinsGoal.minOrMax,
            targetValue: lastProteinsGoal.targetValue
          });
        }
        if (lastFatsGoal !== null) {
          await addGoal({
            macroType: fats_name,
            minOrMax: lastFatsGoal.minOrMax,
            targetValue: lastFatsGoal.targetValue
          });
        }
        if (lastCarbsGoal !== null) {
          await addGoal({
            macroType: carbs_name,
            minOrMax: lastCarbsGoal.minOrMax,
            targetValue: lastCarbsGoal.targetValue
          });
        }

        // TODO: Update pet happiness
      }

      await updateLastLoggedIn();
    };

    const { initializeDefaultCosmetics } = useCosmetics();

    useEffect(() => {
      initializeDefaultCosmetics().catch(e => 
        console.error('Failed to initialize cosmetics:', e)
      );
    }, [initializeDefaultCosmetics]);

    /**
     * Decide which screen to show based on onboarding status
     * First: See if loading is done
     * Second: If not loading, check if onboarding is completed
     * If completed, show main screen
     * If not completed, show onboarding screen
     */
    return (
      <GlobalProvider>
        {loading ? (
          <ActivityIndicator animating={true} styles={styles.loader} />
        ) : (status.onboardingCompleted === null) ? (
          handleOnboardingScreen(initializeUser, completeOnboarding)
        ) : (
          handleMainAppScreen()
        )}
      </GlobalProvider>
    );
}
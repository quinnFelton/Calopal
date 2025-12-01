//import { useState } from "react";
//import { styles } from "./styles";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from 'react-native';
import { GlobalProvider } from "./src/context/GlobalContext";
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


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from "./src/screens/onboardingScreen";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
    const { loading, status, error, refresh, initializeUser, completeOnboarding } = useOnboarding();

    /**
     * Decide which screen to show based on onboarding status
     * First: See if loading is done
     * Second: If not loading, check if onboarding is completed
     * If completed, show main screen
     * If not completed, show onboarding screen
     */
    return (
      <GlobalProvider>
        {(status.onboardingCompleted === null || !status.onboardingCompleted) ? (
          handleOnboardingScreen(initializeUser, completeOnboarding)
        ) : (
          handleMainAppScreen()
        )}
      </GlobalProvider>
    );
}
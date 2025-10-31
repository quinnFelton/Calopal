//import { useState } from "react";
//import { styles } from "./styles";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from 'react-native';
import APIScreen from "../screens/apiScreen";
import FoodDriver from "../screens/foodDriver";
import GoalScreen from "../screens/goalScreen";
import HomeScreen from "../screens/homeScreen";

const Tab = createBottomTabNavigator();

//Bottom most nav is for APIScreen, which should be temporary.

export default function Index() {
    return (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarActiveTintColor: 'yellow',
              tabBarInactiveTintColor: 'black',
              tabBarActiveBackgroundColor: '#CDB500',
              tabBarInactiveBackgroundColor: '#CDB500',
              animation: 'shift',
              tabBarShowLabel: false,
              headerShown: false,
              tabBarStyle:{height:105},
            })}
            backBehavior= 'firstRoute'
          >
            <Tab.Screen 
              name="Home" 
              component = {HomeScreen}
              options={{
                tabBarIcon: ({size,focused,color}) => {
                  return (
                    <Image source={require('./Nav Bar Icons/home_icon.png')}
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
                    <Image source={require('./Nav Bar Icons/checkered_flag.png')}
                    style={{width: 50, height: 30, top: +6, tintColor: focused ? 'yellow' : 'black'}}/>
                  );
                },
              }}/>
            <Tab.Screen 
              name="Input" 
              component = {FoodDriver}
              options={{
                tabBarIcon: ({size,focused,color}) => {
                  return (
                    <Image source={require('./Nav Bar Icons/food_icon.png')}
                    style={{width: 35, height: 35, top: +6, tintColor: focused ? 'yellow' : 'black'}}/>
                  );
                },
              }}/>
            <Tab.Screen 
              name="Temp" 
              component = {APIScreen}
              options={{
                tabBarIcon: ({size,focused,color}) => {
                  return (
                    <Image source={require('./Nav Bar Icons/food_icon.png')}
                    style={{width: 35, height: 35, top: +6, tintColor: focused ? 'yellow' : 'black'}}/>
                  );
                },
              }}/>
          </Tab.Navigator>
    );
}
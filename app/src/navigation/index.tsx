//import { useState } from "react";
//import { styles } from "./styles";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FoodDriver from "../screens/foodDriver";
import GoalScreen from "../screens/goalScreen";
import HomeScreen from "../screens/homeScreen";

const Tab = createBottomTabNavigator();

export default function Index() {
    return (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({size, color}) => {
                if (route.name === 'Home') {
                  return <FontAwesome name={'home'} size={size} color={color} />;
                } else if (route.name === 'Goals') {
                  return <FontAwesome name={'flag-checkered'} size={size} color={color} />;
                } else {
                  return <Ionicons name={'fast-food'} size={size} color={color} />;
                }
              },
              tabBarActiveTintColor: 'yellow',
              tabBarInactiveTintColor: 'black',
              tabBarActiveBackgroundColor: '#CDB500',
              tabBarInactiveBackgroundColor: '#CDB500',
              animation: 'shift',
              tabBarShowLabel: false,
            })}
            backBehavior= 'firstRoute'
          >
            <Tab.Screen name="Home" component = {HomeScreen}/>
            <Tab.Screen name="Goals" component = {GoalScreen}/>
            <Tab.Screen name="Input" component = {FoodDriver}/>
          </Tab.Navigator>
    );
}
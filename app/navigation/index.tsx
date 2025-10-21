import { Text, View } from "react-native";
//import { useState } from "react";
import foodDriver from "../screens/foodDriver";
//import { styles } from "./styles";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View>
      <Text>"This is the home screen.</Text>
    </View>
  )
}

function GoalScreen() {
  return (
    <View>
      <Text>"This is the goal screen.</Text>
    </View>
  )
}

function FoodInputScreen() {
  return (
    <View>
      <Text>"This is the food input screen.</Text>
    </View>
  )
}

export default function Index() {
    return (
          <Tab.Navigator>
            <Tab.Screen name="Home" component = {HomeScreen}/>
            <Tab.Screen name="Goals" component = {GoalScreen}/>
            <Tab.Screen name="Input" component = {foodDriver}/>
          </Tab.Navigator>
      );
}

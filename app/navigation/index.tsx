//import { useState } from "react";
//import { styles } from "./styles";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import foodDriver from "../screens/foodDriver";
import goalScreen from "../screens/goalScreen";
import HomeScreen from "../screens/homeScreen";

const Tab = createBottomTabNavigator();



export default function Index() {
    return (
          <Tab.Navigator>
            <Tab.Screen name="Home" component = {HomeScreen}/>
            <Tab.Screen name="Goals" component = {goalScreen}/>
            <Tab.Screen name="Input" component = {foodDriver}/>
          </Tab.Navigator>
      );
}

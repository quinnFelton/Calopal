import { useState } from "react";
import { Text, TouchableOpacity, View, SafeAreaView } from "react-native";
import { styles } from "../style/styles";
import { TextInput, Button } from 'react-native-paper';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { foods } from '../db/schema';

export default function foodDriver() {
    const  [foodName, setFoodName] = useState("");
    const  [foodEnergy, setFoodEnergy] = useState("");
    const  [foodProtein, setFoodProtein] = useState("");
    const  [foodCarbs, setFoodCarbs] = useState("");
    const  [foodFat, setFoodFat] = useState("");

    const handleSubmit = async () => {

      await drizzle.insert(foods).values({
        name: foodName,
        calories: Number(foodEnergy),
        protein: Number(foodProtein),
        carbs: Number(foodCarbs),
        fat: Number(foodFat),
      });
      setFoodName("");
      setFoodEnergy("");
      setFoodProtein("");
      setFoodCarbs("");
      setFoodFat("");

      };

    return (
    <SafeAreaView style={styles.container}>
              {/* Food Name */}
              <TextInput
                label="Food Name"
                value={foodName}
                onChangeText={setFoodName}
                mode="outlined"
                style={styles.input}
              />

              {/* Numeric Inputs (Energy, Protein, Carbs, Fat) */}

              <View style={styles.row}>
                <TextInput
                  label="Energy (cal)"
                  value={foodEnergy}
                  onChangeText={setFoodEnergy}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.smallInput}
                />
                <TextInput
                  label="Protein (g)"
                  value={foodProtein}
                  onChangeText={setFoodProtein}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.smallInput}
                />
              </View>

              <View style={styles.row}>
                <TextInput
                  label="Carbs (g)"
                  value={foodCarbs}
                  onChangeText={setFoodCarbs}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.smallInput}
                />
                <TextInput
                  label="Fat (g)"
                  value={foodFat}
                  onChangeText={setFoodFat}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.smallInput}
                />
              </View>

              {/* Submit Button */}
              <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                Submit
              </Button>

    </SafeAreaView>
    );
}

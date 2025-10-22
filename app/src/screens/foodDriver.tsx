import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../style/styles";

export default function foodDriver() {
    const  [foodName, setFoodName] = useState("");
    const  [foodEnergy, setFoodEnergy] = useState("");
    const  [foodProtein, setFoodProtein] = useState("");
    const  [foodCarbs, setFoodCarbs] = useState("");
    const  [foodFat, setFoodFat] = useState("");
    const  [finalData, setFinalData] = useState<{ label: string; value: string }[]>([]);
    const handlePress = () => {
        setFinalData([
              { label: "foodName", value: foodName },
              { label: "foodEnergy", value: foodEnergy },
              { label: "foodProtein", value: foodProtein },
              { label: "foodCarbs", value: foodCarbs },
              { label: "foodFat", value: foodFat },
            ]);

        setFoodName('');
        setFoodEnergy('');
        setFoodProtein('');
        setFoodCarbs('');
        setFoodFat('');
        }
  return (
    <View>
      <Text style = {{
          fontSize: 30,
          marginTop: 80,
          textAlign: 'center'
      }}>
        Edit app/index.tsx to edit this screen.
      </Text>

      <View style={styles.container, {height:50}}>
        <TextInput style={styles.input}
        placeholder = "Enter the food's name"
        value = {foodName}
        onChangeText = {setFoodName}
        />
      </View>

      <View style={styles.container, {height:50}}>
              <TextInput style={styles.input}
              placeholder = "Enter the food's energy"
              value = {foodEnergy}
              onChangeText = {setFoodEnergy}
              />
      </View>

      <View style={styles.container, {height:50}}>
              <TextInput style={styles.input}
              placeholder = "Enter the food's protein"
              value = {foodProtein}
              onChangeText = {setFoodProtein}
              />
      </View>

      <View style={styles.container, {height:50}}>
              <TextInput style={styles.input}
              placeholder = "Enter the food's carbs"
              value = {foodCarbs}
              onChangeText = {setFoodCarbs}
              />
      </View>

      <View style={styles.container, {height:50}}>
              <TextInput style={styles.input}
              placeholder = "Enter the food's fat"
              value = {foodFat}
              onChangeText = {setFoodFat}
              />
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.text}>Submit</Text>"
      </TouchableOpacity>

      <Text style={styles.text}>You entered:</Text>
        {finalData.map((item, index) => (
          <Text key={index} style={styles.text}>
            {item.label}: {item.value}
          </Text>
        ))}
    </View>
  );
}
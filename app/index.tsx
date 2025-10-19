import { Text, View, TextInput, Button, StyleSheet, StatusBar, TouchableOpacity} from "react-native";
import { useState } from "react";

export default function Index() {
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: StatusBar.currentHeight
        },
    input: {
        height: 40,
        margin: 12,
        padding: 10,
        borderWidth: 1
        },
    text: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 20
        },
    button: {
        height:50,
        marginTop:70,
        backgroundColor:"#2bbefb"
        }
    })


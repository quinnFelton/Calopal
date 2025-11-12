import { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { styles } from "../style/styles";
import { TextInput, Button, Text } from 'react-native-paper';
import { useFoods } from "../hooks/foodHook"
import { useNavigation } from '@react-navigation/native';

export default function foodDriver() {
    const { addFood, refresh } = useFoods();
    const navigation = useNavigation();
    const  [foodName, setFoodName] = useState("");
    const  [foodEnergy, setFoodEnergy] = useState("");
    const  [foodProtein, setFoodProtein] = useState("");
    const  [foodCarbs, setFoodCarbs] = useState("");
    const  [foodFat, setFoodFat] = useState("");

    const handleSubmit = async () => {

      const NewFood = await addFood({
        name: foodName,
        calories: Number(foodEnergy),
        proteins: Number(foodProtein),
        carbs: Number(foodCarbs),
        fats: Number(foodFat),
      });

      if(NewFood) console.log('item successfuly added');
      else console.log('error adding item');

      setFoodName("");
      setFoodEnergy("");
      setFoodProtein("");
      setFoodCarbs("");
      setFoodFat("");

      };

    return (
    <SafeAreaView style={styles.container}>

      <Text variant='headlineMedium' style={[styles.title, { textAlign: 'center', marginVertical: 12}]}>
        Add a New Food
      </Text>

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

      <Button mode="contained-tonal"
        onPress={() => navigation.navigate('NavBar')}
        style={[styles.button, { backgroundColor: 'EDE6D2'}]}
        textColor="#3B2F2F"
       >
        Back to Home
      </Button>

    </SafeAreaView>
    );
}

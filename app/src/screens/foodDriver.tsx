import { useState } from "react";
import { Modal, View, SafeAreaView } from "react-native";
import { styles } from "../style/styles";
import { TextInput, Button, Text } from 'react-native-paper';
import { useFoods } from "../hooks/foodHook"
import { useNavigation } from '@react-navigation/native';
import { useGlobal } from "../context/GlobalContext";
import { useMeals } from '../hooks/mealHook';

export default function foodDriver() {
    const { mItems, mLoading, mError, mLoad, createMeal, addMealComponent, addComponentAndRecalc, getMealById, getMealDetails, getFoodsForMeal } = useMeals();
    const { addFood, refresh } = useFoods();
    const navigation = useNavigation();
    const  [foodName, setFoodName] = useState("");
    const  [foodEnergy, setFoodEnergy] = useState("");
    const  [foodProtein, setFoodProtein] = useState("");
    const  [foodCarbs, setFoodCarbs] = useState("");
    const  [foodFat, setFoodFat] = useState("");
    const [foodID, setFoodID] = useState('');
    const [modal_active, set_modal_active] = useState(false);
    const [serving, setServing] = useState('');
    const { ActiveFoodID, setActiveFoodID } = useGlobal();

    const handleNumberChange = (text) => {
        // Basic validation to allow numbers and a single decimal point
        const regex = /^\d*\.?\d*$/;
        if (regex.test(text)) {
            setServing(text);
        }
    };

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
      setFoodID(NewFood.id);
      set_modal_active(true);



      };
    const handleMeals = async (servingMultiplier) => {
        const added = await addComponentAndRecalc( ActiveFoodID, foodID, serving );
        console.log("ActiveFoodID", ActiveFoodID);
        console.log("foodID", foodID);
        console.log("serving", serving);

        if(added) console.log('meal component successfuly added', getFoodsForMeal(ActiveFoodID));
        else console.log('error adding meal component', error);
        setServing("");
        set_modal_active(false);

        setFoodName("");
        setFoodEnergy("");
        setFoodProtein("");
        setFoodCarbs("");
        setFoodFat("");
        //navigation.navigate('addMeal');
        navigation.goBack();
        navigation.goBack();
    }

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
        {/*
      <Button mode="contained-tonal"
        onPress={() => navigation.navigate('NavBar')}
        style={[styles.button, { backgroundColor: 'EDE6D2'}]}
        textColor="#3B2F2F"
       >
        Back to Home
      </Button>
        */}
        <Modal visible={modal_active} animationType="slide" onRequestClose={() => {set_modal_active(false)}}>
            <View style={styles.container}>
                <Text style={styles.text}>How many servings?</Text>
                <Text style={styles.title}>{foodName}</Text>
                <Text style={styles.text}>Calories: {foodEnergy}</Text>
                <Text style={styles.text}>Protein: {foodProtein}</Text>
                <Text style={styles.text}>Fat: {foodFat}</Text>
                <Text style={styles.text}>Carbs: {foodCarbs}</Text>
                <TextInput
                    // label="Serving Size"
                    style={styles.input}
                    value={serving}
                    onChangeText={handleNumberChange}
                    keyboardType="numeric" // Displays a numeric keyboard
                    placeholder="Number of servings"
                />
                <Button style={styles.button} onPress={()=>handleMeals()}>
                        Finish
                </Button>
            </View>
        </Modal>
    </SafeAreaView>
    );
}

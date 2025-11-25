import React, { useState, useEffect } from "react";
import { Modal, TouchableOpacity, View, SafeAreaView, FlatList, ScrollView } from "react-native";
import { styles } from "../style/styles";
import { Text, TextInput, Button, ActivityIndicator, List} from 'react-native-paper';
import { useMeals } from '../hooks/mealHook';
import { useGlobal } from "../context/GlobalContext";

import { useFoods } from "../hooks/foodHook"

import { useNavigation } from '@react-navigation/native';

export default function foodList() {
    const { ActiveFoodID, setActiveFoodID } = useGlobal();
    const { items, loading, error, searchFoods, refresh, addFood } = useFoods();
    const { mItems, mLoading, mError, mLoad, createMeal, addMealComponent, addComponentAndRecalc, getMealById, getMealDetails, getFoodsForMeal } = useMeals();
    const [query, setQuery] = useState('');
    const [foodID, setFoodID] = useState('');
    const [foods, setFoods] = useState(items);
    const navigation = useNavigation();
    const [serving, setServing] = useState('');
    const [modal_active, set_modal_active] = useState(false);
    const [savedFood, setSavedFood] = useState<NewFoodInput>({
        name: "",
        calories: 0.0,
        carbs: 0.0,
        proteins: 0.0,
        fats: 0.0,
        isFromApi: false
    });

    const handleNumberChange = (text) => {
            // Basic validation to allow numbers and a single decimal point
        const regex = /^\d*\.?\d*$/;
        if (regex.test(text)) {
            setServing(text);
        }
    };
    const handleSubmit = async (food) => {

        setSavedFood({
        name: food.name,
        calories: food.calories,
        proteins: food.proteins,
        carbs: food.carbs,
        fats: food.fats,
        });

        setFoodID(food.id);
        set_modal_active(true);
    };

    useEffect(() => {
        if(!query)  setFoods(items.slice(1,10));
    }, [items, query]);

    const handleSearch = async () => {
        if (!query.trim()){
            setFoods(items.slice(0,10));
            return;
        }
        const results = await searchFoods(query);
        setFoods(results);
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
        navigation.navigate('addMeal');
    }

    return(
        <SafeAreaView style={styles.container}>

            <View style={styles.row}>
                <Button mode="contained" onPress={() => navigation.navigate('foodDriver')} style={styles.searchButton}>
                    Manually Input
                </Button>

                <Button mode="contained" onPress={() => navigation.navigate('apiScreen')} style={styles.searchButton}>
                    Search
                </Button>
            </View>

            <Text variant='headlineMedium' style={[styles.title, { textAlign: 'center', marginVertical: 12}]}>
                Search Past Eaten Foods
            </Text>

            <TextInput
                mode='outlined'
                label="Food Name"
                value={query}
                onChangeText={setQuery}
                style={styles.input}
            />
            <Button mode="contained" onPress={handleSearch} style={styles.button}>
                Search
            </Button>


            {loading ? (
                <ActivityIndicator animating={true} styles={styles.loader} />
                ) : (
                    <ScrollView contentContainerStyle ={{ paddingVertical: 8}}>
                        {foods.map((food, index) => (
                            <TouchableOpacity key={index} onPress={() => handleSubmit(food)}>
                                <View style={styles.card}>
                                    <Text style={styles.title}> {food.name}</Text>
                                    <Text style={styles.text}>Calories: {food.calories ?? "N/A"} cal </Text>
                                    <Text style={styles.text}>Proteins: {food.proteins ?? "N/A"} g</Text>
                                    <Text style={styles.text}>Fats: {food.fats ?? "N/A"} g</Text>
                                    <Text style={styles.text}>Carbs: {food.carbs ?? "N/A"} g</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

            {error && (
                <Text style={styles.errorMessage}>
                   Error: {error.message}
                </Text>
            )}
            <Modal visible={modal_active} animationType="slide" onRequestClose={() => {set_modal_active(false)}}>
                <View style={styles.container}>
                    <Text style={styles.text}>How many servings?</Text>
                    <Text style={styles.title}>{savedFood.name}</Text>
                    <Text style={styles.text}>Calories: {savedFood.calories}</Text>
                    <Text style={styles.text}>Protein: {savedFood.proteins}</Text>
                    <Text style={styles.text}>Fat: {savedFood.fats}</Text>
                    <Text style={styles.text}>Carbs: {savedFood.carbs}</Text>
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

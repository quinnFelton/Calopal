import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { styles } from "../style/styles";

// import { useFoods } from "../hooks/foodHook"; OLD
import { useMeals } from "../hooks/mealHook";

import { useNavigation } from '@react-navigation/native';

export default function mealList() {
    // const { items, loading, error, searchFoods, refresh, addFood } = useFoods(); OLD
    const { items, loading, error, load, createMeal, addMealComponent,
            recalcMealMacros, getMealDetails, getMealById,
            getFoodsForMeal, addComponentAndRecalc, searchMeals } = useMeals();
    const [query, setQuery] = useState('');
    const [foods, setFoods] = useState(items);
    const [meals, setMeals] = useState(items);
    const navigation = useNavigation();

    const handleSubmit = async (food) => {

        const NewFood = await addFood({
        name: food.name,
        calories: food.calories,
        proteins: food.proteins,
        carbs: food.carbs,
        fats: food.fats
        });

        if (NewFood)
            console.log('item successfully added');
        else
            console.log('error adding item');
    };

    useEffect(() => {
        if(!query)  setMeals(items.slice(0,10));
    }, [items, query]);

    const handleSearch = async () => {
        if (!query.trim()){
            setMeals(items.slice(0,10));
            return;
        }
        const results = await searchMeals(query);
        setFoods(results);
    };

    return(
        <SafeAreaView style={styles.container}>
            <Text variant='headlineMedium' style={[styles.title, { textAlign: 'center', marginVertical: 12}]}>
                Add Meal
            </Text>

            <View style={styles.row}>
                <Button mode="contained" onPress={() => navigation.navigate('addMeal', {refresh: load})} style={styles.searchButton}>
                    Add Meal
                </Button>
            </View>

            <Text variant='headlineMedium' style={[styles.title, { textAlign: 'center', marginVertical: 12}]}>
                Previous Eaten Meals
            </Text>
            {/* TODO: Make this work with getMeals. */}
            {loading ? (
                <ActivityIndicator animating={true} styles={styles.loader} />
                ) : (
                <ScrollView contentContainerStyle ={{ paddingVertical: 8}}>
                    {meals.map((meal, index) => (
                        <TouchableOpacity key={index} onPress={() => {}}>
                            <View style={styles.card}>
                                <Text style={styles.title}>{meal.name}</Text>
                                <Text style={styles.text}>Calories: {meal.calories ?? "N/A"} cal </Text>
                                <Text style={styles.text}>Protein: {meal.proteins ?? "N/A"} g</Text>
                                <Text style={styles.text}>Fat: {meal.fats ?? "N/A"} g</Text>
                                <Text style={styles.text}>Carbs: {meal.carbs ?? "N/A"} g</Text>
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
        </SafeAreaView>
    );
}

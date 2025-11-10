import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, SafeAreaView, ScrollView } from "react-native";
import { styles } from "../style/styles";
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { foods, meals } from '../db/schema';
import { NewFoodInput, useFoods } from '../hooks/foodHook';

interface Nutrient {
  nutrientName: string;
  value: number;
}

interface FoodItem {
  description: string;
  brandName?: string;
  brandOwner?: string;
  foodNutrients: Nutrient[];
}

interface ParsedFood {
  name: string;
  brand: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
}

const APIScreen: React.FC = () => {
    const [query, setQuery] = useState('');
    const [foods, setFoods] = useState<ParsedFood[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { items, uFLoading, error, refresh, addFood, searchFoods } = useFoods();

    // Database stuff

    const handleSubmit = async (food) => {
        console.log(`
            Food: ${food.name}
            Calories: ${food.calories} cal
            Protein: ${food.protein} g
            Fat: ${food.fat} g
            Carbohydrate: ${food.carbs} g
            `);
        // TODO: Send to db
        // Step 0: "Use foods"

        // Step 1: Create a NewFoodInput object
        const clickedFood : NewFoodInput = {
            name: food.name,
            calories: food.calories,
            carbs: food.carbs,
            proteins: food.protein,
            fats: food.fat,
            isFromApi: true
        };
        // Step 2: Add Food
        setLoading(true);
        try {
            await addFood(clickedFood);
        } catch(error) {
            console.error("Adding Food to db error", error)
        } finally {
            setLoading(false);
        }
        // Step 3: ???
        // Step 4: Profit
        setLoading(true);
        try {
            const matches = await searchFoods(food.name);
            await refresh();
            console.log("beep boop!\n", matches, "\nboop beep!");
        } catch(error) {
            console.error("Searching Food in db error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if(!query.trim()) return;
        setLoading(true);

        try{
            const formatedItem = query.trim().replace(/\s+/g, "%20");
            const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=yu3dMVtkcdb0z4lHxEVIxUslBUvAo38pKUajVPYq&query=${formatedItem}&pageSize=10`;
            const response = await fetch(url, {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            });
            const data = await response.json();

            if(!data.foods) {
                // Might want to inform user of a bad search.
                setFoods([]);
                setLoading(false);
                return;
            }
            const parsed = data.foods.slice(0,10).map((item:FoodItem) => {
                const nutrients: Record<string, number | undefined > = {};

                item.foodNutrients.forEach((n: Nutrient) => {
                    if(n.nutrientName.includes("Protein")) nutrients.protein = n.value;
                    if(n.nutrientName.includes("Total lipid")) nutrients.fat = n.value;
                    if(n.nutrientName.includes("Carbohydrate")) nutrients.carbs = n.value;
                    if(n.nutrientName.includes("Energy")) nutrients.calories = n.value;
                });

                return{
                    name: item.description,
                    brand: item.brandName || item.brandOwner || "N/A",
                    calories: nutrients.calories,
                    fat: nutrients.fat,
                    carbs: nutrients.carbs,
                    protein: nutrients.protein
                };
            });

            setFoods(parsed);

        } catch(error) {
            console.error("USDA data error", error);
        } finally {
            setLoading(false)
        }
    };

    return(
        <View style={styles.container}>
            <TextInput
                label="Search Food"
                value={query}
                onChangeText={setQuery}
                mode="outlined"
                style={styles.input}
                />
            <Button
                mode="contained"
                onPress={handleSearch}
                disabled={!query}
                style={styles.button}
                >
                Search
            </Button>

            {loading ? (
                <ActivityIndicator animating={true} styles={styles.loader} />
                ) : (
                    <ScrollView>
                        {foods.map((food, index) => (
                            <TouchableOpacity key={index} onPress={() => handleSubmit(food)}>
                                <View style={styles.card}>
                                    <Text style={styles.title}> {food.name}</Text>
                                    <Text style={styles.brand}>Brand: {food.brand}</Text>
                                    <Text>Calories: {food.calories ?? "N/A"} cal </Text>
                                    <Text>Protein: {food.protein ?? "N/A"} g</Text>
                                    <Text>Fat: {food.fat ?? "N/A"} g</Text>
                                    <Text>Carbs: {food.carbs ?? "N/A"} g</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
    );
};

export default APIScreen;




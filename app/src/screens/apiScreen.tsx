import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, SafeAreaView, ScrollView } from "react-native";
import { styles } from "../style/styles";
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { foods } from '../db/schema';

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

    const handleSubmit = () => {
        console.log({
            foodName,
        });
    };

    const handleSearch = async () => {
        if(!query.trim()) return;
        setLoading(true);

        try{
            const formatedItem = query.trim().replace(/\s+/g, "%20");
            const url = 'https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query=${formatedItem}&pageSize=10';
            const response = await fetch(url);
            const data = await response.json();

            if(!data.foods) {
                setFoods([]);
                setLoading(false);
                return;
            }
            const parsed = data.foods.slice(0,10).map((item:FoodItem) =>{
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
                            <View key={index} style={styles.card}>
                                <Text style={styles.title}> {food.name}</Text>
                                <Text style={styles.brand}>Brand: {food.brand}</Text>
                                <Text>Calories: {food.calories ?? "N/A"} cal </Text>
                                <Text>Protein: {food.protein ?? "N/A"} g</Text>
                                <Text>Fat: {food.fat ?? "N/A"} g</Text>
                                <Text>Carbs: {food.carbs ?? "N/A"} g</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
    );
};

export default APIScreen;




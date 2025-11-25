import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, SafeAreaView, FlatList, ScrollView } from "react-native";
import { styles } from "../style/styles";
import { Text, TextInput, Button, ActivityIndicator, List} from 'react-native-paper';

// import { useFoods } from "../hooks/foodHook"; OLD
import { useMeals } from "../hooks/mealHook";
import FoodList from "foodList";

import { useNavigation } from '@react-navigation/native';

export default function mealList() {
    // const { items, loading, error, searchFoods, refresh, addFood } = useFoods(); OLD
    const { items, loading, error, createMeal, addMealComponent,
            recalcMealMacros, getMealDetails, getMealById,
            getFoodsForMeal, addComponentAndRecalc } = useMeals();
    const [query, setQuery] = useState('');
    const [foods, setFoods] = useState(items);
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

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                <Button mode="contained" onPress={() => navigation.navigate('foodList')} style={styles.searchButton}>
                    Add Meal
                </Button>
            </View>
        </SafeAreaView>
    );
}

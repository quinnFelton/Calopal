import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, SafeAreaView, FlatList, ScrollView } from "react-native";
import { styles } from "../style/styles";
import { Text, TextInput, Button, ActivityIndicator, List} from 'react-native-paper';

import { useMeals } from "../hooks/mealHook"
import { useGlobal } from "../context/GlobalContext";


import { useNavigation } from '@react-navigation/native';

export default function AddMeal() {
    const { items, loading, error, load, createMeal, addMealComponent, getMealDetails} = useMeals();
    const { ActiveFoodID, setActiveFoodID } = useGlobal();
    const [query, setQuery] = useState('');
    const [food, setFood] = useState(items);
    const navigation = useNavigation();

    const handleSearch = async () => {
        const NewMeal = await createMeal({
            name: query,
        });

        if(NewMeal) console.log('meal successfuly created');
        else console.log('error creating meal', error);

        // set global veriable
        setActiveFoodID(NewMeal.id);
        navigation.navigate('foodList');
    };

    const handleDone = async () => {
        // reset global veriable
        setActiveFoodID('');
        navigation.navigate('mealList');
    };

    return(
        <SafeAreaView style={styles.container}>
            <Text variant='headlineMedium' style={[styles.title, { textAlign: 'center', marginVertical: 12}]}>
                Add Meal
            </Text>

            <TextInput
                mode='outlined'
                label="Meal Name"
                value={query}
                onChangeText={setQuery}
                style={styles.input}
            />

            <Button mode="contained" onPress={handleSearch} style={styles.button}>
                Add Item
            </Button>

            <Text variant='headlineMedium' style={[styles.text, { textAlign: 'center', marginVertical: 12}]}>
                Current Items
            </Text>

            {/* display items in meal


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

            */}

            <Button mode="contained" onPress={handleDone} style={styles.button}>
                Done
            </Button>


        </SafeAreaView>
    );

}


import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, SafeAreaView, FlatList, ScrollView } from "react-native";
import { styles } from "../style/styles";
import { Text, TextInput, Button, ActivityIndicator, List} from 'react-native-paper';

import { useFoods } from "../hooks/foodHook"

import { useNavigation } from '@react-navigation/native';

export default function foodList() {
    const { items, loading, error, searchFoods, refresh, addFood } = useFoods();
    const [query, setQuery] = useState('');
    const [foods, setFoods] = useState(items);
    const navigation = useNavigation();

    const handleSubmit = async () => {

        const NewFood = await addFood({
        name: food.name,
        calories: food.calories,
        proteins: food.proteins,
        carbs: food.carbs,
        fats: food.fats,
        });

        if(NewFood){
            console.log('item successfuly added')
        }
        else{
            console.log('error adding item')
        }
        };

    useEffect(() => {
        if(!query) {
            setFoods(items.slice(1,10));
        }
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
                <Button mode="contained" onPress={() => navigation.navigate('foodDriver')} style={styles.searchButton}>
                    Manually Input
                </Button>

                <Button mode="contained" onPress={() => navigation.navigate('apiScreen')} style={styles.searchButton}>
                    Search
                </Button>
            </View>

            <Text variant='headlineMedium' style={{ marginBottom: 8 }}>
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
                    <ScrollView>
                        {foods.map((food, index) => (
                            <TouchableOpacity key={index} onPress={() => handleSubmit(food)}>
                                <View style={styles.card}>
                                    <Text style={styles.title}> {food.name}</Text>
                                    <Text>Calories: {food.calories ?? "N/A"} cal </Text>
                                    <Text>Proteins: {food.proteins ?? "N/A"} g</Text>
                                    <Text>Fats: {food.fats ?? "N/A"} g</Text>
                                    <Text>Carbs: {food.carbs ?? "N/A"} g</Text>
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

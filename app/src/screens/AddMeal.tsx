import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, SafeAreaView, FlatList, ScrollView } from "react-native";
import { styles } from "../style/styles";
import { Text, TextInput, Button, ActivityIndicator, List} from 'react-native-paper';

import { useMeals } from "../hooks/mealHook"

import { useNavigation } from '@react-navigation/native';

export default function AddMeal() {
    const { items, loading, error, load, createMeal, addMealComponent, getMealDetails} = useMeals();
    const [query, setQuery] = useState('');
    const [comp, setComp] = useState(items);
    const navigation = useNavigation();

    const handleSearch = async () => {
        const NewMeal = await createMeal({
            name: query,
        });
        if(NewFood) console.log('meal successfuly created');
        else console.log('error creating meal');

        // set global veriable



    };

    const handleDone = async () => {
        // reset global veriable
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
                Create
            </Button>

            <Button mode="contained" onPress={() => navigation.navigate('foodList')} style={styles.button}>
                Add Item
            </Button>

            <Text variant='headlineMedium' style={[styles.title, { textAlign: 'center', marginVertical: 12}]}>
                Current Items
            </Text>



            <Button mode="contained" onPress={handleDone} style={styles.button}>
                Done
            </Button>


        </SafeAreaView>
    );

}


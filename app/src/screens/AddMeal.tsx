import React, { useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, View } from "react-native";
import { Button, Text, TextInput } from 'react-native-paper';
import { styles } from "../style/styles";

import { useGlobal } from "../context/GlobalContext";
import { useMeals } from "../hooks/mealHook";


import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function AddMeal() {
    const { items, error, load, createMeal, addMealComponent, getMealDetails, getFoodsForMeal} = useMeals();
    const { ActiveFoodID, setActiveFoodID } = useGlobal();
    const [query, setQuery] = useState('');
    const [mealComponents, setMealComponents] = useState<any[]>([]);
    const [componentsLoading, setComponentsLoading] = useState(false);
    const navigation = useNavigation();

    // Load meal components whenever screen is viewed
    useFocusEffect(
        React.useCallback(() => {
            const loadComponents = async () => {
                if (ActiveFoodID) {
                    setComponentsLoading(true);
                    try {
                        const components = await getFoodsForMeal(Number(ActiveFoodID));
                        setMealComponents(components || []);
                    } catch (err) {
                        console.error('Error loading meal components:', err);
                        setMealComponents([]);
                    } finally {
                        setComponentsLoading(false);
                    }
                }
            };
            loadComponents();
        }, [ActiveFoodID, getFoodsForMeal])
    );

    const confirm = async () => {
        const NewMeal = await createMeal({
            name: query,
        });

        if(NewMeal) console.log('meal successfuly created');
        else console.log('error creating meal', error);

        // set global variable
        setActiveFoodID(NewMeal.id);

    };

    const handleSearch = async () => {
        navigation.navigate('foodList');
    };

    const handleDone = async () => {
        // reset global variable
        setActiveFoodID('');
        navigation.navigate('mealList');
        //navigation.goBack();
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

            <Button mode="contained" onPress={confirm} style={styles.button}>
                Confirm Name
            </Button>

            <Button mode="contained" onPress={handleSearch} style={styles.button}>
                Add Item
            </Button>

            <Text variant='headlineMedium' style={[styles.text, { textAlign: 'center', marginVertical: 12}]}>
                Current Items
            </Text>


            {componentsLoading ? (
                <ActivityIndicator animating={true} style={styles.loader} />
                ) : (
                    <ScrollView contentContainerStyle ={{ paddingVertical: 8}}>
                        {mealComponents && mealComponents.length > 0 ? (
                            mealComponents.map((component, index) => (
                                <View key={index} style={styles.card}>
                                    <Text style={styles.title}>{component.food?.name || 'Unknown Food'}</Text>
                                    <Text style={styles.text}>Quantity: {component.quantity}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={[styles.text, { textAlign: 'center', marginVertical: 12}]}>
                                No items added yet
                            </Text>
                        )}
                    </ScrollView>
            )}

            

            <Button mode="contained" onPress={handleDone} style={styles.button}>
                Done
            </Button>


        </SafeAreaView>
    );

}


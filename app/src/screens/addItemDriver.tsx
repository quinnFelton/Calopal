import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Button, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFoods } from '../hooks/foodHook';
import { useMeals } from '../hooks/mealHook';

export default function AddItemScreen() {
  const navigation = useNavigation();
  const { addFood, items: foods } = useFoods();
  const { items: meals, createMeal } = useMeals();
  const [refreshing, setRefreshing] = useState(false);

  // Refresh data when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      setRefreshing(true);
      Promise.all([
        useFoods().refresh(),
        useMeals().load()
      ]).finally(() => setRefreshing(false));
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  
  // Food state
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  // Meal state
  const [mealName, setMealName] = useState('');

  const handleAddFood = async () => {
    try {
      await addFood({
        name: foodName,
        calories: parseFloat(calories),
        proteins: parseFloat(proteins),
        carbs: parseFloat(carbs),
        fats: parseFloat(fats),
        isFromApi: false
      });
      
      // Clear form
      setFoodName('');
      setCalories('');
      setProteins('');
      setCarbs('');
      setFats('');
      
      alert('Food added successfully!');
    } catch (error) {
      alert('Error adding food: ' + (error as Error).message);
    }
  };

  const handleAddMeal = async () => {
    try {
      await createMeal({
        name: mealName,
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0
      });
      
      setMealName('');
      alert('Meal added successfully!');
    } catch (error) {
      alert('Error adding meal: ' + (error as Error).message);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />
      }
    >
      {/* Recently Added Foods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Foods</Text>
        {foods.slice(-3).map((food: any) => (
          <View key={food.id} style={styles.recentItem}>
            <Text style={styles.itemName}>{food.name}</Text>
            <Text style={styles.itemDetails}>
              Calories: {food.calories} | P: {food.proteins}g | C: {food.carbs}g | F: {food.fats}g
            </Text>
          </View>
        ))}
      </View>

      {/* Recently Added Meals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Meals</Text>
        {meals.slice(-3).map((meal: any) => (
          <View key={meal.id} style={styles.recentItem}>
            <Text style={styles.itemName}>{meal.name}</Text>
            <Text style={styles.itemDetails}>
              Calories: {meal.calories} | P: {meal.proteins}g | C: {meal.carbs}g | F: {meal.fats}g
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add New Food</Text>
        <TextInput
          style={styles.input}
          placeholder="Food Name"
          value={foodName}
          onChangeText={setFoodName}
        />
        <TextInput
          style={styles.input}
          placeholder="Calories"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Proteins (g)"
          value={proteins}
          onChangeText={setProteins}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Carbs (g)"
          value={carbs}
          onChangeText={setCarbs}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Fats (g)"
          value={fats}
          onChangeText={setFats}
          keyboardType="numeric"
        />
        <Button title="Add Food" onPress={handleAddFood} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add New Meal</Text>
        <TextInput
          style={styles.input}
          placeholder="Meal Name"
          value={mealName}
          onChangeText={setMealName}
        />
        <Button title="Add Meal" onPress={handleAddMeal} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  recentItem: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#f8f8f8',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
});
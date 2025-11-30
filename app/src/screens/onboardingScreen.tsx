import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useGoals } from '../hooks/goalHook';
import { useOnboarding } from '../hooks/onboardingHook';
import { styles } from '../style/styles';

export default function OnboardingScreen() {
  const { initializeUser, completeOnboarding } = useOnboarding();
  const { addGoal } = useGoals();

  const [userName, setUserName] = useState('');
  const [petName, setPetName] = useState('');
  const [loading, setLoading] = useState(false);

  // Goal states
  const [caloriesTarget, setCaloriesTarget] = useState('2000');
  const [caloriesMinMax, setCaloriesMinMax] = useState(false); // false = max
  const [proteinsTarget, setProteinsTarget] = useState('50');
  const [proteinsMinMax, setProteinsMinMax] = useState(false);
  const [fatsTarget, setFatsTarget] = useState('65');
  const [fatsMinMax, setFatsMinMax] = useState(false);
  const [carbsTarget, setCarbsTarget] = useState('300');
  const [carbsMinMax, setCarbsMinMax] = useState(false);

  const handleComplete = async () => {
    if (!userName.trim() || !petName.trim()) {
      alert('Please enter your name and pet name');
      return;
    }

    setLoading(true);
    try {
      // Initialize user
      await initializeUser(userName, petName);

      // Create initial goals
      await addGoal({ macroType: 'calories', minOrMax: caloriesMinMax, targetValue: Number(caloriesTarget) || 2000 });
      await addGoal({ macroType: 'proteins', minOrMax: proteinsMinMax, targetValue: Number(proteinsTarget) || 50 });
      await addGoal({ macroType: 'fats', minOrMax: fatsMinMax, targetValue: Number(fatsTarget) || 65 });
      await addGoal({ macroType: 'carbs', minOrMax: carbsMinMax, targetValue: Number(carbsTarget) || 300 });

      // Mark onboarding complete
      await completeOnboarding();
      // The parent component (Index) will automatically switch to showing NavBar
      // when it detects that onboardingCompleted has changed to true
    } catch (e) {
      alert(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }

  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingVertical: 16, paddingBottom: 32 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#3B2F2F' }}>Welcome to Calopal! 🐱</Text>

        {/* User Info Section */}
        <View style={styles.card}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#3B2F2F' }}>Tell us about you</Text>
          <TextInput
            label="Your Name"
            value={userName}
            onChangeText={setUserName}
            mode="outlined"
            style={styles.input}
            placeholder="Enter your name"
            outlineColor="#8B7355"
            activeOutlineColor="#CDB500"
            placeholderTextColor="#8B7355"
          />
          <TextInput
            label="Your Pet's Name"
            value={petName}
            onChangeText={setPetName}
            mode="outlined"
            style={styles.input}
            placeholder="Enter your pet's name"
            outlineColor="#8B7355"
            activeOutlineColor="#CDB500"
            placeholderTextColor="#8B7355"
          />
        </View>

        {/* Goals Section */}
        <View style={styles.card}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#3B2F2F' }}>Set Your Daily Goals</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8, marginBottom: 12, gap: 8 }}>
            <Text style={{ flex: 0.8, fontSize: 14, color: '#3B2F2F' }}>Calories</Text>
            <TextInput
              value={caloriesTarget}
              onChangeText={setCaloriesTarget}
              mode="outlined"
              inputMode="numeric"
              style={[styles.input, { flex: 1, marginBottom: 0, marginVertical: 0 }]}
              outlineColor="#8B7355"
              activeOutlineColor="#CDB500"
            />
            <Button
              mode={caloriesMinMax ? 'contained' : 'outlined'}
              onPress={() => setCaloriesMinMax(!caloriesMinMax)}
              buttonColor={caloriesMinMax ? '#CDB500' : undefined}
              textColor={caloriesMinMax ? '#3B2F2F' : '#8B7355'}
            >
              {caloriesMinMax ? 'Min' : 'Max'}
            </Button>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8, marginBottom: 12, gap: 8 }}>
            <Text style={{ flex: 0.8, fontSize: 14, color: '#3B2F2F' }}>Protein (g)</Text>
            <TextInput
              value={proteinsTarget}
              onChangeText={setProteinsTarget}
              mode="outlined"
              inputMode="numeric"
              style={[styles.input, { flex: 1, marginBottom: 0, marginVertical: 0 }]}
              outlineColor="#8B7355"
              activeOutlineColor="#CDB500"
            />
            <Button
              mode={proteinsMinMax ? 'contained' : 'outlined'}
              onPress={() => setProteinsMinMax(!proteinsMinMax)}
              buttonColor={proteinsMinMax ? '#CDB500' : undefined}
              textColor={proteinsMinMax ? '#3B2F2F' : '#8B7355'}
            >
              {proteinsMinMax ? 'Min' : 'Max'}
            </Button>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8, marginBottom: 12, gap: 8 }}>
            <Text style={{ flex: 0.8, fontSize: 14, color: '#3B2F2F' }}>Fat (g)</Text>
            <TextInput
              value={fatsTarget}
              onChangeText={setFatsTarget}
              mode="outlined"
              inputMode="numeric"
              style={[styles.input, { flex: 1, marginBottom: 0, marginVertical: 0 }]}
              outlineColor="#8B7355"
              activeOutlineColor="#CDB500"
            />
            <Button
              mode={fatsMinMax ? 'contained' : 'outlined'}
              onPress={() => setFatsMinMax(!fatsMinMax)}
              buttonColor={fatsMinMax ? '#CDB500' : undefined}
              textColor={fatsMinMax ? '#3B2F2F' : '#8B7355'}
            >
              {fatsMinMax ? 'Min' : 'Max'}
            </Button>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8, gap: 8 }}>
            <Text style={{ flex: 0.8, fontSize: 14, color: '#3B2F2F' }}>Carbs (g)</Text>
            <TextInput
              value={carbsTarget}
              onChangeText={setCarbsTarget}
              mode="outlined"
              inputMode="numeric"
              style={[styles.input, { flex: 1, marginBottom: 0, marginVertical: 0 }]}
              outlineColor="#8B7355"
              activeOutlineColor="#CDB500"
            />
            <Button
              mode={carbsMinMax ? 'contained' : 'outlined'}
              onPress={() => setCarbsMinMax(!carbsMinMax)}
              buttonColor={carbsMinMax ? '#CDB500' : undefined}
              textColor={carbsMinMax ? '#3B2F2F' : '#8B7355'}
            >
              {carbsMinMax ? 'Min' : 'Max'}
            </Button>
          </View>
        </View>

        {/* Info Text */}
        <View style={{ backgroundColor: '#EDE6D2', borderRadius: 8, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: '#8B7355' }}>
          <Text style={{ fontSize: 13, color: '#3B2F2F', lineHeight: 20 }}>
            Min: You need to reach at least this amount{'\n'}
            Max: You should not exceed this amount
          </Text>
        </View>

        {/* Complete Button */}
        <Button
          mode="contained"
          onPress={handleComplete}
          loading={loading}
          disabled={loading}
          style={{ backgroundColor: '#CDB500', borderRadius: 6, paddingVertical: 10, paddingHorizontal: 18, marginVertical: 8 }}
          buttonColor="#CDB500"
          textColor="#3B2F2F"
        >
          Start Your Journey!
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

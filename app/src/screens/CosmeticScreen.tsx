import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import CalopalCheckbox from "../components/CalopalCheckbox.tsx";
import { Cosmetic } from "../db/schema.tsx";
import { useCosmetics } from "../hooks/cosmeticHook.tsx";
import { useOnboarding } from "../hooks/onboardingHook.tsx";
import { styles } from "../style/styles";

function CosmeticCard({cosmetic, index, goalsCompleted}: {cosmetic: Cosmetic, index: number, goalsCompleted: number}) {
  const { toggleVisible } = useCosmetics();
  const [isVisible, setIsVisible] = useState(Boolean(cosmetic.visible));

  // Each card unlocks at: 15, 30, 45, 60, etc.
  const unlockThreshold = (index + 1) * 15;
  const isUnlocked = goalsCompleted >= unlockThreshold;
  const goalsRemaining = Math.max(0, unlockThreshold - goalsCompleted);

  const HandlePress = async () => {
    if (!isUnlocked) return; // Don't allow toggle if locked
    
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    await toggleVisible(Number(cosmetic.cosmeticId), newVisibility);
  }

  // Map the imagePath to the actual image source
  const getImageSource = (imagePath: string) => {
    const path = String(imagePath);
    // Map common cosmetic asset paths
    const imageMap: { [key: string]: any } = {
      'assets/images/Cosmetics/cat_bed_processed.png': require('../../../assets/images/Cosmetics/cat_bed_processed.png'),
      'assets/images/Cosmetics/cat_food_processed.png': require('../../../assets/images/Cosmetics/cat_food_processed.png'),
      'assets/images/Cosmetics/cat_tree_processed.png': require('../../../assets/images/Cosmetics/cat_tree_processed.png'),
    };
    return imageMap[path] || null;
  };

  const imageSource = getImageSource(String(cosmetic.imagePath));

  return(
    <TouchableOpacity onPress={() => HandlePress()} disabled={!isUnlocked}>
      <View style={[
        styles.cosmeticCard,
        !isUnlocked && { opacity: 0.5 }
      ]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{String(cosmetic.name)}</Text>
          {isUnlocked ? (
            <CalopalCheckbox enabled={isVisible} style={{}} />
          ) : (
            <Text style={[styles.text, { color: '#8B7355', marginTop: 8 }]}>
              {goalsRemaining} goals to unlock
            </Text>
          )}
        </View>
        {imageSource && (
          <Image 
            source={imageSource} 
            style={styles.cosmeticCardImage}
            resizeMode="contain"
          />
        )}
      </View>
    </TouchableOpacity>
  )
}

function CardDisplay() {
  const { loading, items, refresh } = useCosmetics();
  const { getGoalsCompleted, setGoalsCompleted } = useOnboarding();
  const [testInput, setTestInput] = useState('');

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const goalsCompleted = getGoalsCompleted();

  const handleSetGoals = async () => {
    const value = Number(testInput);
    if (!isNaN(value)) {
      await setGoalsCompleted(value);
      setTestInput('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { textAlign: 'center', marginVertical: 12 }]}>
        Cosmetics
      </Text>
      
      {loading ? (
        <ActivityIndicator animating={true} style={styles.loader} />
      ) : (
        <>
          <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
            {items && items.length > 0 ? (
              items.map((cosmetic, index) => (
                <CosmeticCard key={Number(cosmetic.cosmeticId)} cosmetic={cosmetic} index={index} goalsCompleted={goalsCompleted} />
              ))
            ) : (
              <Text style={[styles.text, { textAlign: 'center', marginVertical: 12 }]}>
                No cosmetics available
              </Text>
            )}
          </ScrollView>
          
          {/* Test Input for Setting Goals Completed */}
          <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: '#CDB500', backgroundColor: '#F5F5DC' }}>
            <Text style={[styles.text, { marginBottom: 8, fontSize: 12 }]}>TEST: Set Goals Completed</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                value={testInput}
                onChangeText={setTestInput}
                placeholder="Enter number"
                keyboardType="numeric"
                style={{ flex: 1, height: 40 }}
              />
              <Button mode="contained" onPress={handleSetGoals} style={{ justifyContent: 'center' }}>
                Set
              </Button>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

export default CardDisplay;

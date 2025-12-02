import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import CalopalCheckbox from "../components/CalopalCheckbox.tsx";
import { Cosmetic } from "../db/schema.tsx";
import { useCosmetics } from "../hooks/cosmeticHook.tsx";
import { styles } from "../style/styles";

function CosmeticCard({cosmetic}: {cosmetic: Cosmetic}) {
  const { toggleVisible } = useCosmetics();
  const HandlePress = async () => {
    await toggleVisible(Number(cosmetic.cosmeticId), Boolean(!cosmetic.visible));
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
    <TouchableOpacity onPress={() => HandlePress()}>
      <View style={styles.cosmeticCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{String(cosmetic.name)}</Text>
          <CalopalCheckbox enabled={Boolean(cosmetic.visible)} style={{}} />
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
  const { loading, items } = useCosmetics();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { textAlign: 'center', marginVertical: 12 }]}>
        Cosmetics
      </Text>
      
      {loading ? (
        <ActivityIndicator animating={true} style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
          {items && items.length > 0 ? (
            items.map((cosmetic) => (
              <CosmeticCard key={Number(cosmetic.cosmeticId)} cosmetic={cosmetic} />
            ))
          ) : (
            <Text style={[styles.text, { textAlign: 'center', marginVertical: 12 }]}>
              No cosmetics available
            </Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export default CardDisplay;

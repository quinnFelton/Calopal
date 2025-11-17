import { View, Text, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-paper"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "expo-image";
import { Cosmetic } from "../db/schema.tsx"
import { NewCosmeticInput, useCosmetics } from "../hooks/cosmeticHook.tsx";
import CalopalCheckbox from "../components/CalopalCheckbox.tsx";
import { styles } from "../style/styles";

function CosmeticCard({cosmetic, imageSource}: {cosmetic: Cosmetic, imageSource: any}) {
  const { loading, toggleVisible } = useCosmetics();

  const HandlePress = async () => {
    console.log("B-B-B-BOOM!!!");
    await toggleVisible(cosmetic.cosmeticId, !cosmetic.visible);
    console.log("AYO!")
  }

  return(
    <TouchableOpacity onPress={() => HandlePress()}>
      <View style={styles.cosmeticCard}>
        <Image source={imageSource} style={styles.cosmeticCardImage}/>
        <Text style={styles.title}>{cosmetic.name}</Text>
        <CalopalCheckbox enabled={cosmetic.visible} />
      </View>
    </TouchableOpacity>
  )
}

function CardDisplay() {
  const { loading, items } = useCosmetics();

  return (
    <View/>
  );
}

export default function CosmeticScreen() {
  const sample_uri = '../../../assets/images/android-icon-background.png';
  const sample_cosmetic : NewCosmeticInput = {
    name: "Sample",
    visible: false,
    x_pos: 0,
    y_pos: 0,
    angle: 0,
    scale: 1,
    imagePath: sample_uri,
    anchoredToPet: false
  };

  const imageSource = require(sample_uri);

  return (
    <View style={styles.container}>
      <CosmeticCard cosmetic={sample_cosmetic} imageSource={imageSource} />
    </View>
  )
}
import { View, Text } from "react-native";
import { Button } from "react-native-paper"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "expo-image";
import { styles } from "../style/styles";

export default function CosmeticScreen() {
  const bg_uri = "../../../assets/images/home_bg.jpg";

  return (
    <View style={styles.container}>
    <View style={styles.row}>
    <Button style={styles.searchButton} mode="contained">
      Cosmetics
    </Button>
    </View>
    <SafeAreaView style={styles.bgContainer}>
        <ImageBackground
        source={require(bg_uri)}
        contentFit="cover"
        style={styles.backgroundImage}
        >
        </ImageBackground>
    </SafeAreaView>
    </View>
  )
}
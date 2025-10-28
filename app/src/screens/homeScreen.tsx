import { ImageBackground } from "expo-image";
import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../style/styles";

//ImageBackground is currently blank and awaiting proper background image.
//I don't want to upload a Windows XP background to the repo lmao
//10/28/2025 Vinh

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left','right']}>
            <ImageBackground contentFit="cover" style={styles.backgroundImage}>
              <Text style={styles.text}>Some Text Here</Text>
            </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
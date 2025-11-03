import { ImageBackground } from "expo-image";
import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CatAnim from "../components/catHomeAnim";
import { styles } from "../style/styles";

// IF SIZE IN CATANIME IS CHANGED, VALUES IN CATHOMEANIM MUST BE CHANGED ACCORDINGLY SINCE ITS KINDA HARDCODED WITH THE SIZE

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left','right']}>
            <ImageBackground source={require('../../../assets/images/home_bg.jpg')} contentFit="cover" style={styles.backgroundImage}>
              <Text style={styles.text}>Some Text Here</Text>
              <CatAnim source = {require("../../../assets/images/calopal_temppet.png")} size = {140}/>
            </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
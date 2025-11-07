import { ImageBackground } from "expo-image";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CatAnim from "../components/catHomeAnim";
import { styles } from "../style/styles";

// IF SIZE IN CATANIME IS CHANGED, VALUES IN CATHOMEANIM MUST BE CHANGED ACCORDINGLY SINCE ITS KINDA HARDCODED WITH THE SIZE

export default function HomeScreen() {
  const catVis = false
  const dogVis = true
  const monkeyVis = false
  //These variables should be self explanatory I hope.
  //Currently whether the animals are displayed or not is dependent on the opacity style prop.
  //If physics is implement in anyways, need to fix conditional rendering.

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left','right']}>
            <ImageBackground source={require('../../../assets/images/home_bg.jpg')} contentFit="cover" style={styles.backgroundImage}>
                <CatAnim source = {require('../../../assets/images/calopal_temppet.png')} size = {140} visible = {catVis}/>
                <CatAnim source = {require('../../../assets/images/dog.png')} size = {140} visible = {dogVis}/>
                <CatAnim source = {require('../../../assets/images/monkey.png')} size = {140} visible = {monkeyVis}/>
            </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
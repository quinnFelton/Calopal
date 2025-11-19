import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from "expo-image";
import { Button } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CatAnim from "../components/catHomeAnim";
import { styles } from "../style/styles";

// IF SIZE IN CATANIME IS CHANGED, VALUES IN CATHOMEANIM MUST BE CHANGED ACCORDINGLY SINCE ITS KINDA HARDCODED WITH THE SIZE

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left','right']}>
        <ImageBackground source={require('../../../assets/images/home_bg.jpg')} contentFit="cover" style={styles.backgroundImage}>
          <CatAnim source = {require('../../../assets/images/Cat Assets/cat_sit_neutral.png')} size = {140}/>
        </ImageBackground>
        <Button mode='contained'
          onPress={() => navigation.navigate('CosmeticScreen')}
          style={styles.cosmeticButton}>
          Add Decorations
        </Button>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
import { Text, View, TextInput, Button, StyleSheet, StatusBar, TouchableOpacity} from "react-native";
import { useState } from "react";

export default function Index() {
    const  [food, setFood] = useState("");
    const  [finalData, setFinalData] = useState("");
    const handlePress = () => {
        setFinalData(food);
        setFood('');
        }
  return (
    <View>
      <Text style = {{
          fontSize: 30,
          marginTop: 80,
          textAlign: 'center'
      }}>
        Edit app/index.tsx to edit this screen.
      </Text>

      <View style={styles.container}>
        <TextInput style={styles.input}
        placeholder = "Enter food"
        value = {food}
        onChangeText = {setFood}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.text}>Submit</Text>"
      </TouchableOpacity>

      <Text style={styles.text}>
          You entered: {finalData}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight
        },
    input: {
        height: 40,
        margin: 12,
        padding: 10,
        borderWidth: 1
        },
    text: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 20
        },
    button: {
        height:50,
        marginTop:70,
        backgroundColor:"#2bbefb"
        }
    })


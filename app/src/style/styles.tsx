import { Text, View, TextInput, Button, StyleSheet, StatusBar, TouchableOpacity} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: StatusBar.currentHeight,
        height:50
        },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
      },
    input: {
        marginBottom: 20
//         height: 40,
//         margin: 12,
//         padding: 10,
//         borderWidth: 1
        },
    smallInput: {
        flex:1,
        marginHorizontal: 5
        },
    text: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 20
        },
    button: {
//         height:50,
//         marginTop:70,
        backgroundColor:"#2bbefb"
        }
    })
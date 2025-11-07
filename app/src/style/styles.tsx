import { StatusBar, StyleSheet } from "react-native";
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

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
    goalItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
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
        fontSize: 15,
        fontFamily: 'Pixel'
        },
    //Pixel font is kinda huge compared to stock, so be aware of that when setting custom font sizes.
    button: {
//         height:50,
//         marginTop:70,
        backgroundColor:"#2bbefb"
        },
    //Pixel font is kinda huge compared to stock, so be aware of that when setting custom font sizes.
    goalText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 15,
        fontFamily: 'Pixel'
    },
    goalTextSuccess: {
        color: "green"
    },
    goalTextFailure: {
        color: "grey"
    },
    GoalInputButton: {
        height: 25,
        width: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eee",
        borderWidth: 1,
        borderColor: "#ccc"
    },
    GoalInputButtonSelected: {
        backgroundColor: "#66a3ff",
        borderColor: "#007bff"
    },

    loader: {
        marginTop:40,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    },
    brand: {
        fontSize: 14,
        marginBottom: 6,
        color: "#666666"
    },
    //The style below is a style that should let the image used in ImageBackground 
    //sufficiently cover the whole screen without distorting the original image.
    backgroundImage: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        flex: 1,
        alignItems: "center"
    },
    searchButton:{
        width: width * 0.5,
        backgroundColor: "#CDB500",
        borderRadius: 5,
        elevation: 4,
    },
    errorMessage:{
        color:"red",
        marginBottom:8
    }
    })
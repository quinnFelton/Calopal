import { StatusBar, StyleSheet } from "react-native";
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D2B48C',
        paddingTop: StatusBar.currentHeight,
        paddingHorizontal: 16,
        },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
        gap: 16,
      },
    goalItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      },
    input: {
//         marginBottom: 20
        marginVertical: 10,
        borderRadius: 8,
        backgroundColor: '#FFFDF5',
        },
    smallInput: {
        flex:1,
        marginHorizontal: 5,
        borderRadius: 8,
        backgroundColor: '#FFFDF5',
        },
    text: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 15,
        fontFamily: 'Pixel',
        color: `#3B2F2F`
        },
    //Pixel font is kinda huge compared to stock, so be aware of that when setting custom font sizes.
    button: {
//         height:50,
//         marginTop:70,
        backgroundColor:"#CDB500",
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        elevation: 3,
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
        backgroundColor: "#EDE6D2",
        borderWidth: 1,
        borderColor: "#8B7355",
        marginVertical: 2,
        borderRadius: 4,
    },
    GoalInputButtonSelected: {
        backgroundColor: "#CDB500",
        borderColor: "#A68A00"
    },

    loader: {
        marginTop:40,
        alignSelf: 'center',
    },
    card: {
        backgroundColor: "#F5F5DC",
        borderRadius: 8,
        padding: 14,
        marginBottom: 10,
        shadowColor: "#000000",
        shadowOpacity: 0.05,
        shadowOffset: {width: 0, height: 1},
        shadowRadius: 2,
        elevation: 3,
        borderWidth: 2,
        borderColor: "#8B7355"
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
        color: '#3B2F2F',
        fontFamily: 'Pixel',
    },
    brand: {
        fontSize: 14,
        marginBottom: 6,
        fontFamily: 'Pixel',
        color: "#8B7355"
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
//         width: width * 0.5,
        flex: 1,
        backgroundColor: "#CDB500",
        borderRadius: 6,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    errorMessage:{
        color:"red",
        marginBottom:8
    },
    cosmeticButton:{
        backgroundColor:"#CDB500",
        textColor: "white",
        borderRadius: 6,
        //paddingVertical: 10,
        //paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'left',
        marginVertical: 8,
        elevation: 3,
    },
    bgContainer:{
        flex: 1,
        margin: 16,
    },
    cosmeticCard:{
      backgroundColor: "#F5F5DC",
      borderRadius: 8,
      padding: 14,
      marginBottom: 10,
      shadowColor: "#000000",
      shadowOpacity: 0.05,
      shadowOffset: {width: 0, height: 1},
      shadowRadius: 2,
      elevation: 3,
      borderWidth: 2,
      borderColor: "#8B7355",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    cosmeticCardImage:{
      width: 64,
      height: 64,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: "#8B7355",
      backgroundColor: "rgba(70, 50, 25, 0.3)"
    },
    CalopalCheckboxEnabled:{
      backgroundColor: "rgba(70, 50, 25, 0.3)",
      borderRadius: 8,
      width: 32,
      height: 32,
      borderWidth: 3,
      borderColor: "#8B7355",
      justifyContent: 'center'
    },
    CalopalCheckboxDisabled:{
        width: 32,
        height: 32,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#8B7355",
        justifyContent: 'center'
    },
    CalopalCheckboxText:{
      fontFamily: 'Pixel',
      textAlign: 'center',
      color: "#4f4131",
    }
    })
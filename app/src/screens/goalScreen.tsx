import { Text, View, SafeAreaView } from "react-native";
import { Button } from 'react-native-paper';
import { styles } from "../style/styles";

//Currently just placeholder information to verify that nav bar works. | 10/21/2025 | Vinh

function GoalDisplay(
    {calories, protein, carbs, fat, calories_goal, protein_goal, carbs_goal, fat_goal}: {
    calories: number; protein: number;
    carbs: number; fat: number;
    calories_goal: number; protein_goal: number;
    carbs_goal: number; fat_goal: number;
    }) {
    return (
        <View>
            <View style={styles.row}>
                <View style={styles.goalItem}>
                    <Text style={styles.text}>Daily Report</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.goalItem}>
                    <Text style={styles.text}>{calories}/{calories_goal}</Text>
                    <Text>Calories</Text>
                </View>
                <View style={styles.goalItem}>
                    <Text style={styles.text}>{protein}/{protein_goal}</Text>
                    <Text>Protein (g)</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.goalItem}>
                    <Text style={styles.text}>{fat}/{fat_goal}</Text>
                    <Text>Fat (g)</Text>
                </View>

                <View style={styles.goalItem}>
                    <Text style={styles.text}>{carbs}/{carbs_goal}</Text>
                    <Text>Carbs (g)</Text>
                </View>
            </View>

        </View>
    )
}

export default function goalScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <GoalDisplay
      calories={500} protein={10} fat={60} carbs={60}
      calories_goal={2000} protein_goal={50} fat_goal={50} carbs_goal={50}
      />
      <Button style={styles.button}>Modify Goals</Button>
    </SafeAreaView>
  )
}
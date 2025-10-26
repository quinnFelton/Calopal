import { useState } from "react";
import { Text, View, Modal, SafeAreaView, Pressable } from "react-native";
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

function GoalInput({name, default_value, min_value, onChange}:
    {name: string; default_value: number; min_value: number; onChange: (value: number) => void;
    }) {
    const [value, setValue] = useState(default_value);

    const increment = () => {
        setValue((prev) => {
            const new_value = prev + 1;
            onChange?.(new_value);
            return new_value;
        });
    }

    const decrement = () => {
        setValue((prev) => {
            const new_value = Math.max(prev - 1, min_value);
            onChange?.(new_value);
            return new_value;
        });
    }

    return (
        <View style={styles.GoalInput}>
            <View style={styles.GoalInputBody}>
                <Text style={styles.GoalInputText}>{value}</Text>
                <View style={styles.GoalInputStepper}>
                    <Pressable onPress={increment} style={styles.GoalInputButton}>
                    <Text>+</Text>
                    </Pressable>
                    <Pressable onPress={decrement} style={styles.GoalInputButton}>
                    <Text>-</Text>
                    </Pressable>
                </View>
             </View>
            <Text>{name}</Text>
        </View>
    )
}

export default function goalScreen() {
  const [calories, setCalories] = useState(500);
  const [protein, setProtein] = useState(10);
  const [fat, setFat] = useState(60);
  const [carbs, setCarbs] = useState(60);

  const [calories_goal, setCaloriesGoal] = useState(2000);
  const [protein_goal, setProteinGoal] = useState(50);
  const [fat_goal, setFatGoal] = useState(50);
  const [carbs_goal, setCarbsGoal] = useState(50);

  const [modal_active, set_modal_active] = useState(false);
  const [calories_modal, setCaloriesModal] = useState(calories_goal);
  const [protein_modal, setProteinModal] = useState(protein_goal);
  const [fat_modal, setFatModal] = useState(fat_goal);
  const [carbs_modal, setCarbsModal] = useState(carbs_goal);

  const updateGoals = () => {
      setCaloriesGoal(calories_modal);
      setProteinGoal(protein_modal);
      setFatGoal(fat_modal);
      setCarbsGoal(carbs_modal);
      set_modal_active(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <GoalDisplay
      calories={calories} protein={protein} fat={fat} carbs={carbs}
      calories_goal={calories_goal} protein_goal={protein_goal}
      fat_goal={fat_goal} carbs_goal={carbs_goal}
      />
      <Modal visible={modal_active} animationType="slide">
        <View style={styles.container}>
            <Text style={styles.text}>Modify Goals</Text>
            <GoalInput name="Calories" default_value={calories_goal} min_value={0}
            onChange={(val) => setCaloriesModal(val)}/>
            <GoalInput name="Protein" default_value={protein_goal} min_value={0}
            onChange={(val) => setProteinModal(val)}/>
            <GoalInput name="Fat" default_value={fat_goal} min_value={0}
            onChange={(val) => setFatModal(val)}/>
            <GoalInput name="Carbs" default_value={carbs_modal} min_value={0}
            onChange={(val) => setCarbsModal(val)}/>
            <Button onPress={()=>updateGoals()} style={styles.button}>
                Confirm
            </Button>
        </View>
      </Modal>
      <Button style={styles.button} onPress={()=>set_modal_active(true)}>
        Modify Goals
      </Button>
    </SafeAreaView>
  )
}
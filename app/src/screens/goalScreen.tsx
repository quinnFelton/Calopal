import { useEffect, useState } from "react";
import { Modal, Pressable, SafeAreaView, Text, View } from "react-native";
import { Button, TextInput } from 'react-native-paper';
import { styles } from "../style/styles";

import { useFoods } from "../hooks/foodHook";

//Currently just placeholder information to verify that nav bar works. | 10/21/2025 | Vinh

function goalSuccess(value: number, goal: number, over_under: boolean) {
    if (over_under === true) {
        return value >= goal;
    }
    return value <= goal;
}

function GoalDisplay(
    {calories, protein, carbs, fat,
        calories_goal, protein_goal, carbs_goal, fat_goal,
        calories_overUnder, protein_overUnder,
        carbs_overUnder, fat_overUnder}: {
    calories: number; protein: number;
    carbs: number; fat: number;
    calories_goal: number; protein_goal: number;
    carbs_goal: number; fat_goal: number;
    calories_overUnder: boolean; protein_overUnder: boolean;
    carbs_overUnder: boolean; fat_overUnder: boolean;
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
                    <Text style={styles.goalText}>
                        <Text style={
                            goalSuccess(calories, calories_goal, calories_overUnder)
                                ? styles.goalTextSuccess
                                : styles.goalTextFailure
                        }>{calories}</Text>
                    /{calories_goal}</Text>
                    <Text>Calories</Text>
                </View>
                <View style={styles.goalItem}>
                    <Text style={styles.goalText}>
                        <Text style={
                            goalSuccess(protein, protein_goal, protein_overUnder)
                                ? styles.goalTextSuccess
                                : styles.goalTextFailure
                        }>{protein}</Text>
                    /{protein_goal}</Text>
                    <Text>Protein (g)</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.goalItem}>
                    <Text style={styles.text}>
                    <Text style={
                        goalSuccess(fat, fat_goal, fat_overUnder)
                            ? styles.goalTextSuccess
                            : styles.goalTextFailure
                    }>{fat}</Text>
                    /{fat_goal}</Text>
                    <Text>Fat (g)</Text>
                </View>

                <View style={styles.goalItem}>
                    <Text style={styles.text}>
                    <Text style={
                        goalSuccess(carbs, carbs_goal, carbs_overUnder)
                            ? styles.goalTextSuccess
                            : styles.goalTextFailure
                    }>{carbs}</Text>
                    /{carbs_goal}</Text>
                    <Text>Carbs (g)</Text>
                </View>
            </View>

        </View>
    )
}

function GoalInput({name, default_value, min_value, default_over_under, onChange}:
    {name: string; default_value: number; min_value: number; default_over_under: boolean; onChange: (value: number) => void;
    }) {
    const [goal_value, setValue] = useState(default_value);
    const [over_under, setOverUnder] = useState(default_over_under);

    const updateValue = (new_value: number) => {
        setValue(new_value);
        onChange?.(new_value, over_under);
    }

    const updateOverUnder = (new_value: boolean) => {
        setOverUnder(new_value);
        onChange?.(goal_value, new_value);
    }

    return (
        <View style={styles.goalInput}>
            <View style={styles.row}>
                <TextInput
                    label={name}
                    value={goal_value}
                    placeholder={String(goal_value)}
                    onChangeText={updateValue}
                    mode="outlined"
                    inputMode="numeric"
                    keyboardType="numeric"
                    style={styles.smallInput}
                />
                <View>
                    <Pressable
                        onPress={() => updateOverUnder(true)}
                        style={[
                            styles.GoalInputButton,
                            over_under === true && styles.GoalInputButtonSelected
                        ]}
                    >
                        <Text>↑</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => updateOverUnder(false)}
                        style={[
                            styles.GoalInputButton,
                            over_under === false && styles.GoalInputButtonSelected
                        ]}
                    >
                        <Text>↓</Text>
                    </Pressable>
                </View>
             </View>
        </View>
    )
}

export default function goalScreen() {
  const { items, loading, refresh } = useFoods();

  const [calories, setCalories] = useState(500);
  const [protein, setProtein] = useState(10);
  const [fat, setFat] = useState(60);
  const [carbs, setCarbs] = useState(60);

  const [calories_goal, setCaloriesGoal] = useState(2000);
  const [protein_goal, setProteinGoal] = useState(50);
  const [fat_goal, setFatGoal] = useState(50);
  const [carbs_goal, setCarbsGoal] = useState(50);

  const [calories_overUnder, setCaloriesOverUnder] = useState(true);
  const [protein_overUnder, setProteinOverUnder] = useState(true);
  const [fat_overUnder, setFatOverUnder] = useState(true);
  const [carbs_overUnder, setCarbsOverUnder] = useState(true);

  const [modal_active, set_modal_active] = useState(false);
  const [calories_modal, setCaloriesModal] = useState(calories_goal);
  const [protein_modal, setProteinModal] = useState(protein_goal);
  const [fat_modal, setFatModal] = useState(fat_goal);
  const [carbs_modal, setCarbsModal] = useState(carbs_goal);

  useEffect(() => {
      refresh();
  }, [refresh]);

  useEffect(() => {
      if (!loading) {
            if (items.length === 0) {
                console.log("goalScreen: No items found.");
                setCalories(0);
                setProtein(0);
                setFat(0);
                setCarbs(0);
            } else {
                console.log(`goalScreen: ${items.length} items found.`);
                let calorie_sum = 0, protein_sum = 0, fat_sum = 0, carbs_sum = 0;

                // TODO: Find sums

                setCalories(calorie_sum);
                setProtein(protein_sum);
                setFat(fat_sum);
                setCarbs(carbs_sum);
            }
      }
  }, [loading, items]);

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
      calories_overUnder={calories_overUnder}
      protein_overUnder={protein_overUnder}
      fat_overUnder={fat_overUnder}
      carbs_overUnder={carbs_overUnder}
      />
      <Modal visible={modal_active} animationType="slide" onRequestClose={() => {set_modal_active(false)}}>
        <View style={styles.container}>
            <Text style={styles.text}>Modify Goals</Text>
            <GoalInput name="Calories" default_value={calories_goal}
            default_over_under={calories_overUnder} min_value={0}
            onChange={(val, over_under) => {
                setCaloriesModal(val)
                setCaloriesOverUnder(over_under)
            }}/>
            <GoalInput name="Protein" default_value={protein_goal}
            default_over_under={protein_overUnder} min_value={0}
            onChange={(val, over_under) => {
                setProteinModal(val)
                setProteinOverUnder(over_under)
            }}/>
            <GoalInput name="Fat" default_value={fat_goal}
            default_over_under={fat_overUnder} min_value={0}
            onChange={(val, over_under) => {
                setFatModal(val)
                setFatOverUnder(over_under)
            }}/>
            <GoalInput name="Carbs" default_value={carbs_modal}
            default_over_under={carbs_overUnder} min_value={0}
            onChange={(val, over_under) => {
                setCarbsModal(val)
                setCarbsOverUnder(over_under)
            }}/>
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
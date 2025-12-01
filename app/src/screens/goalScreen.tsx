import { useEffect, useState } from "react";
import { Modal, Pressable, SafeAreaView, Text, View, Image, ScrollView } from "react-native";
import { Button, TextInput } from 'react-native-paper';
import { styles } from "../style/styles";
import { useGoals } from "../hooks/goalHook";
import { type Goal } from "../db/schema";

import { useFoods } from "../hooks/foodHook";

function sameDay(day_a: string, day_b: string): boolean {
  // day_a and day_b must both be ISO timestamps
  return (day_a.slice(0, 10) === day_b.slice(0, 10));
}

function getGoalsFromDay(items: Goal[], date: string): Goal[] {
  return items.filter(item => {
    return sameDay(date, item.createdAt);
  });
}

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

  const calories_name = "calories";
  const carbs_name = "carbs";
  const protein_name = "protein";
  const fats_name = "fats";

  const todayDate = new Date();
  const today = todayDate.toISOString();
  let todayGoals = [];
  let completedGoals = [];

  const [weekStatus, setWeekStatus] = useState({
    0: "☐",
    1: "☐",
    2: "☐",
    3: "☐",
    4: "☐",
    5: "☐",
    6: "☐",
  });

  const { items, loading, error, refresh,
    addGoal, updateGoal, deleteGoal, getCompletedGoals } = useGoals();

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

  function emptyProgress() {
    setCalories(0);
    setProtein(0);
    setFat(0);
    setCarbs(0);
  }

  function readGoals() {
    emptyProgress();
    for (const goal of todayGoals) {
      // schema uses true for min while this module was originally designed
      // with true for max. rather than refactor the whole module, a dirty
      // negation allows functionality to be maintained without refactoring. it
      // would probably be better to refactor, but it is too late in
      // development for it to be worthwhile.
      if (goal.macroType == calories_name) {
        setCalories(goal.completedValue);
        setCaloriesGoal(goal.targetValue);
        setCaloriesOverUnder(!(goal.minOrMax));
      } else if (goal.macroType == protein_name) {
        setProtein(goal.completedValue);
        setProteinGoal(goal.targetValue);
        setProteinOverUnder(!(goal.minOrMax));
      } else if (goal.macroType == carbs_name) {
        setCarbs(goal.completedValue);
        setCarbsGoal(goal.targetValue);
        setCarbsOverUnder(!(goal.minOrMax));
      } else if (goal.macroType == fats_name) {
        setFat(goal.completedValue);
        setFatGoal(goal.targetValue);
        setFatOverUnder(!(goal.minOrMax));
      }
    }
  }

  const updateGoalTarget = async(new_target: number, macro: string) => {
    const db_goal = todayGoals.find(goal => goal.macroType === macro);
    const db_id = db_goal?.id;

    let min_max = false;
    if (macro === calories_name) {
      minOrMax = !calories_overUnder;
    } else if (macro === protein_name) {
      minOrMax = !protein_overUnder;
    } else if (macro === carbs_name) {
      minOrMax = !carbs_overUnder;
    } else if (macro === fats_name) {
      minOrMax = !fat_overUnder;
    }

    if (db_id != undefined) {
      await updateGoal(db_id, {targetValue: new_target, minOrMax: min_max})
    } else {
      console.log(`goalScreen: could not find today's ${macro} goal`);
    }
  }

  const updateCaloriesTarget = async(new_target: number) => {
    updateGoalTarget(new_target, calories_name);
  }

  const updateProteinTarget = async(new_target: number) => {
    updateGoalTarget(new_target, protein_name);
  }

  const updateCarbsTarget = async(new_target: number) => {
    updateGoalTarget(new_target, carbs_name);
  }

  const updateFatsTarget = async(new_target: number) => {
    updateGoalTarget(new_target, fats_name);
  }

  const updateCompletedGoals = async() => {
    completedGoals = await getCompletedGoals();
  }

  function updateWeekStatus() {
    const progress_complete = "✅";
    const progress_todo = "☐";
    const progress_incomplete = "❌";

    const dayOfTheWeek = todayDate.getDay();

    setWeekStatus(old_status => {

      const new_status = { ...old_status };

      // Iterate through finished days
      for (let i = 0; i < dayOfTheWeek; i++) {
        const dayDelta = dayOfTheWeek - i;
        const day = new Date(todayDate);
        day.setDate(day.getDate() - dayDelta);
        const dayGoals = getGoalsFromDay(completedGoals, day.toISOString());
        if (dayGoals.length >= 3) {
          new_status[i] = progress_complete;
        } else {
          new_status[i] = progress_incomplete;
        }
      }
      // Progress for today
      if (getGoalsFromDay(completedGoals, today).length >= 3) {
        new_status[dayOfTheWeek] = progress_complete;
      } else {
        new_status[dayOfTheWeek] = progress_todo;
      }
      // Iterate through future days
      for (let i = dayOfTheWeek + 1; i <= 6; i++) {
        new_status[i] = progress_todo;
      }

      return new_status;
    });
  };

  useEffect(() => {
      refresh();
  }, [refresh]);

  useEffect(() => {
  if (!loading) {
    if (items.length === 0) {
      console.log("goalScreen: No items found.");
      emptyProgress();
    } else {
      console.log(`goalScreen: ${items.length} item(s) found.`);
      todayGoals = getGoalsFromDay(items, today);
      updateCompletedGoals();
      updateWeekStatus();
      if (todayGoals.length === 0) {
        console.log("goalScreen: No items matching today.");
        emptyProgress();
      } else {
        console.log(`goalScreen: ${todayGoals.length} item(s) found matching today.`)
        readGoals();
      }
    }
  }}, [loading, items]);

  const updateGoals = () => {
      setCaloriesGoal(calories_modal);
      setProteinGoal(protein_modal);
      setFatGoal(fat_modal);
      setCarbsGoal(carbs_modal);
      set_modal_active(false);
      if (todayGoals.length > 0) {
        console.log("goalScreen: Pushing target changes to db");
        updateCaloriesTarget(calories_modal);
        updateProteinTarget(protein_modal);
        updateFatsTarget(fat_modal);
        updateCarbsTarget(carbs_modal);
      }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={styles.card}>
        <Text variant='headlineMedium' style={[styles.title, { textAlign: 'center', marginVertical: 12}]}>
               Weekly Report
        </Text>
        <View style={styles.row}>
           {Object.entries(weekStatus).map(([day, status]) => (
                 <Text key={day} style={{ fontSize: 24 }}>
                   {status}
                 </Text>
           ))}
        </View>
      </View>
      <View
        style={{
          width: "100%",
          alignItems: "flex-end",
          marginTop: -20,
          marginBottom:-20,
        }}
      >
        <Image
          source={require("../../../assets/images/Cat Assets/cat_sit_neutral.png")}
          style={{
            width: 120,
            height: 120,
            resizeMode: "contain",
          }}
        />
      </View>
      <View style={styles.card}>
          <GoalDisplay
          calories={calories} protein={protein} fat={fat} carbs={carbs}
          calories_goal={calories_goal} protein_goal={protein_goal}
          fat_goal={fat_goal} carbs_goal={carbs_goal}
          calories_overUnder={calories_overUnder}
          protein_overUnder={protein_overUnder}
          fat_overUnder={fat_overUnder}
          carbs_overUnder={carbs_overUnder}
          />
          <Text style={styles.text}>
            Complete 3 daily goals to count towards your weekly goal
          </Text>
      </View>
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
      </ScrollView>
    </SafeAreaView>
  )
}
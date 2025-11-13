// TestCosmetics.tsx
import React, { useState, useRef, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView, TextInput } from "react-native";
import { defaultCosmetics, useCosmetics } from "../hooks/cosmeticHook";

export default function TestCosmetics() {
  const {
    items,
    loading,
    error,
    refresh,
    toggleVisible,
    updateCosmetic,
    addCosmetic,
  } = useCosmetics();

  const insertedDefaults = useRef(false);

  // -----------------------------
    // AUTO-INSERT DEFAULT COSMETICS
    // -----------------------------
    useEffect(() => {
      if (loading) return;                 // wait until DB loads
      if (insertedDefaults.current) return;
      if (items.length > 0) return;        // only if empty

      console.log("💡 No cosmetics found — inserting defaults...");

      insertedDefaults.current = true;

      (async () => {
        for (const c of defaultCosmetics) {
          await addCosmetic(c);
        }
        await refresh(); // reload the DB after insert
      })();
    }, [loading, items, addCosmetic, refresh]);

  // temporary fields to test addCosmetic
  const [newName, setNewName] = useState("");
  const [newImg, setNewImg] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Cosmetic Hook Test</Text>

      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>Error: {error.message}</Text>}

      <Button title="Refresh" onPress={refresh} />

      {/* ------------------------- */}
      {/* ADD COSMETIC FORM */}
      {/* ------------------------- */}
      <View style={styles.addBox}>
        <Text style={styles.subheader}>Add New Cosmetic</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={newName}
          onChangeText={setNewName}
        />

        <TextInput
          style={styles.input}
          placeholder="Image File (ex: TV.png)"
          value={newImg}
          onChangeText={setNewImg}
        />

        <Button
          title="Add Cosmetic"
          onPress={() => {
            addCosmetic({
              name: newName,
              imagePath: newImg,
              visible: true,
              x_pos: 0,
              y_pos: 0,
              angle: 0,
              scale: 1,
              anchoredToPet: false,
            });
            setNewName("");
            setNewImg("");
          }}
        />
      </View>

      {/* ------------------------- */}
      {/* LIST OF COSMETICS */}
      {/* ------------------------- */}
      <Text style={styles.subheader}>Stored Cosmetics:</Text>

      {items.map((item) => (
        <View key={item.cosmeticId} style={styles.box}>
          <Text style={styles.name}>
            #{item.cosmeticId} – {item.name}
          </Text>

          <Text>Visible: {item.visible ? "Yes" : "No"}</Text>
          <Text>Image: {item.imagePath}</Text>
          <Text>X: {item.x_pos} | Y: {item.y_pos}</Text>
          <Text>Angle: {item.angle}</Text>
          <Text>Scale: {item.scale}</Text>
          <Text>Anchored: {item.anchoredToPet ? "Yes" : "No"}</Text>

          {/* toggle visible */}
          <Button
            title={item.visible ? "Hide" : "Show"}
            onPress={() => toggleVisible(item.cosmeticId, !item.visible)}
          />

          {/* update cosmetic */}
          <Button
            title="Move +20 Right"
            onPress={() =>
              updateCosmetic(item.cosmeticId, {
                x_pos: item.x_pos + 20,
              })
            }
          />

          <Button
            title="Rotate +10°"
            onPress={() =>
              updateCosmetic(item.cosmeticId, {
                angle: item.angle + 10,
              })
            }
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheader: {
    fontSize: 20,
    marginBottom: 8,
  },
  error: {
    color: "red",
  },
  box: {
    padding: 15,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    marginBottom: 10,
    gap: 6,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addBox: {
    padding: 15,
    backgroundColor: "#ececec",
    borderRadius: 10,
    marginBottom: 20,
    gap: 8,
  },
});

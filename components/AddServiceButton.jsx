import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export default function AddServiceButton({ onPress }) {
  return (
    <Pressable style={styles.addButton} onPress={onPress}>
      <Text style={styles.addButtonText}>+ Nova OS</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#0E5A8A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
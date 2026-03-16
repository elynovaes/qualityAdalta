import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ServiceCard({
  os,
  client,
  sector,
  system,
  delivery_date,
  onPress,
  onDelete,
  onEdit
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>

      <View style={styles.left}>
        <Text style={styles.title}>
          OS {os} - {client}
        </Text>

        <Text style={styles.subtitle}>
          {sector} - {system}
        </Text>

        <Text style={styles.date}>
          Entrega: {delivery_date}
        </Text>
      </View>

      <View style={styles.buttons}>

        <Pressable style={styles.editButton} onPress={onEdit}>
          <Text style={styles.buttonText}>✏</Text>
        </Pressable>

        <Pressable style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.buttonText}>🗑</Text>
        </Pressable>

      </View>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0E5A8A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flex: 1,
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#d9ecf7",
    fontSize: 13,
  },

  date: {
    color: "#d9ecf7",
    fontSize: 12,
    marginTop: 4,
  },

  buttons: {
    flexDirection: "row",
    gap: 8,
  },

  editButton: {
    backgroundColor: "#f39c12",
    padding: 10,
    borderRadius: 8,
  },

  deleteButton: {
    backgroundColor: "#c0392b",
    padding: 10,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
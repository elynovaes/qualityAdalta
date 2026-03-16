import React from "react";
import { StyleSheet, TextInput } from "react-native";

export default function SearchBar({ value, onChangeText }) {
  return (
    <TextInput
      style={styles.search}
      placeholder="Pesquisar por cliente ou OS..."
      value={value}
      onChangeText={onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
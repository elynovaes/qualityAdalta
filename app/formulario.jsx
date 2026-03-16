import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionOneForm from "../components/SectionOneForm";

export default function Formulario() {

  const { os, client, system } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    external_duct: {
      a: "",
      b: "",
      area: "",
      velocity_matrix: "",
      average_velocity: "",
      static_pressure: "",
      nominal_flow: "",
      measured_flow: "",
      deviation: "",
      compliance: "",
    },
    return_duct: {
      a: "",
      b: "",
      area: "",
      velocity_matrix: "",
      average_velocity: "",
      static_pressure: "",
      nominal_flow: "",
      measured_flow: "",
      deviation: "",
      compliance: "",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>OS {os}</Text>
        <Text style={styles.subtitle}>{client}</Text>
        <Text style={styles.subtitle}>{system}</Text>

        <SectionOneForm
          formData={formData}
          setFormData={setFormData}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f3f5f7",
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6
  },

  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 2
  }

});
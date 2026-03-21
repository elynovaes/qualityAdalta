import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import FormScreen from "../components/FormScreen";
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
    <FormScreen>
      <Text style={styles.title}>OS {os}</Text>
      <Text style={styles.subtitle}>{client}</Text>
      <Text style={styles.subtitle}>{system}</Text>

      <SectionOneForm
        formData={formData}
        setFormData={setFormData}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 2,
  },
});
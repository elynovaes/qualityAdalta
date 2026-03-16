import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function SectionOneForm({ formData, setFormData }) {
  function updateField(section, field, value) {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }

  function renderDuctSection(title, sectionKey) {
    return (
      <View style={styles.block}>
        <Text style={styles.blockTitle}>{title}</Text>

        <Text style={styles.label}>Dimensão A (m)</Text>
        <TextInput
          style={styles.input}
          value={formData[sectionKey].a}
          onChangeText={(value) => updateField(sectionKey, "a", value)}
          placeholder="Ex: 0.50"
        />

        <Text style={styles.label}>Dimensão B (m)</Text>
        <TextInput
          style={styles.input}
          value={formData[sectionKey].b}
          onChangeText={(value) => updateField(sectionKey, "b", value)}
          placeholder="Ex: 0.40"
        />

        <Text style={styles.label}>Área (m²)</Text>
        <TextInput
          style={styles.input}
          value={formData[sectionKey].area}
          onChangeText={(value) => updateField(sectionKey, "area", value)}
          placeholder="Ex: 0.20"
        />

        <Text style={styles.label}>Matriz de velocidade (pitot)</Text>
        <TextInput
          style={styles.input}
          value={formData[sectionKey].velocity_matrix}
          onChangeText={(value) => updateField(sectionKey, "velocity_matrix", value)}
          placeholder="Ex: 16 pontos"
        />

        <Text style={styles.label}>Velocidade média (m/s)</Text>
        <TextInput
          style={styles.input}
          value={formData[sectionKey].average_velocity}
          onChangeText={(value) => updateField(sectionKey, "average_velocity", value)}
          placeholder="Ex: 2.85"
        />

        <Text style={styles.label}>Pressão estática (Pa)</Text>
        <TextInput
          style={styles.input}
          value={formData[sectionKey].static_pressure}
          onChangeText={(value) => updateField(sectionKey, "static_pressure", value)}
          placeholder="Ex: 120"
        />

        <Text style={styles.label}>Vazão nominal (m³/h)</Text>
        <TextInput
          style={styles.input}
          value={formData[sectionKey].nominal_flow}
          onChangeText={(value) => updateField(sectionKey, "nominal_flow", value)}
          placeholder="Ex: 2050"
        />

        <Text style={styles.label}>Vazão medida (m³/h)</Text>
        <TextInput
          style={styles.input}
          value={formData[sectionKey].measured_flow}
          onChangeText={(value) => updateField(sectionKey, "measured_flow", value)}
          placeholder="Ex: 1980"
        />

        <Text style={styles.label}>Desvio (%)</Text>
        <TextInput
          style={styles.input}
          value={formData[sectionKey].deviation}
          onChangeText={(value) => updateField(sectionKey, "deviation", value)}
          placeholder="Ex: -3.41"
        />

        <Text style={styles.label}>Conformidade</Text>
        <TextInput
          style={styles.input}
          value={formData[sectionKey].compliance}
          onChangeText={(value) => updateField(sectionKey, "compliance", value)}
          placeholder="Conforme / Não conforme"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>1.0 - Vazão de ar</Text>

      {renderDuctSection("1.1 - Duto de ar externo", "external_duct")}
      {renderDuctSection("1.2 - Duto de retorno", "return_duct")}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#0E5A8A",
  },
  block: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0E5A8A",
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    color: "#333",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
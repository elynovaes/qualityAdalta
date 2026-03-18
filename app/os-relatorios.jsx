import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { REPORT_TYPES } from "../constants/reportTypes";

export default function OsRelatorios() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedReports, setSelectedReports] = useState([]);

  function toggleReport(reportId, enabled) {
    if (!enabled) {
      Alert.alert("Indisponível", "Esse tipo de relatório será liberado depois.");
      return;
    }

    setSelectedReports((prev) => {
      if (prev.includes(reportId)) {
        return prev.filter((id) => id !== reportId);
      }

      return [...prev, reportId];
    });
  }

  function continuar() {
    if (selectedReports.length === 0) {
      Alert.alert("Atenção", "Selecione pelo menos um relatório.");
      return;
    }

    router.push({
      pathname: "/dados-gerais-relatorio",
      params: {
        ...params,
        selectedReports: JSON.stringify(selectedReports),
      },
    });
  }

  function renderItem({ item }) {
    const isSelected = selectedReports.includes(item.id);

    return (
      <Pressable
        style={[
          styles.card,
          isSelected && styles.cardSelected,
          !item.enabled && styles.cardDisabled,
        ]}
        onPress={() => toggleReport(item.id, item.enabled)}
      >
        <View style={styles.cardContent}>
          <Text
            style={[
              styles.cardTitle,
              !item.enabled && styles.textDisabled,
            ]}
          >
            {item.title}
          </Text>

          <Text
            style={[
              styles.cardSubtitle,
              !item.enabled && styles.textDisabled,
            ]}
          >
            {item.category} • {item.kind}
          </Text>
        </View>

        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.osTitle}>OS {params.os}</Text>
      <Text style={styles.clientText}>{params.client}</Text>
      <Text style={styles.systemText}>{params.system}</Text>

      <Text style={styles.sectionTitle}>Escolha os relatórios que deseja criar</Text>

      <FlatList
        data={REPORT_TYPES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <Pressable style={styles.button} onPress={continuar}>
        <Text style={styles.buttonText}>Continuar</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f5f7",
    padding: 16,
  },
  osTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0E5A8A",
  },
  clientText: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  systemText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSelected: {
    borderColor: "#0E5A8A",
    backgroundColor: "#EAF4FB",
  },
  cardDisabled: {
    opacity: 0.55,
  },
  cardContent: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    textTransform: "capitalize",
  },
  textDisabled: {
    color: "#888",
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#0E5A8A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxSelected: {
    backgroundColor: "#0E5A8A",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#0E5A8A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
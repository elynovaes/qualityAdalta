import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionOneForm from "../components/SectionOneForm";

export default function FormularioOq() {
  const params = useLocalSearchParams();

  const generalData = useMemo(() => {
    try {
      return JSON.parse(params.generalData || "{}");
    } catch {
      return {};
    }
  }, [params.generalData]);

  const reportCodes = useMemo(() => {
    try {
      return JSON.parse(params.reportCodes || "[]");
    } catch {
      return [];
    }
  }, [params.reportCodes]);

  const oqItems = reportCodes.filter((item) => item.report_category === "OQ");

  const [formsByReport, setFormsByReport] = useState(() => {
    const initialState = {};

    oqItems.forEach((item) => {
      const key = `${item.system_number}_${item.report_type_id}`;

      initialState[key] = {
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
      };
    });

    return initialState;
  });

  function updateFormData(reportKey, updater) {
    setFormsByReport((prev) => ({
      ...prev,
      [reportKey]: updater(prev[reportKey]),
    }));
  }

  function salvarRascunho() {
    const payload = {
      service_id: params.id,
      os: params.os,
      client: params.client,
      system: params.system,
      general_data: generalData,
      report_codes: oqItems,
      forms: formsByReport,
    };

    console.log("PAYLOAD OQ:", JSON.stringify(payload, null, 2));
    Alert.alert("Sucesso", "Rascunho do formulário OQ montado com sucesso.");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Formulário OQ</Text>

        <Text style={styles.osInfo}>OS {params.os}</Text>
        <Text style={styles.osSubInfo}>{params.client}</Text>
        <Text style={styles.osSubInfo}>{params.system}</Text>

        <View style={styles.generalBox}>
          <Text style={styles.generalTitle}>Dados gerais</Text>
          <Text style={styles.generalText}>Empresa: {generalData.company_name || "-"}</Text>
          <Text style={styles.generalText}>Qtd. de sistemas: {generalData.systems_quantity || "-"}</Text>
          <Text style={styles.generalText}>Elaborador: {generalData.prepared_by || "-"}</Text>
          <Text style={styles.generalText}>Revisor: {generalData.reviewed_by || "-"}</Text>
        </View>

        {oqItems.map((item) => {
          const reportKey = `${item.system_number}_${item.report_type_id}`;

          return (
            <View key={reportKey} style={styles.reportBlock}>
              <Text style={styles.reportTitle}>Sistema {item.system_number}</Text>
              <Text style={styles.reportSubtitle}>{item.report_title}</Text>
              <Text style={styles.reportCode}>Código: {item.code}</Text>

              <SectionOneForm
                formData={formsByReport[reportKey]}
                setFormData={(updater) => updateFormData(reportKey, updater)}
              />
            </View>
          );
        })}

        <Pressable style={styles.button} onPress={salvarRascunho}>
          <Text style={styles.buttonText}>Salvar rascunho</Text>
        </Pressable>
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0E5A8A",
    marginBottom: 12,
  },
  osInfo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  osSubInfo: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  generalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  generalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0E5A8A",
    marginBottom: 8,
  },
  generalText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  reportBlock: {
    marginBottom: 20,
    backgroundColor: "#eaf4fb",
    borderRadius: 12,
    padding: 12,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0E5A8A",
  },
  reportSubtitle: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  reportCode: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#0E5A8A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import FormScreen from "../components/FormScreen";
import { REPORT_TYPES } from "../constants/reportTypes";

export default function DadosGeraisRelatorio() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const selectedReports = useMemo(() => {
    try {
      return JSON.parse(params.selectedReports || "[]");
    } catch {
      return [];
    }
  }, [params.selectedReports]);

  const selectedReportObjects = REPORT_TYPES.filter((report) =>
    selectedReports.includes(report.id)
  );

  const [form, setForm] = useState({
    systems_quantity: "1",
    client_logo: "",
    company_name: params.client || "",
    approver_name: "",
    approver_role: "",
    approver_email: "",
    approver_phone: "",
    unit_address: "",
    unit_zip_code: "",
    issue_date: "17/03/2026",
    prepared_by: "Ely Novaes",
    reviewed_by: "",
  });

  const [reportCodes, setReportCodes] = useState([]);

  useEffect(() => {
    if (form.systems_quantity) {
      const updatedCodes = buildReportCodes(
        form.systems_quantity,
        selectedReportObjects,
        []
      );

      setReportCodes(updatedCodes);
    }
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function generateTestCode(index) {
    const base = 197 + index;
    const formatted = String(base).padStart(4, "0");
    return `ADR 2558-26-${formatted}`;
  }

  function buildReportCodes(quantity, reports, previousCodes = []) {
    const totalSystems = Number(quantity);

    if (!totalSystems || totalSystems < 1) {
      return [];
    }

    const nextCodes = [];

    for (let systemNumber = 1; systemNumber <= totalSystems; systemNumber++) {
      for (const report of reports) {
        const existingItem = previousCodes.find(
          (item) =>
            item.system_number === systemNumber &&
            item.report_type_id === report.id
        );

        nextCodes.push({
          system_number: systemNumber,
          report_type_id: report.id,
          report_title: report.title,
          report_category: report.category,
          report_kind: report.kind,
          code: existingItem
            ? existingItem.code
            : generateTestCode(nextCodes.length),
        });
      }
    }

    return nextCodes;
  }

  function handleSystemsQuantityChange(value) {
    updateField("systems_quantity", value);

    const updatedCodes = buildReportCodes(
      value,
      selectedReportObjects,
      reportCodes
    );

    setReportCodes(updatedCodes);
  }

  function updateReportCode(systemNumber, reportTypeId, value) {
    setReportCodes((prev) =>
      prev.map((item) => {
        if (
          item.system_number === systemNumber &&
          item.report_type_id === reportTypeId
        ) {
          return {
            ...item,
            code: value,
          };
        }

        return item;
      })
    );
  }

  function continuar() {
    if (!form.systems_quantity) {
      Alert.alert("Atenção", "Informe a quantidade de sistemas.");
      return;
    }

    if (!form.company_name || !form.prepared_by) {
      Alert.alert(
        "Atenção",
        "Preencha pelo menos o nome da empresa e o responsável pela elaboração."
      );
      return;
    }

    const emptyCodes = reportCodes.filter((item) => !item.code.trim());

    if (emptyCodes.length > 0) {
      Alert.alert(
        "Atenção",
        "Preencha todos os códigos dos relatórios para cada sistema."
      );
      return;
    }

    router.push({
      pathname: "/selecionar-ensaios",
      params: {
        ...params,
        selectedReports: JSON.stringify(selectedReports),
        generalData: JSON.stringify(form),
        reportCodes: JSON.stringify(reportCodes),
      },
    });
  }

  return (
    <FormScreen>
      <Text style={styles.title}>Dados gerais do relatório</Text>

      <Text style={styles.osInfo}>OS {params.os}</Text>
      <Text style={styles.osSubInfo}>{params.client}</Text>
      <Text style={styles.osSubInfo}>{params.system}</Text>

      <View style={styles.selectedReportsBox}>
        <Text style={styles.selectedReportsTitle}>Relatórios selecionados</Text>

        {selectedReportObjects.map((item) => (
          <Text key={item.id} style={styles.selectedReportItem}>
            • {item.title}
          </Text>
        ))}
      </View>

      <Text style={styles.label}>Quantidade de sistemas</Text>
      <TextInput
        style={styles.input}
        value={form.systems_quantity}
        onChangeText={handleSystemsQuantityChange}
        placeholder="Ex: 2"
        keyboardType="numeric"
      />

      {reportCodes.length > 0 && (
        <View style={styles.codesSection}>
          <Text style={styles.codesSectionTitle}>
            Códigos dos relatórios por sistema
          </Text>

          {Array.from(
            { length: Number(form.systems_quantity || 0) },
            (_, index) => index + 1
          ).map((systemNumber) => {
            const systemItems = reportCodes.filter(
              (item) => item.system_number === systemNumber
            );

            return (
              <View key={systemNumber} style={styles.systemBlock}>
                <Text style={styles.systemTitle}>Sistema {systemNumber}</Text>

                {systemItems.map((item) => (
                  <View key={`${item.system_number}-${item.report_type_id}`}>
                    <Text style={styles.label}>{item.report_title}</Text>
                    <TextInput
                      style={styles.input}
                      value={item.code}
                      onChangeText={(value) =>
                        updateReportCode(
                          item.system_number,
                          item.report_type_id,
                          value
                        )
                      }
                      placeholder="Ex: ADR 2558-26-0197"
                    />
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      )}

      <Text style={styles.label}>Logo do cliente</Text>
      <TextInput
        style={styles.input}
        value={form.client_logo}
        onChangeText={(value) => updateField("client_logo", value)}
        placeholder="Caminho, URL ou referência da logo"
      />

      <Text style={styles.label}>Nome da empresa</Text>
      <TextInput
        style={styles.input}
        value={form.company_name}
        onChangeText={(value) => updateField("company_name", value)}
        placeholder="Nome da empresa"
      />

      <Text style={styles.label}>Nome do aprovador</Text>
      <TextInput
        style={styles.input}
        value={form.approver_name}
        onChangeText={(value) => updateField("approver_name", value)}
        placeholder="Nome do aprovador"
      />

      <Text style={styles.label}>Área profissional do aprovador</Text>
      <TextInput
        style={styles.input}
        value={form.approver_role}
        onChangeText={(value) => updateField("approver_role", value)}
        placeholder="Ex: Gerente de Qualidade"
      />

      <Text style={styles.label}>E-mail do aprovador</Text>
      <TextInput
        style={styles.input}
        value={form.approver_email}
        onChangeText={(value) => updateField("approver_email", value)}
        placeholder="email@empresa.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Número de contato do aprovador</Text>
      <TextInput
        style={styles.input}
        value={form.approver_phone}
        onChangeText={(value) => updateField("approver_phone", value)}
        placeholder="(11) 99999-9999"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Endereço da unidade</Text>
      <TextInput
        style={styles.input}
        value={form.unit_address}
        onChangeText={(value) => updateField("unit_address", value)}
        placeholder="Endereço da unidade"
      />

      <Text style={styles.label}>CEP da unidade</Text>
      <TextInput
        style={styles.input}
        value={form.unit_zip_code}
        onChangeText={(value) => updateField("unit_zip_code", value)}
        placeholder="00000-000"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Data de emissão</Text>
      <TextInput
        style={styles.input}
        value={form.issue_date}
        onChangeText={(value) => updateField("issue_date", value)}
        placeholder="dd/mm/aaaa"
      />

      <Text style={styles.label}>Responsável pela elaboração</Text>
      <TextInput
        style={styles.input}
        value={form.prepared_by}
        onChangeText={(value) => updateField("prepared_by", value)}
        placeholder="Nome do elaborador"
      />

      <Text style={styles.label}>Responsável pela revisão</Text>
      <TextInput
        style={styles.input}
        value={form.reviewed_by}
        onChangeText={(value) => updateField("reviewed_by", value)}
        placeholder="Nome do revisor"
      />

      <Pressable style={styles.button} onPress={continuar}>
        <Text style={styles.buttonText}>Continuar</Text>
      </Pressable>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
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
  selectedReportsBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  selectedReportsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0E5A8A",
  },
  selectedReportItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  codesSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  codesSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0E5A8A",
    marginBottom: 12,
  },
  systemBlock: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  systemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
  },
  button: {
    backgroundColor: "#0E5A8A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
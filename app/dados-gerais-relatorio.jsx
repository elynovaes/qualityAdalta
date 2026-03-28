import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

  const selectedReportObjects = useMemo(
    () => REPORT_TYPES.filter((report) => selectedReports.includes(report.id)),
    [selectedReports]
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

  const generateTestCode = useCallback((index) => {
    const base = 197 + index;
    const formatted = String(base).padStart(4, "0");
    return `ADR 2558-26-${formatted}`;
  }, []);

  const buildReportCodes = useCallback(
    (quantity, reports, previousCodes = []) => {
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
    },
    [generateTestCode]
  );

  useEffect(() => {
    if (!form.systems_quantity) return;

    setReportCodes((prev) =>
      buildReportCodes(form.systems_quantity, selectedReportObjects, prev)
    );
  }, [buildReportCodes, form.systems_quantity, selectedReportObjects]);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function formatDate(value) {
    const numbers = (value || "").replace(/\D/g, "").slice(0, 8);

    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  }

  function formatZipCode(value) {
    const numbers = (value || "").replace(/\D/g, "").slice(0, 8);

    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
  }

  function formatPhone(value) {
    const numbers = (value || "").replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }
    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }

  function handleSystemsQuantityChange(value) {
    const onlyNumbers = (value || "").replace(/\D/g, "");
    updateField("systems_quantity", onlyNumbers);

    const updatedCodes = buildReportCodes(
      onlyNumbers,
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
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressStep}>Etapa 2 de 4</Text>
          <Text style={styles.progressPercent}>50%</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={styles.progressBarFill} />
        </View>

        <Text style={styles.progressText}>
          Você está configurando os dados iniciais do relatório.
        </Text>
      </View>

      <View style={styles.headerCard}>
        <Text style={styles.title}>Dados Gerais do Relatório</Text>
        <Text style={styles.subtitle}>
          Preencha as informações iniciais para continuar a elaboração do
          relatório.
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📋</Text>
          <Text style={styles.sectionTitle}>Resumo da OS</Text>
        </View>

        <Text style={styles.osInfo}>OS {params.os}</Text>
        <Text style={styles.osSubInfo}>Cliente: {params.client}</Text>
        <Text style={styles.osSubInfo}>Sistema: {params.system}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📝</Text>
          <Text style={styles.sectionTitle}>Relatórios selecionados</Text>
        </View>

        {selectedReportObjects.map((item) => (
          <View key={item.id} style={styles.reportBadge}>
            <Text style={styles.reportBadgeText}>{item.title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>⚙️</Text>
          <Text style={styles.sectionTitle}>Configuração inicial</Text>
        </View>

        <Text style={styles.label}>Quantidade de sistemas</Text>
        <TextInput
          style={styles.input}
          value={form.systems_quantity}
          onChangeText={handleSystemsQuantityChange}
          placeholder="Ex: 2"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
        />
      </View>

      {reportCodes.length > 0 && (
        <View style={styles.codesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔢</Text>
            <Text style={styles.sectionTitle}>
              Códigos dos relatórios por sistema
            </Text>
          </View>

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
                  <View
                    key={`${item.system_number}-${item.report_type_id}`}
                    style={styles.fieldBlock}
                  >
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
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🏢</Text>
          <Text style={styles.sectionTitle}>Informações da empresa</Text>
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Logo do cliente</Text>
          <TextInput
            style={styles.input}
            value={form.client_logo}
            onChangeText={(value) => updateField("client_logo", value)}
            placeholder="Caminho, URL ou referência da logo"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Nome da empresa</Text>
          <TextInput
            style={styles.input}
            value={form.company_name}
            onChangeText={(value) => updateField("company_name", value)}
            placeholder="Nome da empresa"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Endereço da unidade</Text>
          <TextInput
            style={styles.input}
            value={form.unit_address}
            onChangeText={(value) => updateField("unit_address", value)}
            placeholder="Endereço da unidade"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>CEP da unidade</Text>
            <TextInput
              style={styles.input}
              value={form.unit_zip_code}
              onChangeText={(value) =>
                updateField("unit_zip_code", formatZipCode(value))
              }
              placeholder="00000-000"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.col}>
            <Text style={styles.label}>Data de emissão</Text>
            <TextInput
              style={styles.input}
              value={form.issue_date}
              onChangeText={(value) =>
                updateField("issue_date", formatDate(value))
              }
              placeholder="dd/mm/aaaa"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>✅</Text>
          <Text style={styles.sectionTitle}>Aprovação</Text>
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Nome do aprovador</Text>
          <TextInput
            style={styles.input}
            value={form.approver_name}
            onChangeText={(value) => updateField("approver_name", value)}
            placeholder="Nome do aprovador"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Área profissional do aprovador</Text>
          <TextInput
            style={styles.input}
            value={form.approver_role}
            onChangeText={(value) => updateField("approver_role", value)}
            placeholder="Ex: Gerente de Qualidade"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>E-mail do aprovador</Text>
            <TextInput
              style={styles.input}
              value={form.approver_email}
              onChangeText={(value) => updateField("approver_email", value)}
              placeholder="email@empresa.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.col}>
            <Text style={styles.label}>Contato do aprovador</Text>
            <TextInput
              style={styles.input}
              value={form.approver_phone}
              onChangeText={(value) =>
                updateField("approver_phone", formatPhone(value))
              }
              placeholder="(11) 99999-9999"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>👥</Text>
          <Text style={styles.sectionTitle}>Responsáveis pelo documento</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Responsável pela elaboração</Text>
            <TextInput
              style={styles.input}
              value={form.prepared_by}
              onChangeText={(value) => updateField("prepared_by", value)}
              placeholder="Nome do elaborador"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.col}>
            <Text style={styles.label}>Responsável pela revisão</Text>
            <TextInput
              style={styles.input}
              value={form.reviewed_by}
              onChangeText={(value) => updateField("reviewed_by", value)}
              placeholder="Nome do revisor"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      </View>

      <Pressable style={styles.button} onPress={continuar}>
        <Text style={styles.buttonText}>Continuar</Text>
      </Pressable>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressStep: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0E5A8A",
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0E5A8A",
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    marginTop: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    width: "50%",
    height: "100%",
    backgroundColor: "#0E5A8A",
    borderRadius: 999,
  },
  progressText: {
    marginTop: 10,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
  headerCard: {
    backgroundColor: "#EAF4FB",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D3E8F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0E5A8A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#4B5563",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  codesSection: {
    marginBottom: 16,
  },
  systemBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0E5A8A",
  },
  osInfo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  osSubInfo: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 2,
  },
  reportBadge: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  reportBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  systemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  fieldBlock: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#111827",
  },
  button: {
    backgroundColor: "#0E5A8A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#0E5A8A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
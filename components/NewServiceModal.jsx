import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const SETORES = [
  { value: "CO", label: "CO - Comissionamento" },
  { value: "AV", label: "AV - Avaliação" },
  { value: "QA", label: "QA - Qualificação" },
  { value: "TAB", label: "TAB - Teste e Ajuste de Balanceamento" },
];

export default function NewServiceModal({
  visible,
  onClose,
  onSave,
  os,
  setOs,
  client,
  setClient,
  sector,
  setSector,
  system,
  setSystem,
  deliveryDate,
  setDeliveryDate,
  errors = {},
}) {
  const [setorModalVisible, setSetorModalVisible] = useState(false);

  const setorLabel = useMemo(() => {
    const encontrado = SETORES.find((item) => item.value === sector);
    return encontrado ? encontrado.label : "Selecione o setor";
  }, [sector]);

  function selecionarSetor(valor) {
    setSector(valor);
    setSetorModalVisible(false);
  }

  const tituloModal = os ? "Editar OS" : "Criar nova OS";

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{tituloModal}</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Número da OS</Text>
              <TextInput
                style={[styles.input, errors.os && styles.inputError]}
                placeholder="Digite o número da OS"
                value={os}
                onChangeText={setOs}
                placeholderTextColor="#8A8A8A"
                keyboardType="numeric"
              />
              {errors.os ? <Text style={styles.errorText}>{errors.os}</Text> : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Cliente</Text>
              <TextInput
                style={[styles.input, errors.client && styles.inputError]}
                placeholder="Digite o nome do cliente"
                value={client}
                onChangeText={setClient}
                autoCapitalize="characters"
                placeholderTextColor="#8A8A8A"
              />
              {errors.client ? (
                <Text style={styles.errorText}>{errors.client}</Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Setor</Text>
              <Pressable
                style={[styles.selectInput, errors.sector && styles.inputError]}
                onPress={() => setSetorModalVisible(true)}
              >
                <View style={styles.selectTextWrap}>
                  <Text
                    style={
                      sector ? styles.selectValueText : styles.selectPlaceholder
                    }
                  >
                    {setorLabel}
                  </Text>
                </View>
                <Text style={styles.selectArrow}>▼</Text>
              </Pressable>
              {errors.sector ? (
                <Text style={styles.errorText}>{errors.sector}</Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Sistema</Text>
              <TextInput
                style={[styles.input, errors.system && styles.inputError]}
                placeholder="Digite o sistema"
                value={system}
                onChangeText={setSystem}
                placeholderTextColor="#8A8A8A"
              />
              {errors.system ? (
                <Text style={styles.errorText}>{errors.system}</Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Data de entrega</Text>
              <TextInput
                style={[styles.input, errors.deliveryDate && styles.inputError]}
                placeholder="dd/mm/aaaa"
                value={deliveryDate}
                onChangeText={setDeliveryDate}
                keyboardType="numeric"
                placeholderTextColor="#8A8A8A"
                maxLength={10}
              />
              {errors.deliveryDate ? (
                <Text style={styles.errorText}>{errors.deliveryDate}</Text>
              ) : null}
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={onSave}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={setorModalVisible} animationType="fade" transparent>
        <View style={styles.selectorOverlay}>
          <View style={styles.selectorContent}>
            <Text style={styles.selectorTitle}>Selecionar setor</Text>
            <Text style={styles.selectorSubtitle}>
              Escolha o tipo de atividade
            </Text>

            <View style={styles.optionsContainer}>
              {SETORES.map((item) => {
                const ativo = sector === item.value;

                return (
                  <Pressable
                    key={item.value}
                    style={[styles.optionItem, ativo && styles.optionItemActive]}
                    onPress={() => selecionarSetor(item.value)}
                  >
                    <View style={styles.optionTextArea}>
                      <Text
                        style={[
                          styles.optionCode,
                          ativo && styles.optionCodeActive,
                        ]}
                      >
                        {item.value}
                      </Text>
                      <Text
                        style={[
                          styles.optionLabel,
                          ativo && styles.optionLabelActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>

                    {ativo ? <Text style={styles.checkIcon}>✓</Text> : null}
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.closeSelectorButton}
              onPress={() => setSetorModalVisible(false)}
            >
              <Text style={styles.closeSelectorButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 18,
    color: "#1E1E1E",
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F7F8FA",
    borderWidth: 1,
    borderColor: "#D9DEE5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#111",
    fontSize: 15,
  },
  selectInput: {
    backgroundColor: "#F7F8FA",
    borderWidth: 1,
    borderColor: "#D9DEE5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  selectValueText: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  selectPlaceholder: {
    fontSize: 15,
    color: "#9CA3AF",
  },
  selectArrow: {
    fontSize: 14,
    color: "#6B7280",
  },
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "500",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 6,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#9AA1A9",
  },
  saveButton: {
    backgroundColor: "#0E5A8A",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  selectorOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 24,
  },
  selectorContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 10,
  },
  selectorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  selectorSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 10,
  },
  optionItem: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionItemActive: {
    borderColor: "#0E5A8A",
    backgroundColor: "#EAF4FB",
  },
  optionTextArea: {
    flex: 1,
    paddingRight: 10,
  },
  optionCode: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0E5A8A",
    marginBottom: 3,
  },
  optionCodeActive: {
    color: "#0A4A71",
  },
  optionLabel: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
  },
  optionLabelActive: {
    color: "#0A4A71",
  },
  checkIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0E5A8A",
  },
  closeSelectorButton: {
    marginTop: 18,
    backgroundColor: "#EEF2F7",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  closeSelectorButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },
});
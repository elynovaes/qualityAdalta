import React from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Criar nova OS</Text>

          <TextInput
            style={styles.input}
            placeholder="Número da OS"
            value={os}
            onChangeText={setOs}
          />

          <TextInput
            style={styles.input}
            placeholder="Cliente"
            value={client}
            onChangeText={setClient}
          />

          <TextInput
            style={styles.input}
            placeholder="Setor"
            value={sector}
            onChangeText={setSector}
          />

          <TextInput
            style={styles.input}
            placeholder="Sistema"
            value={system}
            onChangeText={setSystem}
          />

          <TextInput
            style={styles.input}
            placeholder="Data de entrega"
            value={deliveryDate}
            onChangeText={setDeliveryDate}
          />

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
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#999",
  },
  saveButton: {
    backgroundColor: "#0E5A8A",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
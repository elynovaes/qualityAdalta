import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConfirmDeleteModal({
  visible,
  onClose,
  onConfirm,
  itemName = 'este item',
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Confirmar exclusão</Text>

          <Text style={styles.message}>
            Tem certeza que deseja excluir {itemName}?
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={onConfirm}>
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e5e5e5',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#d9363e',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '600',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
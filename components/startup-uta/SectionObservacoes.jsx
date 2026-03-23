import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

export default function SectionObservacoes({
  mostrarObservacoesComentarios,
  setMostrarObservacoesComentarios,
  observacoesComentarios,
  setObservacoesComentarios,
}) {
  return (
    <>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() =>
          setMostrarObservacoesComentarios(!mostrarObservacoesComentarios)
        }
      >
        <Text style={styles.sectionTitle}>7.0 Observações e Comentários</Text>
        <Text style={styles.toggleText}>
          {mostrarObservacoesComentarios ? '−' : '+'}
        </Text>
      </TouchableOpacity>

      {mostrarObservacoesComentarios && (
        <View style={styles.mainSectionBox}>
          <Text style={styles.label}>Observações do técnico</Text>
          <TextInput
            style={styles.inputComentario}
            value={observacoesComentarios}
            onChangeText={setObservacoesComentarios}
            placeholder="Insira aqui observações, comentários técnicos, desvios identificados ou recomendações."
            multiline
            textAlignVertical="top"
          />
        </View>
      )}
    </>
  );
}
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
    <View style={styles.mainSectionBox}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() =>
          setMostrarObservacoesComentarios(!mostrarObservacoesComentarios)
        }
        activeOpacity={0.8}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.sectionTitle}>7.0 Observações e Comentários</Text>
          <Text style={styles.selectionSubtitle}>
            Registre anomalias, desvios, condições observadas em campo e recomendações técnicas.
          </Text>
        </View>

        <Text style={styles.toggleText}>
          {mostrarObservacoesComentarios ? '−' : '+'}
        </Text>
      </TouchableOpacity>

      {mostrarObservacoesComentarios && (
        <View style={styles.subSectionContainer}>
          <View style={styles.subSectionBox}>
            <Text style={styles.subSectionTitle}>Registro técnico complementar</Text>

            <Text style={styles.label}>Observações do técnico</Text>
            <TextInput
              style={styles.inputComentario}
              value={observacoesComentarios}
              onChangeText={setObservacoesComentarios}
              placeholder="Insira aqui observações, comentários técnicos, desvios identificados, limitações operacionais ou recomendações."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.infoAuxiliar}>
              Utilize este campo para registrar informações relevantes que complementem os
              resultados medidos, como restrições de acesso, ajustes operacionais realizados,
              condições de instalação, desvios encontrados ou recomendações para tratativa.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
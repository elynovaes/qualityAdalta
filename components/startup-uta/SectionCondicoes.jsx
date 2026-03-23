import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

export default function SectionCondicoes({
  mostrarCondicoesOperacao,
  setMostrarCondicoesOperacao,
  condicoesOperacao,
  atualizarCondicaoOperacao,
  fatorK,
}) {
  return (
    <>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarCondicoesOperacao(!mostrarCondicoesOperacao)}
      >
        <Text style={styles.sectionTitle}>3.0 Condições de Operação</Text>
        <Text style={styles.toggleText}>{mostrarCondicoesOperacao ? '−' : '+'}</Text>
      </TouchableOpacity>

      {mostrarCondicoesOperacao && (
        <View style={styles.mainSectionBox}>
          <Text style={styles.label}>
            3.1 Pressão estática disponível na saída de insuflamento após o ventilador (duto)
          </Text>
          <TextInput
            style={styles.input}
            value={condicoesOperacao.pressaoSaidaInsuflamento}
            onChangeText={(text) =>
              atualizarCondicaoOperacao('pressaoSaidaInsuflamento', text)
            }
            keyboardType="numeric"
            placeholder="Ex.: 350"
          />

          <Text style={styles.label}>3.2 Pressão estática Total (∆P ventilador)</Text>
          <TextInput
            style={styles.input}
            value={condicoesOperacao.pressaoEstaticaTotal}
            onChangeText={(text) => atualizarCondicaoOperacao('pressaoEstaticaTotal', text)}
            keyboardType="numeric"
            placeholder="Ex.: 520"
          />

          <Text style={styles.label}>
            3.3 Pressão estática SIMVA (bocal do ventilador - módulo negativo)
          </Text>
          <TextInput
            style={styles.input}
            value={condicoesOperacao.pressaoSimva}
            onChangeText={(text) => atualizarCondicaoOperacao('pressaoSimva', text)}
            keyboardType="numeric"
            placeholder="Ex.: -250"
          />

          <Text style={styles.label}>3.4 Fator k (k = Q / √∆P(SIMVA))</Text>
          <TextInput
            style={styles.input}
            value={fatorK}
            editable={false}
            placeholder="Calculado automaticamente"
            placeholderTextColor="#888"
          />

          <Text style={styles.infoAuxiliar}>
            Para o cálculo do fator k, o app utiliza a vazão medida do insuflamento e o módulo
            da pressão SIMVA.
          </Text>
        </View>
      )}
    </>
  );
}
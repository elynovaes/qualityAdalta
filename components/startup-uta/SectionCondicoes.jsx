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
    <View style={styles.mainSectionBox}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarCondicoesOperacao(!mostrarCondicoesOperacao)}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.sectionTitle}>3.0 Condições de Operação</Text>
          <Text style={styles.selectionSubtitle}>
            Registre as pressões características do ventilador e do sistema para análise operacional.
          </Text>
        </View>

        <Text style={styles.toggleText}>
          {mostrarCondicoesOperacao ? '−' : '+'}
        </Text>
      </TouchableOpacity>

      {mostrarCondicoesOperacao && (
        <View style={styles.subSectionContainer}>
          <View style={styles.subSectionBox}>
            <Text style={styles.subSectionTitle}>Medições operacionais</Text>

            <View style={styles.fieldBlock}>
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
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>3.2 Pressão estática total (ΔP ventilador)</Text>
              <TextInput
                style={styles.input}
                value={condicoesOperacao.pressaoEstaticaTotal}
                onChangeText={(text) =>
                  atualizarCondicaoOperacao('pressaoEstaticaTotal', text)
                }
                keyboardType="numeric"
                placeholder="Ex.: 520"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>
                3.3 Pressão estática SIMVA (bocal do ventilador - módulo negativo)
              </Text>
              <TextInput
                style={styles.input}
                value={condicoesOperacao.pressaoSimva}
                onChangeText={(text) =>
                  atualizarCondicaoOperacao('pressaoSimva', text)
                }
                keyboardType="numeric"
                placeholder="Ex.: -250"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <Text style={styles.subSectionTitle}>Cálculo automático</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>3.4 Fator k (k = Q / √ΔP(SIMVA))</Text>
              <TextInput
                style={styles.input}
                value={fatorK}
                editable={false}
                placeholder="Calculado automaticamente"
                placeholderTextColor="#888"
              />
            </View>

            <Text style={styles.infoAuxiliar}>
              Para o cálculo do fator k, o aplicativo utiliza a vazão medida do
              insuflamento e o módulo da pressão SIMVA, permitindo avaliar o
              comportamento operacional do ventilador em campo.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
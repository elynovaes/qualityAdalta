import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

export default function SectionAguaGelada({
  mostrarAguaGelada,
  setMostrarAguaGelada,
  aguaGelada,
  atualizarAguaGelada,
  desvioAguaGelada,
  avaliacaoAguaGelada,
}) {
  return (
    <View style={styles.mainSectionBox}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarAguaGelada(!mostrarAguaGelada)}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.sectionTitle}>6.0 Água Gelada</Text>
          <Text style={styles.selectionSubtitle}>
            Registre os dados da válvula e as vazões para avaliação do balanceamento hidráulico.
          </Text>
        </View>

        <Text style={styles.toggleText}>{mostrarAguaGelada ? '−' : '+'}</Text>
      </TouchableOpacity>

      {mostrarAguaGelada && (
        <View style={styles.subSectionContainer}>
          <View style={styles.subSectionBox}>
            <Text style={styles.subSectionTitle}>Dados da válvula</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Modelo da válvula</Text>
              <TextInput
                style={styles.input}
                value={aguaGelada.modeloValvula}
                onChangeText={(text) => atualizarAguaGelada('modeloValvula', text)}
                placeholder="Ex.: TA-Modulator, PICV, Globo 2 vias..."
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Abertura da válvula manual (voltas)</Text>
                <TextInput
                  style={styles.input}
                  value={aguaGelada.aberturaValvulaManual}
                  onChangeText={(text) =>
                    atualizarAguaGelada('aberturaValvulaManual', text)
                  }
                  keyboardType="numeric"
                  placeholder="Ex.: 80"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.halfInputNoMargin}>
                <Text style={styles.label}>Delta P de operação (bar)</Text>
                <TextInput
                  style={styles.input}
                  value={aguaGelada.deltaPOperacao}
                  onChangeText={(text) =>
                    atualizarAguaGelada('deltaPOperacao', text)
                  }
                  keyboardType="numeric"
                  placeholder="Ex.: 0,35"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <Text style={styles.subSectionTitle}>Vazão de água gelada</Text>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Vazão nominal (m³/h)</Text>
                <TextInput
                  style={styles.input}
                  value={aguaGelada.vazaoNominal}
                  onChangeText={(text) => atualizarAguaGelada('vazaoNominal', text)}
                  keyboardType="numeric"
                  placeholder="Ex.: 12,5"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.halfInputNoMargin}>
                <Text style={styles.label}>Vazão medida (m³/h)</Text>
                <TextInput
                  style={styles.input}
                  value={aguaGelada.vazaoMedida}
                  onChangeText={(text) => atualizarAguaGelada('vazaoMedida', text)}
                  keyboardType="numeric"
                  placeholder="Ex.: 11,8"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Desvio (%)</Text>
              <TextInput
                style={styles.input}
                value={desvioAguaGelada}
                editable={false}
                placeholder="Calculado automaticamente"
                placeholderTextColor="#888"
              />
            </View>

            {avaliacaoAguaGelada && (
              <View style={styles.resultadoBox}>
                {avaliacaoAguaGelada.conforme ? (
                  <Text style={styles.resultadoOk}>
                    Vazão medida dentro do critério de aceitação (±10% da vazão nominal).
                  </Text>
                ) : (
                  <>
                    <Text style={styles.resultadoAlerta}>
                      Vazão medida fora do critério de aceitação.
                    </Text>

                    <Text style={styles.resultadoInfo}>
                      Faixa aceitável: {avaliacaoAguaGelada.limiteMin} a{' '}
                      {avaliacaoAguaGelada.limiteMax} m³/h
                    </Text>
                  </>
                )}
              </View>
            )}

            <Text style={styles.infoAuxiliar}>
              Observação: o desvio de vazão auxilia na avaliação do balanceamento do circuito
              hidráulico e da regulagem da válvula em condição operacional.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
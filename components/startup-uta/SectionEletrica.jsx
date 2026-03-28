import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

export default function SectionEletrica({
  mostrarEletrica,
  setMostrarEletrica,
  quantidadeMotores,
  atualizarQuantidadeMotores,
  motores,
  atualizarMotor,
  calcularDesequilibrio,
  parseNumero,
}) {
  return (
    <View style={styles.mainSectionBox}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarEletrica(!mostrarEletrica)}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.sectionTitle}>4.0 Elétrica</Text>
          <Text style={styles.selectionSubtitle}>
            Verificação de frequência, tensão e corrente dos motores da UTA.
          </Text>
        </View>
        <Text style={styles.toggleText}>{mostrarEletrica ? '−' : '+'}</Text>
      </TouchableOpacity>

      {mostrarEletrica && (
        <View style={styles.subSectionContainer}>
          <View style={styles.subSectionBox}>
            <Text style={styles.label}>Quantidade de motores</Text>
            <TextInput
              style={styles.input}
              value={quantidadeMotores}
              onChangeText={atualizarQuantidadeMotores}
              keyboardType="numeric"
              placeholder="Ex.: 1"
              placeholderTextColor="#9CA3AF"
            />

            {motores.map((motor, index) => {
              const desequilibrioTensao = calcularDesequilibrio([
                motor.tensaoRS,
                motor.tensaoRT,
                motor.tensaoST,
              ]);

              const desequilibrioCorrente = calcularDesequilibrio([
                motor.correnteR,
                motor.correnteS,
                motor.correnteT,
              ]);

              const tensaoNominalNumero = parseNumero(motor.tensaoNominal);
              const correnteNominalNumero = parseNumero(motor.correnteNominal);

              const tensaoRSNumero = parseNumero(motor.tensaoRS);
              const tensaoRTNumero = parseNumero(motor.tensaoRT);
              const tensaoSTNumero = parseNumero(motor.tensaoST);

              const correnteRNumero = parseNumero(motor.correnteR);
              const correnteSNumero = parseNumero(motor.correnteS);
              const correnteTNumero = parseNumero(motor.correnteT);

              const tensaoMin =
                tensaoNominalNumero && tensaoNominalNumero > 0
                  ? tensaoNominalNumero * 0.95
                  : null;

              const tensaoMax =
                tensaoNominalNumero && tensaoNominalNumero > 0
                  ? tensaoNominalNumero * 1.05
                  : null;

              const tensaoPreenchida =
                tensaoNominalNumero !== null &&
                tensaoNominalNumero > 0 &&
                tensaoRSNumero !== null &&
                tensaoRTNumero !== null &&
                tensaoSTNumero !== null &&
                parseNumero(desequilibrioTensao) !== null;

              const correntePreenchida =
                correnteNominalNumero !== null &&
                correnteNominalNumero > 0 &&
                correnteRNumero !== null &&
                correnteSNumero !== null &&
                correnteTNumero !== null &&
                parseNumero(desequilibrioCorrente) !== null;

              const tensaoConforme =
                tensaoPreenchida &&
                tensaoMin !== null &&
                tensaoMax !== null &&
                tensaoRSNumero >= tensaoMin &&
                tensaoRSNumero <= tensaoMax &&
                tensaoRTNumero >= tensaoMin &&
                tensaoRTNumero <= tensaoMax &&
                tensaoSTNumero >= tensaoMin &&
                tensaoSTNumero <= tensaoMax &&
                parseNumero(desequilibrioTensao) <= 3;

              const correnteConforme =
                correntePreenchida &&
                correnteRNumero <= correnteNominalNumero &&
                correnteSNumero <= correnteNominalNumero &&
                correnteTNumero <= correnteNominalNumero &&
                parseNumero(desequilibrioCorrente) <= 15;

              return (
                <View key={index} style={styles.subSectionContainer}>
                  <View style={styles.subSectionBox}>
                    <Text style={styles.subSectionTitle}>Motor {index + 1}</Text>
                    <Text style={styles.selectionSubtitle}>
                      Registre frequência, tensão e corrente para avaliação elétrica do motor.
                    </Text>

                    <Text style={styles.label}>4.1 Frequência (% ou Hz)</Text>
                    <TextInput
                      style={styles.input}
                      value={motor.frequencia}
                      onChangeText={(text) =>
                        atualizarMotor(index, 'frequencia', text)
                      }
                      keyboardType="numeric"
                      placeholder="Ex.: 60"
                      placeholderTextColor="#9CA3AF"
                    />

                    <Text style={styles.subSectionTitle}>4.2 Tensão elétrica (V)</Text>

                    <Text style={styles.label}>Nominal</Text>
                    <TextInput
                      style={styles.input}
                      value={motor.tensaoNominal}
                      onChangeText={(text) =>
                        atualizarMotor(index, 'tensaoNominal', text)
                      }
                      keyboardType="numeric"
                      placeholder="Ex.: 380"
                      placeholderTextColor="#9CA3AF"
                    />

                    <View style={styles.row}>
                      <View style={styles.thirdInput}>
                        <Text style={styles.label}>R-S</Text>
                        <TextInput
                          style={styles.input}
                          value={motor.tensaoRS}
                          onChangeText={(text) =>
                            atualizarMotor(index, 'tensaoRS', text)
                          }
                          keyboardType="numeric"
                        />
                      </View>

                      <View style={styles.thirdInput}>
                        <Text style={styles.label}>R-T</Text>
                        <TextInput
                          style={styles.input}
                          value={motor.tensaoRT}
                          onChangeText={(text) =>
                            atualizarMotor(index, 'tensaoRT', text)
                          }
                          keyboardType="numeric"
                        />
                      </View>

                      <View style={styles.thirdInputNoMargin}>
                        <Text style={styles.label}>S-T</Text>
                        <TextInput
                          style={styles.input}
                          value={motor.tensaoST}
                          onChangeText={(text) =>
                            atualizarMotor(index, 'tensaoST', text)
                          }
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    <Text style={styles.label}>Desequilíbrio (%)</Text>
                    <TextInput
                      style={styles.input}
                      value={desequilibrioTensao}
                      editable={false}
                      placeholder="Calculado automaticamente"
                      placeholderTextColor="#9CA3AF"
                    />

                    {tensaoPreenchida &&
                      (tensaoConforme ? (
                        <Text style={styles.resultadoOkInline}>
                          Tensão conforme (±5% da nominal e desequilíbrio ≤ 3%).
                        </Text>
                      ) : (
                        <Text style={styles.resultadoAlertaInline}>
                          Tensão fora do critério (±5% da nominal e desequilíbrio ≤ 3%).
                        </Text>
                      ))}

                    <Text style={styles.subSectionTitle}>4.3 Corrente (A)</Text>

                    <Text style={styles.label}>Nominal</Text>
                    <TextInput
                      style={styles.input}
                      value={motor.correnteNominal}
                      onChangeText={(text) =>
                        atualizarMotor(index, 'correnteNominal', text)
                      }
                      keyboardType="numeric"
                      placeholder="Ex.: 9,5"
                      placeholderTextColor="#9CA3AF"
                    />

                    <View style={styles.row}>
                      <View style={styles.thirdInput}>
                        <Text style={styles.label}>R</Text>
                        <TextInput
                          style={styles.input}
                          value={motor.correnteR}
                          onChangeText={(text) =>
                            atualizarMotor(index, 'correnteR', text)
                          }
                          keyboardType="numeric"
                        />
                      </View>

                      <View style={styles.thirdInput}>
                        <Text style={styles.label}>S</Text>
                        <TextInput
                          style={styles.input}
                          value={motor.correnteS}
                          onChangeText={(text) =>
                            atualizarMotor(index, 'correnteS', text)
                          }
                          keyboardType="numeric"
                        />
                      </View>

                      <View style={styles.thirdInputNoMargin}>
                        <Text style={styles.label}>T</Text>
                        <TextInput
                          style={styles.input}
                          value={motor.correnteT}
                          onChangeText={(text) =>
                            atualizarMotor(index, 'correnteT', text)
                          }
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    <Text style={styles.label}>Desequilíbrio (%)</Text>
                    <TextInput
                      style={styles.input}
                      value={desequilibrioCorrente}
                      editable={false}
                      placeholder="Calculado automaticamente"
                      placeholderTextColor="#9CA3AF"
                    />

                    {correntePreenchida &&
                      (correnteConforme ? (
                        <Text style={styles.resultadoOkInline}>
                          Corrente conforme (≤ nominal e desequilíbrio ≤ 15%).
                        </Text>
                      ) : (
                        <Text style={styles.resultadoAlertaInline}>
                          Corrente fora do critério (≤ nominal e desequilíbrio ≤ 15%).
                        </Text>
                      ))}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}
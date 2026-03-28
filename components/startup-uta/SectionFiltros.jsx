import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

export default function SectionFiltros({
  mostrarPerdaCargaFiltros,
  setMostrarPerdaCargaFiltros,
  filtros,
  atualizarFiltro,
  parseNumero,
}) {
  return (
    <View style={styles.mainSectionBox}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarPerdaCargaFiltros(!mostrarPerdaCargaFiltros)}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.sectionTitle}>5.0 Perda de Carga dos Filtros</Text>
          <Text style={styles.selectionSubtitle}>
            Registre a eficiência do filtro e o diferencial de pressão medido
            para avaliação de conformidade.
          </Text>
        </View>

        <Text style={styles.toggleText}>
          {mostrarPerdaCargaFiltros ? '−' : '+'}
        </Text>
      </TouchableOpacity>

      {mostrarPerdaCargaFiltros && (
        <View style={styles.subSectionContainer}>
          <View style={styles.subSectionBox}>
            <Text style={styles.selectionTitle}>Tabela de verificação</Text>
            <Text style={styles.selectionSubtitle}>
              O valor medido de ΔP deve ser menor ou igual ao critério de
              aceitação correspondente ao filtro.
            </Text>

            <View style={styles.tableRow}>
              <View style={styles.filterColumnTipo}>
                <Text style={styles.tableHeader}>Filtro</Text>
              </View>

              <View style={styles.filterColumnCriterio}>
                <Text style={styles.tableHeader}>Critério (Pa)</Text>
              </View>

              <View style={styles.filterColumnDeltaP}>
                <Text style={styles.tableHeader}>ΔP medido (Pa)</Text>
              </View>
            </View>

            {filtros.map((filtro, index) => {
              const criterioNumero = parseNumero(filtro.criterioAceitacao);
              const deltaPMedidoNumero = parseNumero(filtro.deltaPMedido);

              const filtroPreenchido = deltaPMedidoNumero !== null;
              const filtroConforme =
                filtroPreenchido &&
                criterioNumero !== null &&
                deltaPMedidoNumero <= criterioNumero;

              return (
                <View key={index} style={styles.filtroBox}>
                  <View style={styles.tableRow}>
                    <View style={styles.filterColumnTipo}>
                      <TextInput
                        style={styles.input}
                        value={filtro.eficiencia}
                        onChangeText={(text) =>
                          atualizarFiltro(index, 'eficiencia', text)
                        }
                        placeholder="Ex.: G4"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>

                    <View style={styles.filterColumnCriterio}>
                      <TextInput
                        style={styles.input}
                        value={filtro.criterioAceitacao}
                        editable={false}
                        placeholder="Automático"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>

                    <View style={styles.filterColumnDeltaP}>
                      <TextInput
                        style={styles.input}
                        value={filtro.deltaPMedido}
                        onChangeText={(text) =>
                          atualizarFiltro(index, 'deltaPMedido', text)
                        }
                        keyboardType="numeric"
                        placeholder="Ex.: 120"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>

                  {filtroPreenchido &&
                    (filtroConforme ? (
                      <Text style={styles.resultadoOkInline}>
                        {filtro.eficiencia || `Filtro ${index + 1}`} conforme:
                        ΔP medido dentro do critério de aceitação.
                      </Text>
                    ) : (
                      <Text style={styles.resultadoAlertaInline}>
                        {filtro.eficiencia || `Filtro ${index + 1}`} não
                        conforme: ΔP medido acima do critério de aceitação.
                      </Text>
                    ))}
                </View>
              );
            })}

            <Text style={styles.infoAuxiliar}>
              Observação: a elevação do diferencial de pressão pode indicar
              saturação progressiva do elemento filtrante e necessidade de
              avaliação da substituição.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
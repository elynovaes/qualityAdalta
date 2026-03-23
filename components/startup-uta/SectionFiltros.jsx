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
    <>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarPerdaCargaFiltros(!mostrarPerdaCargaFiltros)}
      >
        <Text style={styles.sectionTitle}>5.0 Perda de Carga dos Filtros</Text>
        <Text style={styles.toggleText}>{mostrarPerdaCargaFiltros ? '−' : '+'}</Text>
      </TouchableOpacity>

      {mostrarPerdaCargaFiltros && (
        <View style={styles.mainSectionBox}>
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
                      onChangeText={(text) => atualizarFiltro(index, 'eficiencia', text)}
                      placeholder="Ex.: G4"
                    />
                  </View>

                  <View style={styles.filterColumnCriterio}>
                    <TextInput
                      style={styles.input}
                      value={filtro.criterioAceitacao}
                      editable={false}
                    />
                  </View>

                  <View style={styles.filterColumnDeltaP}>
                    <TextInput
                      style={styles.input}
                      value={filtro.deltaPMedido}
                      onChangeText={(text) => atualizarFiltro(index, 'deltaPMedido', text)}
                      keyboardType="numeric"
                      placeholder="Ex.: 120"
                    />
                  </View>
                </View>

                {filtroPreenchido &&
                  (filtroConforme ? (
                    <Text style={styles.resultadoOkInline}>
                      {filtro.eficiencia || `Filtro ${index + 1}`} conforme: ΔP medido ≤ critério
                      de aceitação.
                    </Text>
                  ) : (
                    <Text style={styles.resultadoAlertaInline}>
                      {filtro.eficiencia || `Filtro ${index + 1}`} não conforme: ΔP medido acima
                      do critério de aceitação.
                    </Text>
                  ))}
              </View>
            );
          })}
        </View>
      )}
    </>
  );
}
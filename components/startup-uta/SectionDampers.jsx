import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

export default function SectionDampers({
  mostrarDampers,
  setMostrarDampers,
  dampers,
  atualizarDamper,
}) {
  return (
    <View style={styles.mainSectionBox}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarDampers(!mostrarDampers)}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.sectionTitle}>2.0 Posição [%] e lacre dos dampers</Text>
          <Text style={styles.selectionSubtitle}>
            Registrar a posição de abertura e o número do lacre dos dampers
            durante a condição de operação do sistema.
          </Text>
        </View>

        <Text style={styles.toggleText}>{mostrarDampers ? '−' : '+'}</Text>
      </TouchableOpacity>

      {mostrarDampers && (
        <View style={styles.subSectionContainer}>
          <View style={styles.subSectionBox}>

            <Text style={styles.subSectionTitle}>Tabela de registro</Text>

            <View style={styles.tableRow}>
              <View style={styles.firstColumn} />

              <View style={styles.otherColumn}>
                <Text style={styles.tableHeader}>Insuflamento</Text>
              </View>

              <View style={styles.otherColumn}>
                <Text style={styles.tableHeader}>Retorno</Text>
              </View>

              <View style={styles.otherColumn}>
                <Text style={styles.tableHeader}>Ar externo</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.firstColumn}>
                <Text style={styles.label}>Abertura (%)</Text>
              </View>

              {['insuflamento', 'retorno', 'arExterno'].map((tipo) => (
                <View key={tipo} style={styles.otherColumn}>
                  <TextInput
                    style={styles.input}
                    value={dampers[tipo].abertura}
                    onChangeText={(text) => atualizarDamper(tipo, 'abertura', text)}
                    keyboardType="numeric"
                    placeholder="Ex.: 85"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              ))}
            </View>

            <View style={styles.tableRow}>
              <View style={styles.firstColumn}>
                <Text style={styles.label}>Nº do lacre</Text>
              </View>

              {['insuflamento', 'retorno', 'arExterno'].map((tipo) => (
                <View key={tipo} style={styles.otherColumn}>
                  <TextInput
                    style={styles.input}
                    value={dampers[tipo].numeroLacre}
                    onChangeText={(text) => atualizarDamper(tipo, 'numeroLacre', text)}
                    placeholder="Ex.: 12345 ou N/A"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              ))}
            </View>

            <Text style={styles.infoAuxiliar}>
              Observação: a posição registrada refere-se à condição operacional
              observada durante o ensaio. Caso haja ajuste posterior, registrar
              nova condição no relatório de comissionamento.
            </Text>

          </View>
        </View>
      )}
    </View>
  );
}
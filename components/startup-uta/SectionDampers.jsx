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
    <>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarDampers(!mostrarDampers)}
      >
        <Text style={styles.sectionTitle}>2.0 Posição [%] e lacre dos dampers</Text>
        <Text style={styles.toggleText}>{mostrarDampers ? '−' : '+'}</Text>
      </TouchableOpacity>

      {mostrarDampers && (
        <View style={styles.mainSectionBox}>
          <View style={styles.tableRow}>
            <View style={styles.firstColumn} />
            <View style={styles.otherColumn}>
              <Text style={styles.tableHeader}>Insuflamento</Text>
            </View>
            <View style={styles.otherColumn}>
              <Text style={styles.tableHeader}>Retorno</Text>
            </View>
            <View style={styles.otherColumn}>
              <Text style={styles.tableHeader}>Ar Externo</Text>
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
                />
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  );
}
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

export default function SectionIdentificacao({
  mostrarInfo,
  setMostrarInfo,
  dataInspecao,
  setDataInspecao,
  sistemaArea,
  setSistemaArea,
  procedimento,
  setProcedimento,
  equipamento,
  setEquipamento,
  alicateSerie,
  setAlicateSerie,
  balometroSerie,
  setBalometroSerie,
  manometroSerie,
  setManometroSerie,
  tecnico,
  setTecnico,
}) {
  return (
    <>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarInfo(!mostrarInfo)}
      >
        <Text style={styles.sectionTitle}>Identificação do Ensaio</Text>
        <Text style={styles.toggleText}>{mostrarInfo ? '−' : '+'}</Text>
      </TouchableOpacity>

      {mostrarInfo && (
        <>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Data de inspeção</Text>
              <TextInput style={styles.input} value={dataInspecao} onChangeText={setDataInspecao} />
            </View>

            <View style={styles.halfInputNoMargin}>
              <Text style={styles.label}>Sistema / Área</Text>
              <TextInput style={styles.input} value={sistemaArea} onChangeText={setSistemaArea} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Procedimento</Text>
              <TextInput style={styles.input} value={procedimento} onChangeText={setProcedimento} />
            </View>

            <View style={styles.halfInputNoMargin}>
              <Text style={styles.label}>Equipamento</Text>
              <TextInput style={styles.input} value={equipamento} onChangeText={setEquipamento} />
            </View>
          </View>

          <Text style={styles.label}>Alicate Amperímetro</Text>
          <TextInput style={styles.input} value={alicateSerie} onChangeText={setAlicateSerie} />

          <Text style={styles.label}>Balômetro</Text>
          <TextInput style={styles.input} value={balometroSerie} onChangeText={setBalometroSerie} />

          <Text style={styles.label}>Manômetro Ta Scope</Text>
          <TextInput style={styles.input} value={manometroSerie} onChangeText={setManometroSerie} />

          <Text style={styles.label}>Técnico Responsável</Text>
          <TextInput style={styles.input} value={tecnico} onChangeText={setTecnico} />
        </>
      )}
    </>
  );
}
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function StartupUta() {
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [mostrarVazaoAr, setMostrarVazaoAr] = useState(false);

  const [dataInspecao, setDataInspecao] = useState('');
  const [sistemaArea, setSistemaArea] = useState('');
  const [procedimento, setProcedimento] = useState('');
  const [equipamento, setEquipamento] = useState('');
  const [tecnico, setTecnico] = useState('');

  const [alicateSerie, setAlicateSerie] = useState('');
  const [balometroSerie, setBalometroSerie] = useState('');
  const [manometroSerie, setManometroSerie] = useState('');

  const [vazaoNominal, setVazaoNominal] = useState('');
  const [larguraDuto, setLarguraDuto] = useState('');
  const [alturaDuto, setAlturaDuto] = useState('');

  const [valoresPitot, setValoresPitot] = useState({});

  const areaDuto = useMemo(() => {
    const largura = parseFloat(String(larguraDuto).replace(',', '.'));
    const altura = parseFloat(String(alturaDuto).replace(',', '.'));

    if (isNaN(largura) || isNaN(altura)) return '';

    return (largura * altura).toFixed(4);
  }, [larguraDuto, alturaDuto]);

  const calculoPitot = useMemo(() => {
    const largura = parseFloat(String(larguraDuto).replace(',', '.'));
    const altura = parseFloat(String(alturaDuto).replace(',', '.'));

    if (isNaN(largura) || isNaN(altura)) return null;

    const margem = 0.05;
    const espacamento = 0.10;

    const nL = Math.floor((largura - 2 * margem) / espacamento) + 1;
    const nH = Math.floor((altura - 2 * margem) / espacamento) + 1;

    return {
      nL,
      nH,
      total: nL * nH
    };
  }, [larguraDuto, alturaDuto]);

  const matrizPitot = useMemo(() => {
    if (!calculoPitot) return [];

    let contador = 1;
    const matriz = [];

    for (let i = 0; i < calculoPitot.nH; i++) {
      const linha = [];
      for (let j = 0; j < calculoPitot.nL; j++) {
        linha.push(contador);
        contador++;
      }
      matriz.push(linha);
    }

    return matriz;
  }, [calculoPitot]);

  const atualizarValor = (id, valor) => {
    setValoresPitot((prev) => ({
      ...prev,
      [id]: valor,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Startup de Unidade de Tratamento - UTA</Text>

      {/* IDENTIFICAÇÃO */}
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

            <View style={styles.halfInput}>
              <Text style={styles.label}>Sistema / Área</Text>
              <TextInput style={styles.input} value={sistemaArea} onChangeText={setSistemaArea} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Procedimento</Text>
              <TextInput style={styles.input} value={procedimento} onChangeText={setProcedimento} />
            </View>

            <View style={styles.halfInput}>
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

      {/* VAZÃO DE AR */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarVazaoAr(!mostrarVazaoAr)}
      >
        <Text style={styles.sectionTitle}>1.0 Vazão de Ar</Text>
        <Text style={styles.toggleText}>{mostrarVazaoAr ? '−' : '+'}</Text>
      </TouchableOpacity>

      {mostrarVazaoAr && (
        <View style={styles.subSectionBox}>

          <Text style={styles.label}>Vazão nominal (m³/h)</Text>
          <TextInput
            style={styles.input}
            value={vazaoNominal}
            onChangeText={setVazaoNominal}
            keyboardType="numeric"
          />

          <Text style={styles.subSectionTitle}>1.1 Duto de ar de insuflamento</Text>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Largura (m)</Text>
              <TextInput
                style={styles.input}
                value={larguraDuto}
                onChangeText={setLarguraDuto}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfInput}>
              <Text style={styles.label}>Altura (m)</Text>
              <TextInput
                style={styles.input}
                value={alturaDuto}
                onChangeText={setAlturaDuto}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.label}>Área (m²)</Text>
          <TextInput style={styles.input} value={areaDuto} editable={false} />

          <Text style={styles.label}>Pontos da matriz</Text>
          <TextInput
            style={styles.input}
            value={calculoPitot ? `${calculoPitot.nL} x ${calculoPitot.nH} = ${calculoPitot.total}` : ''}
            editable={false}
          />

          <Text style={styles.subSectionTitle}>Matriz de Medição</Text>

          {matrizPitot.map((linha, i) => (
            <View key={i} style={styles.row}>
              {linha.map((ponto) => (
                <TextInput
                  key={ponto}
                  style={styles.inputMatrix}
                  placeholder=""
                  value={valoresPitot[ponto] || ''}
                  onChangeText={(text) => atualizarValor(ponto, text)}
                  keyboardType="numeric"
                />
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D4ED8',
  },

  toggleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D4ED8',
  },

  subSectionBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fafafa',
  },

  subSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 8,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  halfInput: {
    flex: 1,
    marginRight: 5,
  },

  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },

  inputMatrix: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 6,
    margin: 2,
    textAlign: 'center',
    fontSize: 12,
  },
});
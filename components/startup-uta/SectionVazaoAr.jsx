import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

const SECOES_DUTO = [
  { id: 'insuflamento', titulo: '1.1 Duto de ar de insuflamento' },
  { id: 'retorno', titulo: '1.2 Duto de ar de retorno' },
  { id: 'arExterno', titulo: '1.3 Duto de ar externo' },
];

function SecaoDuto({
  secaoId,
  titulo,
  secao,
  dados,
  toggleExpandirSecao,
  atualizarCampoSecao,
  atualizarValorPitot,
}) {
  return (
    <View key={secaoId} style={styles.subSectionContainer}>
      <TouchableOpacity
        style={styles.sectionHeaderInterno}
        onPress={() => toggleExpandirSecao(secaoId)}
      >
        <Text style={styles.subSectionTitleHeader}>{titulo}</Text>
        <Text style={styles.toggleText}>{secao.expandida ? '−' : '+'}</Text>
      </TouchableOpacity>

      {secao.expandida && (
        <View style={styles.subSectionBox}>
          <Text style={styles.label}>Vazão nominal (m³/h)</Text>
          <TextInput
            style={styles.input}
            value={secao.vazaoNominal}
            onChangeText={(text) => atualizarCampoSecao(secaoId, 'vazaoNominal', text)}
            keyboardType="numeric"
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Largura (m)</Text>
              <TextInput
                style={styles.input}
                value={secao.larguraDuto}
                onChangeText={(text) => atualizarCampoSecao(secaoId, 'larguraDuto', text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfInputNoMargin}>
              <Text style={styles.label}>Altura (m)</Text>
              <TextInput
                style={styles.input}
                value={secao.alturaDuto}
                onChangeText={(text) => atualizarCampoSecao(secaoId, 'alturaDuto', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Área (m²)</Text>
              <TextInput style={styles.input} value={dados.areaDuto} editable={false} />
            </View>

            <View style={styles.halfInputNoMargin}>
              <Text style={styles.label}>Pontos da matriz</Text>
              <TextInput
                style={styles.input}
                value={
                  dados.calculoPitot
                    ? `${dados.calculoPitot.nL} x ${dados.calculoPitot.nH} = ${dados.calculoPitot.total}`
                    : ''
                }
                editable={false}
              />
            </View>
          </View>

          <Text style={styles.label}>Velocidade de referência (m/s)</Text>
          <TextInput style={styles.input} value={dados.faixaVelocidade} editable={false} />

          <Text style={styles.subSectionTitle}>Matriz de Medição</Text>

          {dados.matrizPitot.map((linha, i) => (
            <View key={i} style={styles.row}>
              {linha.map((ponto) => (
                <TextInput
                  key={ponto}
                  style={styles.inputMatrix}
                  value={secao.valoresPitot[ponto] || ''}
                  onChangeText={(text) => atualizarValorPitot(secaoId, ponto, text)}
                  keyboardType="numeric"
                />
              ))}
            </View>
          ))}

          {dados.totalPontosEsperados > 0 && (
            <Text style={styles.statusPreenchimento}>
              Pontos preenchidos: {dados.pontosPreenchidos}/{dados.totalPontosEsperados}
            </Text>
          )}

          <Text style={styles.subSectionTitle}>Resultados</Text>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Vazão média (m³/h)</Text>
              <TextInput
                style={styles.input}
                value={dados.vazaoMediaCalculada}
                editable={false}
                placeholder={
                  dados.totalPontosEsperados > 0 && !dados.todosPontosPreenchidos
                    ? 'Preencha todos os pontos da matriz'
                    : ''
                }
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.halfInputNoMargin}>
              <Text style={styles.label}>Desvio (%)</Text>
              <TextInput style={styles.input} value={dados.percentualVazao} editable={false} />
            </View>
          </View>

          <Text style={styles.label}>Pressão estática (Pa)</Text>
          <TextInput
            style={styles.input}
            value={secao.pressaoEstatica}
            onChangeText={(text) => atualizarCampoSecao(secaoId, 'pressaoEstatica', text)}
            keyboardType="numeric"
            placeholder="Ex.: 180"
          />

          {dados.avaliacaoVazao && (
            <View style={styles.resultadoBox}>
              {dados.avaliacaoVazao.conforme ? (
                <Text style={styles.resultadoOk}>
                  Vazão medida dentro do critério de aceitação (±10% da vazão nominal).
                </Text>
              ) : (
                <>
                  <Text style={styles.resultadoAlerta}>
                    Vazão medida fora do critério de aceitação.
                  </Text>

                  <Text style={styles.resultadoInfo}>
                    Faixa aceitável: {dados.avaliacaoVazao.limiteMin} a{' '}
                    {dados.avaliacaoVazao.limiteMax} m³/h
                  </Text>

                  <Text style={styles.label}>Comentário técnico</Text>
                  <TextInput
                    style={styles.inputComentario}
                    value={secao.comentarioVazao}
                    onChangeText={(text) => atualizarCampoSecao(secaoId, 'comentarioVazao', text)}
                    placeholder="Descreva o motivo da vazão estar fora do critério..."
                    multiline
                    textAlignVertical="top"
                  />
                </>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function SectionVazaoAr({
  mostrarVazaoAr,
  setMostrarVazaoAr,
  secoesSelecionadas,
  toggleSelecaoSecao,
  secoes,
  dadosSecoes,
  toggleExpandirSecao,
  atualizarCampoSecao,
  atualizarValorPitot,
}) {
  return (
    <>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarVazaoAr(!mostrarVazaoAr)}
      >
        <Text style={styles.sectionTitle}>1.0 Vazão de Ar</Text>
        <Text style={styles.toggleText}>{mostrarVazaoAr ? '−' : '+'}</Text>
      </TouchableOpacity>

      {mostrarVazaoAr && (
        <View style={styles.mainSectionBox}>
          <Text style={styles.selectionTitle}>Selecione até 2 seções para preenchimento</Text>
          <Text style={styles.selectionSubtitle}>
            Recomenda-se incluir insuflamento entre as opções selecionadas.
          </Text>

          <View style={styles.selectionRow}>
            {SECOES_DUTO.map((item, index) => {
              const selecionada = secoesSelecionadas.includes(item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.optionButton,
                    selecionada && styles.optionButtonSelected,
                    index === SECOES_DUTO.length - 1 && styles.optionButtonLast,
                  ]}
                  onPress={() => toggleSelecaoSecao(item.id)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selecionada && styles.optionButtonTextSelected,
                    ]}
                  >
                    {item.id === 'insuflamento'
                      ? '1.1'
                      : item.id === 'retorno'
                      ? '1.2'
                      : '1.3'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {secoesSelecionadas.map((secaoId) => {
            const item = SECOES_DUTO.find((s) => s.id === secaoId);

            return (
              <SecaoDuto
                key={secaoId}
                secaoId={secaoId}
                titulo={item.titulo}
                secao={secoes[secaoId]}
                dados={dadosSecoes[secaoId]}
                toggleExpandirSecao={toggleExpandirSecao}
                atualizarCampoSecao={atualizarCampoSecao}
                atualizarValorPitot={atualizarValorPitot}
              />
            );
          })}
        </View>
      )}
    </>
  );
}
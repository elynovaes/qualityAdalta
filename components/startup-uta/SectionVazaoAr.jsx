import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

const SECOES_DUTO = [
  { id: 'insuflamento', titulo: '1.1 Insuflamento' },
  { id: 'retorno', titulo: '1.2 Retorno' },
  { id: 'arExterno', titulo: '1.3 Ar externo' },
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
    <View style={styles.subSectionContainer}>
      <TouchableOpacity
        style={styles.sectionHeaderInterno}
        onPress={() => toggleExpandirSecao(secaoId)}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.subSectionTitleHeader}>{titulo}</Text>
          <Text style={styles.selectionSubtitle}>
            Preencha os dados geométricos, a matriz de Pitot e os resultados da medição.
          </Text>
        </View>
        <Text style={styles.toggleText}>{secao.expandida ? '−' : '+'}</Text>
      </TouchableOpacity>

      {secao.expandida && (
        <View style={styles.subSectionBox}>
          <Text style={styles.label}>Vazão nominal (m³/h)</Text>
          <TextInput
            style={styles.input}
            value={secao.vazaoNominal}
            onChangeText={(text) =>
              atualizarCampoSecao(secaoId, 'vazaoNominal', text)
            }
            keyboardType="numeric"
            placeholder="Ex.: 2500"
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Largura do duto (m)</Text>
              <TextInput
                style={styles.input}
                value={secao.larguraDuto}
                onChangeText={(text) =>
                  atualizarCampoSecao(secaoId, 'larguraDuto', text)
                }
                keyboardType="numeric"
                placeholder="Ex.: 0,80"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.halfInputNoMargin}>
              <Text style={styles.label}>Altura do duto (m)</Text>
              <TextInput
                style={styles.input}
                value={secao.alturaDuto}
                onChangeText={(text) =>
                  atualizarCampoSecao(secaoId, 'alturaDuto', text)
                }
                keyboardType="numeric"
                placeholder="Ex.: 0,50"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Área do duto (m²)</Text>
              <TextInput
                style={styles.input}
                value={dados.areaDuto ? String(dados.areaDuto) : ''}
                editable={false}
                placeholder="Calculado automaticamente"
                placeholderTextColor="#9CA3AF"
              />
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
                placeholder="Calculado automaticamente"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <Text style={styles.label}>Velocidade de referência (m/s)</Text>
          <TextInput
            style={styles.input}
            value={dados.faixaVelocidade ? String(dados.faixaVelocidade) : ''}
            editable={false}
            placeholder="Calculado automaticamente"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.subSectionTitle}>Matriz de Medição (Pitot)</Text>
          <Text style={styles.selectionSubtitle}>
            Preencha todos os pontos da matriz para que o cálculo da vazão seja realizado automaticamente.
          </Text>

          {dados.matrizPitot.map((linha, i) => (
            <View key={i} style={styles.row}>
              {linha.map((ponto) => (
                <TextInput
                  key={String(ponto)}
                  style={styles.inputMatrix}
                  value={secao.valoresPitot[ponto] || ''}
                  onChangeText={(text) => atualizarValorPitot(secaoId, ponto, text)}
                  keyboardType="numeric"
                  placeholder={String(ponto)}
                  placeholderTextColor="#9CA3AF"
                />
              ))}
            </View>
          ))}

          {dados.totalPontosEsperados > 0 && (
            <Text style={styles.statusPreenchimento}>
              Pontos preenchidos: {dados.pontosPreenchidos}/{dados.totalPontosEsperados}
            </Text>
          )}

          <Text style={styles.subSectionTitle}>Resultados da Medição</Text>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Vazão média (m³/h)</Text>
              <TextInput
                style={styles.input}
                value={dados.vazaoMediaCalculada ? String(dados.vazaoMediaCalculada) : ''}
                editable={false}
                placeholder={
                  dados.totalPontosEsperados > 0 && !dados.todosPontosPreenchidos
                    ? 'Preencha todos os pontos da matriz'
                    : 'Calculado automaticamente'
                }
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.halfInputNoMargin}>
              <Text style={styles.label}>Desvio (%)</Text>
              <TextInput
                style={styles.input}
                value={dados.percentualVazao ? String(dados.percentualVazao) : ''}
                editable={false}
                placeholder="Calculado automaticamente"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <Text style={styles.label}>Pressão estática (Pa)</Text>
          <TextInput
            style={styles.input}
            value={secao.pressaoEstatica}
            onChangeText={(text) =>
              atualizarCampoSecao(secaoId, 'pressaoEstatica', text)
            }
            keyboardType="numeric"
            placeholder="Ex.: 180"
            placeholderTextColor="#9CA3AF"
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
                    Faixa aceitável: {String(dados.avaliacaoVazao.limiteMin)} a {String(dados.avaliacaoVazao.limiteMax)} m³/h
                  </Text>

                  <Text style={styles.label}>Comentário técnico obrigatório</Text>
                  <TextInput
                    style={styles.inputComentario}
                    value={secao.comentarioVazao}
                    onChangeText={(text) =>
                      atualizarCampoSecao(secaoId, 'comentarioVazao', text)
                    }
                    placeholder="Descreva o motivo da vazão estar fora do critério..."
                    placeholderTextColor="#9CA3AF"
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
    <View style={styles.mainSectionBox}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarVazaoAr(!mostrarVazaoAr)}
        activeOpacity={0.8}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.sectionTitle}>1.0 Vazão de Ar</Text>
          <Text style={styles.selectionSubtitle}>
            Medição de vazão por método de Pitot nos dutos de insuflamento, retorno e ar externo.
          </Text>
        </View>
        <Text style={styles.toggleText}>{mostrarVazaoAr ? '−' : '+'}</Text>
      </TouchableOpacity>

      {mostrarVazaoAr && (
        <View style={styles.subSectionContainer}>
          <View style={styles.subSectionBox}>
            <Text style={styles.selectionTitle}>
              Selecione até 2 seções para preenchimento
            </Text>
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
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        selecionada && styles.optionButtonTextSelected,
                      ]}
                    >
                      {item.titulo}
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
        </View>
      )}
    </View>
  );
}
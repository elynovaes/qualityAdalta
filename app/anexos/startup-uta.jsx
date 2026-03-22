import React, { useMemo, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FormScreen from '../../components/FormScreen';

const SECOES_DUTO = [
  { id: 'insuflamento', titulo: '1.1 Duto de ar de insuflamento' },
  { id: 'retorno', titulo: '1.2 Duto de ar de retorno' },
  { id: 'arExterno', titulo: '1.3 Duto de ar externo' },
];

const criarSecaoInicial = () => ({
  larguraDuto: '',
  alturaDuto: '',
  vazaoNominal: '',
  pressaoEstatica: '',
  comentarioVazao: '',
  valoresPitot: {},
  expandida: false,
});

const criarMotor = () => ({
  frequencia: '',
  tensaoNominal: '',
  tensaoRS: '',
  tensaoRT: '',
  tensaoST: '',
  correnteNominal: '',
  correnteR: '',
  correnteS: '',
  correnteT: '',
});

function parseNumero(valor) {
  const numero = parseFloat(String(valor).replace(',', '.'));
  return Number.isNaN(numero) ? null : numero;
}

function calcularDesequilibrio(valores) {
  const numeros = valores
    .map((v) => parseNumero(v))
    .filter((v) => v !== null);

  if (numeros.length !== 3) return '';

  const media = numeros.reduce((a, b) => a + b, 0) / 3;
  if (media === 0) return '';

  const valorMaisDistante = numeros.reduce((maisDistante, atual) => {
    const desvioAtual = Math.abs(atual - media);
    const desvioMaisDistante = Math.abs(maisDistante - media);
    return desvioAtual > desvioMaisDistante ? atual : maisDistante;
  }, numeros[0]);

  const fd = (Math.abs(valorMaisDistante - media) / media) * 100;
  return fd.toFixed(2);
}

function calcularDadosSecao(secao) {
  const largura = parseNumero(secao.larguraDuto);
  const altura = parseNumero(secao.alturaDuto);
  const vazaoNominal = parseNumero(secao.vazaoNominal);

  const areaDutoNumero =
    largura && altura && largura > 0 && altura > 0 ? largura * altura : null;

  const areaDuto = areaDutoNumero ? areaDutoNumero.toFixed(4) : '';

  let faixaVelocidade = '';
  if (vazaoNominal && vazaoNominal > 0 && areaDutoNumero) {
    const velocidadeMedia = (vazaoNominal / 3600) / areaDutoNumero;
    const velocidadeMin = velocidadeMedia * 0.9;
    const velocidadeMax = velocidadeMedia * 1.1;
    faixaVelocidade = `Min: ${velocidadeMin.toFixed(2)} | Máx: ${velocidadeMax.toFixed(2)}`;
  }

  let calculoPitot = null;
  if (largura && altura && largura > 0 && altura > 0) {
    const margem = 0.05;
    const espacamento = 0.1;

    const nL = Math.floor((largura - 2 * margem) / espacamento) + 1;
    const nH = Math.floor((altura - 2 * margem) / espacamento) + 1;

    if (nL > 0 && nH > 0) {
      calculoPitot = {
        nL,
        nH,
        total: nL * nH,
      };
    }
  }

  const matrizPitot = [];
  if (calculoPitot) {
    let contador = 1;
    for (let i = 0; i < calculoPitot.nH; i++) {
      const linha = [];
      for (let j = 0; j < calculoPitot.nL; j++) {
        linha.push(contador);
        contador++;
      }
      matrizPitot.push(linha);
    }
  }

  const totalPontosEsperados = calculoPitot?.total || 0;

  const pontosValidos = Object.values(secao.valoresPitot)
    .map((valor) => parseNumero(valor))
    .filter((valor) => valor !== null && valor > 0);

  const pontosPreenchidos = pontosValidos.length;
  const todosPontosPreenchidos =
    totalPontosEsperados > 0 && pontosPreenchidos === totalPontosEsperados;

  let vazaoMediaCalculada = '';
  if (
    areaDutoNumero &&
    todosPontosPreenchidos &&
    pontosValidos.length === totalPontosEsperados
  ) {
    const soma = pontosValidos.reduce((acc, valor) => acc + valor, 0);
    const velocidadeMedia = soma / pontosValidos.length;
    const vazaoMedia = velocidadeMedia * areaDutoNumero * 3600;
    vazaoMediaCalculada = vazaoMedia.toFixed(2);
  }

  let percentualVazao = '';
  const vazaoMediaNumero = parseNumero(vazaoMediaCalculada);
  if (vazaoNominal && vazaoNominal > 0 && vazaoMediaNumero && vazaoMediaNumero > 0) {
    const desvioPercentual = ((vazaoMediaNumero - vazaoNominal) / vazaoNominal) * 100;
    if (Math.abs(desvioPercentual) < 0.05) {
      percentualVazao = '0%';
    } else {
      const sinal = desvioPercentual > 0 ? '+' : '';
      percentualVazao = `${sinal}${desvioPercentual.toFixed(1)}%`;
    }
  }

  let avaliacaoVazao = null;
  if (
    todosPontosPreenchidos &&
    vazaoNominal &&
    vazaoNominal > 0 &&
    vazaoMediaNumero &&
    vazaoMediaNumero > 0
  ) {
    const limiteMin = vazaoNominal * 0.9;
    const limiteMax = vazaoNominal * 1.1;
    const conforme = vazaoMediaNumero >= limiteMin && vazaoMediaNumero <= limiteMax;

    avaliacaoVazao = {
      conforme,
      limiteMin: limiteMin.toFixed(2),
      limiteMax: limiteMax.toFixed(2),
    };
  }

  return {
    areaDutoNumero,
    areaDuto,
    faixaVelocidade,
    calculoPitot,
    matrizPitot,
    totalPontosEsperados,
    pontosPreenchidos,
    todosPontosPreenchidos,
    vazaoMediaCalculada,
    percentualVazao,
    avaliacaoVazao,
  };
}

export default function StartupUta() {
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [mostrarVazaoAr, setMostrarVazaoAr] = useState(false);
  const [mostrarDampers, setMostrarDampers] = useState(false);
  const [mostrarCondicoesOperacao, setMostrarCondicoesOperacao] = useState(false);
  const [mostrarEletrica, setMostrarEletrica] = useState(false);

  const [dataInspecao, setDataInspecao] = useState('');
  const [sistemaArea, setSistemaArea] = useState('');
  const [procedimento, setProcedimento] = useState('');
  const [equipamento, setEquipamento] = useState('');
  const [tecnico, setTecnico] = useState('');

  const [alicateSerie, setAlicateSerie] = useState('');
  const [balometroSerie, setBalometroSerie] = useState('');
  const [manometroSerie, setManometroSerie] = useState('');

  const [secoesSelecionadas, setSecoesSelecionadas] = useState([
    'insuflamento',
    'retorno',
  ]);

  const [secoes, setSecoes] = useState({
    insuflamento: { ...criarSecaoInicial(), expandida: true },
    retorno: { ...criarSecaoInicial(), expandida: true },
    arExterno: criarSecaoInicial(),
  });

  const [dampers, setDampers] = useState({
    insuflamento: {
      abertura: '',
      numeroLacre: '',
    },
    retorno: {
      abertura: '',
      numeroLacre: '',
    },
    arExterno: {
      abertura: '',
      numeroLacre: '',
    },
  });

  const [condicoesOperacao, setCondicoesOperacao] = useState({
    pressaoSaidaInsuflamento: '',
    pressaoEstaticaTotal: '',
    pressaoSimva: '',
  });

  const [quantidadeMotores, setQuantidadeMotores] = useState('1');
  const [motores, setMotores] = useState([criarMotor()]);

  const toggleSelecaoSecao = (secaoId) => {
    setSecoesSelecionadas((prev) => {
      const jaSelecionada = prev.includes(secaoId);

      if (jaSelecionada) {
        return prev.filter((id) => id !== secaoId);
      }

      if (prev.length >= 2) {
        Alert.alert('Atenção', 'Você pode selecionar no máximo 2 seções.');
        return prev;
      }

      return [...prev, secaoId];
    });
  };

  const toggleExpandirSecao = (secaoId) => {
    setSecoes((prev) => ({
      ...prev,
      [secaoId]: {
        ...prev[secaoId],
        expandida: !prev[secaoId].expandida,
      },
    }));
  };

  const atualizarCampoSecao = (secaoId, campo, valor) => {
    setSecoes((prev) => ({
      ...prev,
      [secaoId]: {
        ...prev[secaoId],
        [campo]: valor,
      },
    }));
  };

  const atualizarValorPitot = (secaoId, ponto, valor) => {
    setSecoes((prev) => ({
      ...prev,
      [secaoId]: {
        ...prev[secaoId],
        valoresPitot: {
          ...prev[secaoId].valoresPitot,
          [ponto]: valor,
        },
      },
    }));
  };

  const atualizarDamper = (tipo, campo, valor) => {
    setDampers((prev) => ({
      ...prev,
      [tipo]: {
        ...prev[tipo],
        [campo]: valor,
      },
    }));
  };

  const atualizarCondicaoOperacao = (campo, valor) => {
    setCondicoesOperacao((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const atualizarMotor = (index, campo, valor) => {
    setMotores((prev) => {
      const novos = [...prev];
      novos[index] = {
        ...novos[index],
        [campo]: valor,
      };
      return novos;
    });
  };

  const atualizarQuantidadeMotores = (valor) => {
    setQuantidadeMotores(valor);

    const qtd = parseInt(valor, 10);
    if (isNaN(qtd) || qtd <= 0) return;

    setMotores((prev) => {
      const novos = [...prev];

      if (qtd > novos.length) {
        while (novos.length < qtd) {
          novos.push(criarMotor());
        }
        return novos;
      }

      return novos.slice(0, qtd);
    });
  };

  const dadosSecoes = useMemo(() => {
    return {
      insuflamento: calcularDadosSecao(secoes.insuflamento),
      retorno: calcularDadosSecao(secoes.retorno),
      arExterno: calcularDadosSecao(secoes.arExterno),
    };
  }, [secoes]);

  const vazaoInsuflamento = dadosSecoes.insuflamento.vazaoMediaCalculada;
  const pressaoSimvaNumero = parseNumero(condicoesOperacao.pressaoSimva);
  const vazaoInsuflamentoNumero = parseNumero(vazaoInsuflamento);

  const fatorK = useMemo(() => {
    if (
      !vazaoInsuflamentoNumero ||
      vazaoInsuflamentoNumero <= 0 ||
      pressaoSimvaNumero === null
    ) {
      return '';
    }

    const deltaPSimva = Math.abs(pressaoSimvaNumero);
    if (deltaPSimva <= 0) return '';

    const k = vazaoInsuflamentoNumero / Math.sqrt(deltaPSimva);
    return k.toFixed(4);
  }, [vazaoInsuflamentoNumero, pressaoSimvaNumero]);

  const renderSecaoDuto = (secaoId, titulo) => {
    const secao = secoes[secaoId];
    const dados = dadosSecoes[secaoId];

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
                <TextInput
                  style={styles.input}
                  value={dados.percentualVazao}
                  editable={false}
                />
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
                      onChangeText={(text) =>
                        atualizarCampoSecao(secaoId, 'comentarioVazao', text)
                      }
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
  };

  return (
    <FormScreen>
      <Text style={styles.title}>Startup de Unidade de Tratamento - UTA</Text>

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
            return renderSecaoDuto(secaoId, item.titulo);
          })}
        </View>
      )}

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

      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarCondicoesOperacao(!mostrarCondicoesOperacao)}
      >
        <Text style={styles.sectionTitle}>3.0 Condições de Operação</Text>
        <Text style={styles.toggleText}>{mostrarCondicoesOperacao ? '−' : '+'}</Text>
      </TouchableOpacity>

      {mostrarCondicoesOperacao && (
        <View style={styles.mainSectionBox}>
          <Text style={styles.label}>
            3.1 Pressão estática disponível na saída de insuflamento após o ventilador (duto)
          </Text>
          <TextInput
            style={styles.input}
            value={condicoesOperacao.pressaoSaidaInsuflamento}
            onChangeText={(text) =>
              atualizarCondicaoOperacao('pressaoSaidaInsuflamento', text)
            }
            keyboardType="numeric"
            placeholder="Ex.: 350"
          />

          <Text style={styles.label}>3.2 Pressão estática Total (∆P ventilador)</Text>
          <TextInput
            style={styles.input}
            value={condicoesOperacao.pressaoEstaticaTotal}
            onChangeText={(text) => atualizarCondicaoOperacao('pressaoEstaticaTotal', text)}
            keyboardType="numeric"
            placeholder="Ex.: 520"
          />

          <Text style={styles.label}>
            3.3 Pressão estática SIMVA (bocal do ventilador - módulo negativo)
          </Text>
          <TextInput
            style={styles.input}
            value={condicoesOperacao.pressaoSimva}
            onChangeText={(text) => atualizarCondicaoOperacao('pressaoSimva', text)}
            keyboardType="numeric"
            placeholder="Ex.: -250"
          />

          <Text style={styles.label}>3.4 Fator k (k = Q / √∆P(SIMVA))</Text>
          <TextInput
            style={styles.input}
            value={fatorK}
            editable={false}
            placeholder="Calculado automaticamente"
            placeholderTextColor="#888"
          />

          <Text style={styles.infoAuxiliar}>
            Para o cálculo do fator k, o app utiliza a vazão medida do insuflamento e o módulo
            da pressão SIMVA.
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setMostrarEletrica(!mostrarEletrica)}
      >
        <Text style={styles.sectionTitle}>4.0 Elétrica</Text>
        <Text style={styles.toggleText}>{mostrarEletrica ? '−' : '+'}</Text>
      </TouchableOpacity>

      {mostrarEletrica && (
        <View style={styles.mainSectionBox}>
          <Text style={styles.label}>Quantidade de motores</Text>
          <TextInput
            style={styles.input}
            value={quantidadeMotores}
            onChangeText={atualizarQuantidadeMotores}
            keyboardType="numeric"
            placeholder="Ex.: 1"
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

            const tensaoConforme =
              tensaoMin !== null &&
              tensaoMax !== null &&
              tensaoRSNumero !== null &&
              tensaoRTNumero !== null &&
              tensaoSTNumero !== null &&
              tensaoRSNumero >= tensaoMin &&
              tensaoRSNumero <= tensaoMax &&
              tensaoRTNumero >= tensaoMin &&
              tensaoRTNumero <= tensaoMax &&
              tensaoSTNumero >= tensaoMin &&
              tensaoSTNumero <= tensaoMax &&
              parseNumero(desequilibrioTensao) !== null &&
              parseNumero(desequilibrioTensao) <= 3;

            const correnteConforme =
              correnteNominalNumero !== null &&
              correnteNominalNumero > 0 &&
              correnteRNumero !== null &&
              correnteSNumero !== null &&
              correnteTNumero !== null &&
              correnteRNumero <= correnteNominalNumero &&
              correnteSNumero <= correnteNominalNumero &&
              correnteTNumero <= correnteNominalNumero &&
              parseNumero(desequilibrioCorrente) !== null &&
              parseNumero(desequilibrioCorrente) <= 15;

            return (
              <View key={index} style={styles.subSectionContainer}>
                <View style={styles.subSectionBox}>
                  <Text style={styles.subSectionTitle}>Motor {index + 1}</Text>

                  <Text style={styles.label}>4.1 Frequência (% ou Hz)</Text>
                  <TextInput
                    style={styles.input}
                    value={motor.frequencia}
                    onChangeText={(text) => atualizarMotor(index, 'frequencia', text)}
                    keyboardType="numeric"
                  />

                  <Text style={styles.subSectionTitle}>4.2 Tensão elétrica (V)</Text>

                  <Text style={styles.label}>Nominal</Text>
                  <TextInput
                    style={styles.input}
                    value={motor.tensaoNominal}
                    onChangeText={(text) => atualizarMotor(index, 'tensaoNominal', text)}
                    keyboardType="numeric"
                  />

                  <View style={styles.row}>
                    <View style={styles.thirdInput}>
                      <Text style={styles.label}>R-S</Text>
                      <TextInput
                        style={styles.input}
                        value={motor.tensaoRS}
                        onChangeText={(text) => atualizarMotor(index, 'tensaoRS', text)}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.thirdInput}>
                      <Text style={styles.label}>R-T</Text>
                      <TextInput
                        style={styles.input}
                        value={motor.tensaoRT}
                        onChangeText={(text) => atualizarMotor(index, 'tensaoRT', text)}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.thirdInputNoMargin}>
                      <Text style={styles.label}>S-T</Text>
                      <TextInput
                        style={styles.input}
                        value={motor.tensaoST}
                        onChangeText={(text) => atualizarMotor(index, 'tensaoST', text)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <Text style={styles.label}>Desequilíbrio (%)</Text>
                  <TextInput
                    style={styles.input}
                    value={desequilibrioTensao}
                    editable={false}
                  />

                  {tensaoConforme ? (
                    <Text style={styles.resultadoOkInline}>
                      Tensão conforme: medições dentro de ±5% da nominal e desequilíbrio ≤ 3%.
                    </Text>
                  ) : (
                    <Text style={styles.resultadoAlertaInline}>
                      Tensão fora do critério: medições devem estar em ±5% da nominal e o
                      desequilíbrio deve ser ≤ 3%.
                    </Text>
                  )}

                  <Text style={styles.subSectionTitle}>4.3 Corrente (A)</Text>

                  <Text style={styles.label}>Nominal</Text>
                  <TextInput
                    style={styles.input}
                    value={motor.correnteNominal}
                    onChangeText={(text) => atualizarMotor(index, 'correnteNominal', text)}
                    keyboardType="numeric"
                  />

                  <View style={styles.row}>
                    <View style={styles.thirdInput}>
                      <Text style={styles.label}>R</Text>
                      <TextInput
                        style={styles.input}
                        value={motor.correnteR}
                        onChangeText={(text) => atualizarMotor(index, 'correnteR', text)}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.thirdInput}>
                      <Text style={styles.label}>S</Text>
                      <TextInput
                        style={styles.input}
                        value={motor.correnteS}
                        onChangeText={(text) => atualizarMotor(index, 'correnteS', text)}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.thirdInputNoMargin}>
                      <Text style={styles.label}>T</Text>
                      <TextInput
                        style={styles.input}
                        value={motor.correnteT}
                        onChangeText={(text) => atualizarMotor(index, 'correnteT', text)}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <Text style={styles.label}>Desequilíbrio (%)</Text>
                  <TextInput
                    style={styles.input}
                    value={desequilibrioCorrente}
                    editable={false}
                  />

                  {correnteConforme ? (
                    <Text style={styles.resultadoOkInline}>
                      Corrente conforme: medições ≤ nominal e desequilíbrio ≤ 15%.
                    </Text>
                  ) : (
                    <Text style={styles.resultadoAlertaInline}>
                      Corrente fora do critério: medições devem ser ≤ nominal e o desequilíbrio
                      deve ser ≤ 15%.
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },

  sectionHeaderInterno: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D4ED8',
  },

  subSectionTitleHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D4ED8',
    flex: 1,
    paddingRight: 8,
  },

  toggleText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D4ED8',
  },

  mainSectionBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fafafa',
  },

  subSectionContainer: {
    marginTop: 14,
  },

  subSectionBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },

  subSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 8,
  },

  selectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },

  selectionSubtitle: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
  },

  selectionRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1D4ED8',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },

  optionButtonLast: {
    marginRight: 0,
  },

  optionButtonSelected: {
    backgroundColor: '#1D4ED8',
  },

  optionButtonText: {
    color: '#1D4ED8',
    fontWeight: '700',
  },

  optionButtonTextSelected: {
    color: '#fff',
  },

  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  halfInput: {
    flex: 1,
    marginRight: 5,
  },

  halfInputNoMargin: {
    flex: 1,
  },

  thirdInput: {
    flex: 1,
    marginRight: 5,
  },

  thirdInputNoMargin: {
    flex: 1,
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
    backgroundColor: '#fff',
  },

  statusPreenchimento: {
    marginTop: 8,
    fontSize: 13,
    color: '#555',
  },

  resultadoBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },

  resultadoOk: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15803D',
  },

  resultadoAlerta: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B91C1C',
    marginBottom: 4,
  },

  resultadoInfo: {
    fontSize: 13,
    marginBottom: 8,
    color: '#444',
  },

  resultadoOkInline: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#15803D',
  },

  resultadoAlertaInline: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#B91C1C',
  },

  inputComentario: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    minHeight: 90,
  },

  tableRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },

  firstColumn: {
    flex: 1.3,
    paddingRight: 6,
  },

  otherColumn: {
    flex: 1,
    paddingHorizontal: 2,
  },

  tableHeader: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },

  infoAuxiliar: {
    marginTop: 8,
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
});
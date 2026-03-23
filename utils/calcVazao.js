import { parseNumero } from './calcDesequilibrio';
import { calcularPitot, contarPontosValidos, gerarMatrizPitot } from './calcPitot';

export function calcularAreaDuto(largura, altura) {
  const larguraNumero = parseNumero(largura);
  const alturaNumero = parseNumero(altura);

  if (
    larguraNumero === null ||
    alturaNumero === null ||
    larguraNumero <= 0 ||
    alturaNumero <= 0
  ) {
    return {
      areaDutoNumero: null,
      areaDuto: '',
    };
  }

  const areaDutoNumero = larguraNumero * alturaNumero;

  return {
    areaDutoNumero,
    areaDuto: areaDutoNumero.toFixed(4),
  };
}

export function calcularFaixaVelocidade(vazaoNominal, areaDutoNumero) {
  const vazaoNominalNumero = parseNumero(vazaoNominal);

  if (
    vazaoNominalNumero === null ||
    vazaoNominalNumero <= 0 ||
    !areaDutoNumero ||
    areaDutoNumero <= 0
  ) {
    return '';
  }

  const velocidadeMedia = (vazaoNominalNumero / 3600) / areaDutoNumero;
  const velocidadeMin = velocidadeMedia * 0.9;
  const velocidadeMax = velocidadeMedia * 1.1;

  return `Min: ${velocidadeMin.toFixed(2)} | Máx: ${velocidadeMax.toFixed(2)}`;
}

export function calcularVazaoMedia(areaDutoNumero, valoresPitot = {}, totalPontosEsperados = 0) {
  if (!areaDutoNumero || areaDutoNumero <= 0 || totalPontosEsperados <= 0) {
    return {
      vazaoMediaCalculada: '',
      vazaoMediaNumero: null,
      pontosValidos: [],
      pontosPreenchidos: 0,
      todosPontosPreenchidos: false,
    };
  }

  const { pontosValidos, pontosPreenchidos } = contarPontosValidos(valoresPitot);

  const todosPontosPreenchidos = pontosPreenchidos === totalPontosEsperados;

  if (!todosPontosPreenchidos || pontosValidos.length !== totalPontosEsperados) {
    return {
      vazaoMediaCalculada: '',
      vazaoMediaNumero: null,
      pontosValidos,
      pontosPreenchidos,
      todosPontosPreenchidos,
    };
  }

  const soma = pontosValidos.reduce((acc, valor) => acc + valor, 0);
  const velocidadeMedia = soma / pontosValidos.length;
  const vazaoMediaNumero = velocidadeMedia * areaDutoNumero * 3600;

  return {
    vazaoMediaCalculada: vazaoMediaNumero.toFixed(2),
    vazaoMediaNumero,
    pontosValidos,
    pontosPreenchidos,
    todosPontosPreenchidos,
  };
}

export function calcularPercentualVazao(vazaoNominal, vazaoMediaCalculada) {
  const vazaoNominalNumero = parseNumero(vazaoNominal);
  const vazaoMediaNumero = parseNumero(vazaoMediaCalculada);

  if (
    vazaoNominalNumero === null ||
    vazaoNominalNumero <= 0 ||
    vazaoMediaNumero === null ||
    vazaoMediaNumero <= 0
  ) {
    return '';
  }

  const desvioPercentual = ((vazaoMediaNumero - vazaoNominalNumero) / vazaoNominalNumero) * 100;

  if (Math.abs(desvioPercentual) < 0.05) {
    return '0%';
  }

  const sinal = desvioPercentual > 0 ? '+' : '';
  return `${sinal}${desvioPercentual.toFixed(1)}%`;
}

export function avaliarVazao(vazaoNominal, vazaoMediaCalculada, todosPontosPreenchidos) {
  const vazaoNominalNumero = parseNumero(vazaoNominal);
  const vazaoMediaNumero = parseNumero(vazaoMediaCalculada);

  if (
    !todosPontosPreenchidos ||
    vazaoNominalNumero === null ||
    vazaoNominalNumero <= 0 ||
    vazaoMediaNumero === null ||
    vazaoMediaNumero <= 0
  ) {
    return null;
  }

  const limiteMin = vazaoNominalNumero * 0.9;
  const limiteMax = vazaoNominalNumero * 1.1;
  const conforme = vazaoMediaNumero >= limiteMin && vazaoMediaNumero <= limiteMax;

  return {
    conforme,
    limiteMin: limiteMin.toFixed(2),
    limiteMax: limiteMax.toFixed(2),
  };
}

export function calcularDadosSecao(secao) {
  const { areaDutoNumero, areaDuto } = calcularAreaDuto(secao.larguraDuto, secao.alturaDuto);

  const faixaVelocidade = calcularFaixaVelocidade(secao.vazaoNominal, areaDutoNumero);

  const calculoPitot = calcularPitot(secao.larguraDuto, secao.alturaDuto);
  const matrizPitot = gerarMatrizPitot(calculoPitot);
  const totalPontosEsperados = calculoPitot?.total || 0;

  const {
    vazaoMediaCalculada,
    pontosPreenchidos,
    todosPontosPreenchidos,
  } = calcularVazaoMedia(areaDutoNumero, secao.valoresPitot, totalPontosEsperados);

  const percentualVazao = calcularPercentualVazao(secao.vazaoNominal, vazaoMediaCalculada);

  const avaliacaoVazao = avaliarVazao(
    secao.vazaoNominal,
    vazaoMediaCalculada,
    todosPontosPreenchidos
  );

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
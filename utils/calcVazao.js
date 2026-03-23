import { parseNumero } from './calcDesequilibrio';

export function calcularPitot(largura, altura) {
  const larguraNumero = parseNumero(largura);
  const alturaNumero = parseNumero(altura);

  if (
    larguraNumero === null ||
    alturaNumero === null ||
    larguraNumero <= 0 ||
    alturaNumero <= 0
  ) {
    return null;
  }

  const margem = 0.05;
  const espacamento = 0.1;

  const nL = Math.floor((larguraNumero - 2 * margem) / espacamento) + 1;
  const nH = Math.floor((alturaNumero - 2 * margem) / espacamento) + 1;

  if (nL <= 0 || nH <= 0) {
    return null;
  }

  return {
    nL,
    nH,
    total: nL * nH,
  };
}

export function gerarMatrizPitot(calculoPitot) {
  if (!calculoPitot) return [];

  const matrizPitot = [];
  let contador = 1;

  for (let i = 0; i < calculoPitot.nH; i++) {
    const linha = [];
    for (let j = 0; j < calculoPitot.nL; j++) {
      linha.push(contador);
      contador++;
    }
    matrizPitot.push(linha);
  }

  return matrizPitot;
}

export function contarPontosValidos(valoresPitot = {}) {
  const pontosValidos = Object.values(valoresPitot)
    .map((valor) => parseNumero(valor))
    .filter((valor) => valor !== null && valor > 0);

  return {
    pontosValidos,
    pontosPreenchidos: pontosValidos.length,
  };
}
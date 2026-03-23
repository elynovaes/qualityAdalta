import { parseNumero } from './calcDesequilibrio';

export function calcularFatorK(vazaoInsuflamento, pressaoSimva) {
  const vazaoInsuflamentoNumero = parseNumero(vazaoInsuflamento);
  const pressaoSimvaNumero = parseNumero(pressaoSimva);

  if (
    vazaoInsuflamentoNumero === null ||
    vazaoInsuflamentoNumero <= 0 ||
    pressaoSimvaNumero === null
  ) {
    return '';
  }

  const deltaPSimva = Math.abs(pressaoSimvaNumero);

  if (deltaPSimva <= 0) {
    return '';
  }

  const k = vazaoInsuflamentoNumero / Math.sqrt(deltaPSimva);
  return k.toFixed(4);
}
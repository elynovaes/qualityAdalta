import { parseNumero } from './calcDesequilibrio';

export function calcularDesvioAguaGelada(vazaoNominal, vazaoMedida) {
  const vazaoNominalNumero = parseNumero(vazaoNominal);
  const vazaoMedidaNumero = parseNumero(vazaoMedida);

  if (
    vazaoNominalNumero === null ||
    vazaoNominalNumero <= 0 ||
    vazaoMedidaNumero === null
  ) {
    return '';
  }

  const desvio = ((vazaoMedidaNumero - vazaoNominalNumero) / vazaoNominalNumero) * 100;
  const sinal = desvio > 0 ? '+' : '';

  return `${sinal}${desvio.toFixed(1)}%`;
}

export function avaliarAguaGelada(vazaoNominal, vazaoMedida) {
  const vazaoNominalNumero = parseNumero(vazaoNominal);
  const vazaoMedidaNumero = parseNumero(vazaoMedida);

  if (
    vazaoNominalNumero === null ||
    vazaoNominalNumero <= 0 ||
    vazaoMedidaNumero === null
  ) {
    return null;
  }

  const limiteMin = vazaoNominalNumero * 0.9;
  const limiteMax = vazaoNominalNumero * 1.1;
  const conforme = vazaoMedidaNumero >= limiteMin && vazaoMedidaNumero <= limiteMax;

  return {
    conforme,
    limiteMin: limiteMin.toFixed(2),
    limiteMax: limiteMax.toFixed(2),
  };
}
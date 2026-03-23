export function parseNumero(valor) {
  const numero = parseFloat(String(valor).replace(',', '.'));
  return Number.isNaN(numero) ? null : numero;
}

export function calcularDesequilibrio(valores) {
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
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

function montarHtmlStartup(payload) {
  const identificacao = payload?.identificacao || {};
  const aguaGelada = payload?.aguaGelada || {};
  const observacoes = payload?.observacoesComentarios || '';

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #222; }
          h1 { font-size: 20px; margin-bottom: 8px; }
          h2 { font-size: 16px; margin-top: 20px; margin-bottom: 8px; }
          p { margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #ccc; padding: 8px; font-size: 12px; }
          th { background: #f2f2f2; text-align: left; }
        </style>
      </head>
      <body>
        <h1>Startup de Unidade de Tratamento - UTA</h1>

        <h2>Identificação</h2>
        <p><strong>Data:</strong> ${identificacao.dataInspecao || ''}</p>
        <p><strong>Sistema/Área:</strong> ${identificacao.sistemaArea || ''}</p>
        <p><strong>Procedimento:</strong> ${identificacao.procedimento || ''}</p>
        <p><strong>Equipamento:</strong> ${identificacao.equipamento || ''}</p>
        <p><strong>Técnico:</strong> ${identificacao.tecnico || ''}</p>

        <h2>Água Gelada</h2>
        <table>
          <tr>
            <th>Modelo da válvula</th>
            <th>Abertura manual</th>
            <th>ΔP operação</th>
            <th>Vazão nominal</th>
            <th>Vazão medida</th>
            <th>Desvio</th>
            <th>Avaliação</th>
          </tr>
          <tr>
            <td>${aguaGelada.modeloValvula || ''}</td>
            <td>${aguaGelada.aberturaValvulaManual || ''}</td>
            <td>${aguaGelada.deltaPOperacao || ''}</td>
            <td>${aguaGelada.vazaoNominal || ''}</td>
            <td>${aguaGelada.vazaoMedida || ''}</td>
            <td>${aguaGelada.desvio || ''}</td>
            <td>${aguaGelada.avaliacao || ''}</td>
          </tr>
        </table>

        <h2>Observações</h2>
        <p>${observacoes || 'Sem observações.'}</p>
      </body>
    </html>
  `;
}

export async function gerarPdfStartup(payload) {
  const html = montarHtmlStartup(payload);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  const canShare = await Sharing.isAvailableAsync();

  if (canShare) {
    await Sharing.shareAsync(uri);
  }

  return uri;
}
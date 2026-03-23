import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import {
  avaliarAguaGelada,
  calcularDesvioAguaGelada,
} from '../utils/calcAguaGelada';
import { parseNumero } from '../utils/calcDesequilibrio';
import { calcularFatorK } from '../utils/calcFatorK';
import { calcularDadosSecao } from '../utils/calcVazao';

export const SECOES_DUTO = [
  { id: 'insuflamento', titulo: '1.1 Duto de ar de insuflamento' },
  { id: 'retorno', titulo: '1.2 Duto de ar de retorno' },
  { id: 'arExterno', titulo: '1.3 Duto de ar externo' },
];

export const criarSecaoInicial = () => ({
  larguraDuto: '',
  alturaDuto: '',
  vazaoNominal: '',
  pressaoEstatica: '',
  comentarioVazao: '',
  valoresPitot: {},
  expandida: false,
});

export const criarMotor = () => ({
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

export const criarFiltro = (eficiencia, criterioAceitacao) => ({
  eficiencia,
  criterioAceitacao: String(criterioAceitacao),
  deltaPMedido: '',
});

export const criarAguaGeladaInicial = () => ({
  modeloValvula: '',
  aberturaValvulaManual: '',
  deltaPOperacao: '',
  vazaoNominal: '',
  vazaoMedida: '',
});

export default function useStartupUTA() {
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [mostrarVazaoAr, setMostrarVazaoAr] = useState(false);
  const [mostrarDampers, setMostrarDampers] = useState(false);
  const [mostrarCondicoesOperacao, setMostrarCondicoesOperacao] = useState(false);
  const [mostrarEletrica, setMostrarEletrica] = useState(false);
  const [mostrarPerdaCargaFiltros, setMostrarPerdaCargaFiltros] = useState(false);
  const [mostrarAguaGelada, setMostrarAguaGelada] = useState(false);
  const [mostrarObservacoesComentarios, setMostrarObservacoesComentarios] = useState(false);

  const [observacoesComentarios, setObservacoesComentarios] = useState('');

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

  const [filtros, setFiltros] = useState([
    criarFiltro('G4', 150),
    criarFiltro('F9', 350),
    criarFiltro('H14', 600),
  ]);

  const [aguaGelada, setAguaGelada] = useState(criarAguaGeladaInicial());

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
    if (Number.isNaN(qtd) || qtd <= 0) return;

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

  const atualizarFiltro = (index, campo, valor) => {
    setFiltros((prev) => {
      const novos = [...prev];
      novos[index] = {
        ...novos[index],
        [campo]: valor,
      };
      return novos;
    });
  };

  const atualizarAguaGelada = (campo, valor) => {
    setAguaGelada((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const dadosSecoes = useMemo(() => {
    return {
      insuflamento: calcularDadosSecao(secoes.insuflamento),
      retorno: calcularDadosSecao(secoes.retorno),
      arExterno: calcularDadosSecao(secoes.arExterno),
    };
  }, [secoes]);

  const vazaoInsuflamento = dadosSecoes.insuflamento.vazaoMediaCalculada;

  const fatorK = useMemo(() => {
    return calcularFatorK(vazaoInsuflamento, condicoesOperacao.pressaoSimva);
  }, [vazaoInsuflamento, condicoesOperacao.pressaoSimva]);

  const desvioAguaGelada = useMemo(() => {
    return calcularDesvioAguaGelada(
      aguaGelada.vazaoNominal,
      aguaGelada.vazaoMedida
    );
  }, [aguaGelada.vazaoNominal, aguaGelada.vazaoMedida]);

  const avaliacaoAguaGelada = useMemo(() => {
    return avaliarAguaGelada(
      aguaGelada.vazaoNominal,
      aguaGelada.vazaoMedida
    );
  }, [aguaGelada.vazaoNominal, aguaGelada.vazaoMedida]);

  const getPayload = () => ({
    identificacao: {
      dataInspecao,
      sistemaArea,
      procedimento,
      equipamento,
      tecnico,
      instrumentos: {
        alicateSerie,
        balometroSerie,
        manometroSerie,
      },
    },
    vazaoAr: {
      secoesSelecionadas,
      secoes,
      resultados: dadosSecoes,
    },
    dampers,
    condicoesOperacao: {
      ...condicoesOperacao,
      fatorK,
    },
    eletrica: {
      quantidadeMotores,
      motores,
    },
    filtros,
    aguaGelada: {
      ...aguaGelada,
      desvio: desvioAguaGelada,
      avaliacao: avaliacaoAguaGelada,
    },
    observacoesComentarios,
  });

  const resetFormulario = () => {
    setMostrarInfo(false);
    setMostrarVazaoAr(false);
    setMostrarDampers(false);
    setMostrarCondicoesOperacao(false);
    setMostrarEletrica(false);
    setMostrarPerdaCargaFiltros(false);
    setMostrarAguaGelada(false);
    setMostrarObservacoesComentarios(false);

    setObservacoesComentarios('');

    setDataInspecao('');
    setSistemaArea('');
    setProcedimento('');
    setEquipamento('');
    setTecnico('');

    setAlicateSerie('');
    setBalometroSerie('');
    setManometroSerie('');

    setSecoesSelecionadas(['insuflamento', 'retorno']);

    setSecoes({
      insuflamento: { ...criarSecaoInicial(), expandida: true },
      retorno: { ...criarSecaoInicial(), expandida: true },
      arExterno: criarSecaoInicial(),
    });

    setDampers({
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

    setCondicoesOperacao({
      pressaoSaidaInsuflamento: '',
      pressaoEstaticaTotal: '',
      pressaoSimva: '',
    });

    setQuantidadeMotores('1');
    setMotores([criarMotor()]);

    setFiltros([
      criarFiltro('G4', 150),
      criarFiltro('F9', 350),
      criarFiltro('H14', 600),
    ]);

    setAguaGelada(criarAguaGeladaInicial());
  };

  return {
    SECOES_DUTO,

    mostrarInfo,
    setMostrarInfo,
    mostrarVazaoAr,
    setMostrarVazaoAr,
    mostrarDampers,
    setMostrarDampers,
    mostrarCondicoesOperacao,
    setMostrarCondicoesOperacao,
    mostrarEletrica,
    setMostrarEletrica,
    mostrarPerdaCargaFiltros,
    setMostrarPerdaCargaFiltros,
    mostrarAguaGelada,
    setMostrarAguaGelada,
    mostrarObservacoesComentarios,
    setMostrarObservacoesComentarios,

    observacoesComentarios,
    setObservacoesComentarios,

    dataInspecao,
    setDataInspecao,
    sistemaArea,
    setSistemaArea,
    procedimento,
    setProcedimento,
    equipamento,
    setEquipamento,
    tecnico,
    setTecnico,

    alicateSerie,
    setAlicateSerie,
    balometroSerie,
    setBalometroSerie,
    manometroSerie,
    setManometroSerie,

    secoesSelecionadas,
    setSecoesSelecionadas,
    secoes,
    setSecoes,
    dampers,
    setDampers,
    condicoesOperacao,
    setCondicoesOperacao,
    quantidadeMotores,
    setQuantidadeMotores,
    motores,
    setMotores,
    filtros,
    setFiltros,
    aguaGelada,
    setAguaGelada,

    toggleSelecaoSecao,
    toggleExpandirSecao,
    atualizarCampoSecao,
    atualizarValorPitot,
    atualizarDamper,
    atualizarCondicaoOperacao,
    atualizarMotor,
    atualizarQuantidadeMotores,
    atualizarFiltro,
    atualizarAguaGelada,

    dadosSecoes,
    fatorK,
    desvioAguaGelada,
    avaliacaoAguaGelada,

    parseNumero,
    getPayload,
    resetFormulario,
  };
}
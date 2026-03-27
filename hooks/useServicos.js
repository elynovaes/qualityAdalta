import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createServico,
  deleteServico,
  getServicos,
  updateServico,
} from '../services/serviceApi';
import { logger } from '../utils/logger';

export default function useServicos() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  const carregarServicos = useCallback(async () => {
    try {
      setLoading(true);
      setErro('');

      const dados = await getServicos();
      setServicos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      logger.error('Erro ao carregar serviços:', error);
      setErro('Não foi possível carregar os serviços.');
      setServicos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarServicos();
  }, [carregarServicos]);

  const salvarServico = useCallback(
    async (editingId, dados) => {
      if (editingId) {
        const servicoAtualizado = await updateServico(editingId, dados);
        logger.info('Serviço atualizado:', servicoAtualizado);
      } else {
        const novoServico = await createServico(dados);
        logger.info('Serviço criado:', novoServico);
      }

      await carregarServicos();
    },
    [carregarServicos]
  );

  const removerServico = useCallback(
    async (id) => {
      await deleteServico(id);
      await carregarServicos();
    },
    [carregarServicos]
  );

  const servicosFiltrados = useMemo(() => {
    const texto = (busca || '').toLowerCase();

    return servicos.filter((item) => {
      if (!item) return false;
      const clientTexto = (item.client || '').toLowerCase();
      const osTexto = (item.os || '').toLowerCase();
      return clientTexto.includes(texto) || osTexto.includes(texto);
    });
  }, [busca, servicos]);

  return {
    servicosFiltrados,
    loading,
    erro,
    busca,
    setBusca,
    salvarServico,
    removerServico,
  };
}
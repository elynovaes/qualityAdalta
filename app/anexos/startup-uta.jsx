import React from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import FormScreen from '../../components/FormScreen';

import SectionAguaGelada from '../../components/startup-uta/SectionAguaGelada';
import SectionCondicoes from '../../components/startup-uta/SectionCondicoes';
import SectionDampers from '../../components/startup-uta/SectionDampers';
import SectionEletrica from '../../components/startup-uta/SectionEletrica';
import SectionFiltros from '../../components/startup-uta/SectionFiltros';
import SectionIdentificacao from '../../components/startup-uta/SectionIdentificacao';
import SectionObservacoes from '../../components/startup-uta/SectionObservacoes';
import SectionVazaoAr from '../../components/startup-uta/SectionVazaoAr';
import styles from '../../components/startup-uta/styles';

import useStartupUTA from '../../hooks/useStartupUta';
import { calcularDesequilibrio } from '../../utils/calcDesequilibrio';

export default function StartupUta() {
  const form = useStartupUTA();

  const handleSalvar = () => {
    const payload = form.getPayload();

    console.log('Payload Startup UTA:', payload);

    Alert.alert('Sucesso', 'Dados do Startup UTA preparados com sucesso.');
  };

  return (
    <FormScreen>
      <Text style={styles.title}>Startup de Unidade de Tratamento - UTA</Text>

      <SectionIdentificacao
        mostrarInfo={form.mostrarInfo}
        setMostrarInfo={form.setMostrarInfo}
        dataInspecao={form.dataInspecao}
        setDataInspecao={form.setDataInspecao}
        sistemaArea={form.sistemaArea}
        setSistemaArea={form.setSistemaArea}
        procedimento={form.procedimento}
        setProcedimento={form.setProcedimento}
        equipamento={form.equipamento}
        setEquipamento={form.setEquipamento}
        alicateSerie={form.alicateSerie}
        setAlicateSerie={form.setAlicateSerie}
        balometroSerie={form.balometroSerie}
        setBalometroSerie={form.setBalometroSerie}
        manometroSerie={form.manometroSerie}
        setManometroSerie={form.setManometroSerie}
        tecnico={form.tecnico}
        setTecnico={form.setTecnico}
      />

      <SectionVazaoAr
        mostrarVazaoAr={form.mostrarVazaoAr}
        setMostrarVazaoAr={form.setMostrarVazaoAr}
        secoesSelecionadas={form.secoesSelecionadas}
        toggleSelecaoSecao={form.toggleSelecaoSecao}
        secoes={form.secoes}
        dadosSecoes={form.dadosSecoes}
        toggleExpandirSecao={form.toggleExpandirSecao}
        atualizarCampoSecao={form.atualizarCampoSecao}
        atualizarValorPitot={form.atualizarValorPitot}
      />

      <SectionDampers
        mostrarDampers={form.mostrarDampers}
        setMostrarDampers={form.setMostrarDampers}
        dampers={form.dampers}
        atualizarDamper={form.atualizarDamper}
      />

      <SectionCondicoes
        mostrarCondicoesOperacao={form.mostrarCondicoesOperacao}
        setMostrarCondicoesOperacao={form.setMostrarCondicoesOperacao}
        condicoesOperacao={form.condicoesOperacao}
        atualizarCondicaoOperacao={form.atualizarCondicaoOperacao}
        fatorK={form.fatorK}
      />

      <SectionEletrica
        mostrarEletrica={form.mostrarEletrica}
        setMostrarEletrica={form.setMostrarEletrica}
        quantidadeMotores={form.quantidadeMotores}
        atualizarQuantidadeMotores={form.atualizarQuantidadeMotores}
        motores={form.motores}
        atualizarMotor={form.atualizarMotor}
        calcularDesequilibrio={calcularDesequilibrio}
        parseNumero={form.parseNumero}
      />

      <SectionFiltros
        mostrarPerdaCargaFiltros={form.mostrarPerdaCargaFiltros}
        setMostrarPerdaCargaFiltros={form.setMostrarPerdaCargaFiltros}
        filtros={form.filtros}
        atualizarFiltro={form.atualizarFiltro}
        parseNumero={form.parseNumero}
      />

      <SectionAguaGelada
        mostrarAguaGelada={form.mostrarAguaGelada}
        setMostrarAguaGelada={form.setMostrarAguaGelada}
        aguaGelada={form.aguaGelada}
        atualizarAguaGelada={form.atualizarAguaGelada}
        desvioAguaGelada={form.desvioAguaGelada}
        avaliacaoAguaGelada={form.avaliacaoAguaGelada}
      />

      <SectionObservacoes
        mostrarObservacoesComentarios={form.mostrarObservacoesComentarios}
        setMostrarObservacoesComentarios={form.setMostrarObservacoesComentarios}
        observacoesComentarios={form.observacoesComentarios}
        setObservacoesComentarios={form.setObservacoesComentarios}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </FormScreen>
  );
}
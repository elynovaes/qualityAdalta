import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FormScreen from '../../components/FormScreen';

import SectionAguaGelada from '../../components/startup-uta/SectionAguaGelada';
import SectionCondicoes from '../../components/startup-uta/SectionCondicoes';
import SectionDampers from '../../components/startup-uta/SectionDampers';
import SectionEletrica from '../../components/startup-uta/SectionEletrica';
import SectionFiltros from '../../components/startup-uta/SectionFiltros';
import SectionIdentificacao from '../../components/startup-uta/SectionIdentificacao';
import SectionObservacoes from '../../components/startup-uta/SectionObservacoes';
import SectionVazaoAr from '../../components/startup-uta/SectionVazaoAr';
import baseStyles from '../../components/startup-uta/styles';

import useStartupUTA from '../../hooks/useStartupUta';
import { createStartupUta } from '../../services/startupUtaApi';
import { calcularDesequilibrio } from '../../utils/calcDesequilibrio';
import { gerarPdfStartup } from '../../utils/startupUtaPdf';

export default function StartupUta() {
  const form = useStartupUTA();

  const handleSalvar = async () => {
    try {
      const payload = form.getPayload();

      const registro = {
        os: '',
        client: '',
        system: payload?.identificacao?.sistemaArea || '',
        sector: '',
        equipment: payload?.identificacao?.equipamento || '',
        tecnico: payload?.identificacao?.tecnico || '',
        data_inspecao: payload?.identificacao?.dataInspecao || '',
        payload,
      };

      const salvo = await createStartupUta(registro);

      console.log('Startup UTA salva:', salvo);

      Alert.alert('Sucesso', 'Dados da Startup UTA salvos com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar Startup UTA:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  const handleGerarPdf = async () => {
    try {
      const payload = form.getPayload();

      const uri = await gerarPdfStartup(payload);

      console.log('PDF gerado em:', uri);

      Alert.alert('Sucesso', 'PDF gerado com sucesso.');
    } catch (error) {
      console.error('Erro ao gerar PDF da Startup UTA:', error);
      Alert.alert('Erro', 'Não foi possível gerar o PDF.');
    }
  };

  return (
    <FormScreen>
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressStep}>Anexo técnico</Text>
          <Text style={styles.progressPercent}>Startup UTA</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={styles.progressBarFill} />
        </View>

        <Text style={styles.progressText}>
          Preencha os dados de identificação, medições, critérios e observações
          da unidade de tratamento de ar.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroBadge}>Comissionamento HVAC</Text>
        <Text style={[baseStyles.title, styles.heroTitle]}>
          Startup de Unidade de Tratamento - UTA
        </Text>
        <Text style={styles.heroSubtitle}>
          Formulário técnico para registro das verificações operacionais,
          elétricas, aerodinâmicas, hidráulicas e observações do equipamento.
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryIcon}>📌</Text>
          <Text style={styles.summaryTitle}>Orientação de preenchimento</Text>
        </View>

        <Text style={styles.summaryText}>
          Preencha as seções aplicáveis ao ensaio. Os blocos podem ser exibidos
          ou ocultados conforme a necessidade do equipamento avaliado.
        </Text>

        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            • Revise identificação, instrumentos e técnico responsável antes de
            iniciar as medições.
          </Text>
          <Text style={styles.tipText}>
            • Registre vazão, elétrica, filtros e água gelada somente quando
            aplicáveis ao sistema.
          </Text>
          <Text style={styles.tipText}>
            • Utilize observações para desvios, anomalias e comentários de campo.
          </Text>
        </View>
      </View>

      <View style={styles.sectionWrapper}>
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
      </View>

      <View style={styles.sectionWrapper}>
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
      </View>

      <View style={styles.sectionWrapper}>
        <SectionDampers
          mostrarDampers={form.mostrarDampers}
          setMostrarDampers={form.setMostrarDampers}
          dampers={form.dampers}
          atualizarDamper={form.atualizarDamper}
        />
      </View>

      <View style={styles.sectionWrapper}>
        <SectionCondicoes
          mostrarCondicoesOperacao={form.mostrarCondicoesOperacao}
          setMostrarCondicoesOperacao={form.setMostrarCondicoesOperacao}
          condicoesOperacao={form.condicoesOperacao}
          atualizarCondicaoOperacao={form.atualizarCondicaoOperacao}
          fatorK={form.fatorK}
        />
      </View>

      <View style={styles.sectionWrapper}>
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
      </View>

      <View style={styles.sectionWrapper}>
        <SectionFiltros
          mostrarPerdaCargaFiltros={form.mostrarPerdaCargaFiltros}
          setMostrarPerdaCargaFiltros={form.setMostrarPerdaCargaFiltros}
          filtros={form.filtros}
          atualizarFiltro={form.atualizarFiltro}
          parseNumero={form.parseNumero}
        />
      </View>

      <View style={styles.sectionWrapper}>
        <SectionAguaGelada
          mostrarAguaGelada={form.mostrarAguaGelada}
          setMostrarAguaGelada={form.setMostrarAguaGelada}
          aguaGelada={form.aguaGelada}
          atualizarAguaGelada={form.atualizarAguaGelada}
          desvioAguaGelada={form.desvioAguaGelada}
          avaliacaoAguaGelada={form.avaliacaoAguaGelada}
        />
      </View>

      <View style={styles.sectionWrapper}>
        <SectionObservacoes
          mostrarObservacoesComentarios={form.mostrarObservacoesComentarios}
          setMostrarObservacoesComentarios={form.setMostrarObservacoesComentarios}
          observacoesComentarios={form.observacoesComentarios}
          setObservacoesComentarios={form.setObservacoesComentarios}
        />
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>Finalização</Text>
        <Text style={styles.footerText}>
          Após revisar os campos preenchidos, toque em salvar para preparar os
          dados do formulário Startup UTA.
        </Text>

        <TouchableOpacity
          style={[baseStyles.saveButton, styles.saveButtonEnhanced]}
          onPress={handleSalvar}
          activeOpacity={0.85}
        >
          <Text style={[baseStyles.saveButtonText, styles.saveButtonEnhancedText]}>
            Salvar formulário
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            baseStyles.saveButton,
            styles.saveButtonEnhanced,
            styles.pdfButton,
          ]}
          onPress={handleGerarPdf}
          activeOpacity={0.85}
        >
          <Text style={[baseStyles.saveButtonText, styles.saveButtonEnhancedText]}>
            Gerar PDF
          </Text>
        </TouchableOpacity>
      </View>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStep: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0E5A8A',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0E5A8A',
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0E5A8A',
    borderRadius: 999,
  },
  progressText: {
    marginTop: 10,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  heroCard: {
    backgroundColor: '#EAF4FB',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D3E8F5',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  heroTitle: {
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#4B5563',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0E5A8A',
  },
  summaryText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 21,
    marginBottom: 12,
  },
  tipBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tipText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 6,
  },
  sectionWrapper: {
    marginBottom: 14,
  },
  footerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  footerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0E5A8A',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 21,
    marginBottom: 16,
  },
  saveButtonEnhanced: {
    minHeight: 54,
    justifyContent: 'center',
    borderRadius: 14,
    shadowColor: '#0E5A8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
  },
  saveButtonEnhancedText: {
    fontSize: 16,
    fontWeight: '700',
  },
  pdfButton: {
    marginTop: 12,
  },
});
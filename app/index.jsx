import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddServiceButton from "../components/AddServiceButton";
import NewServiceModal from "../components/NewServiceModal";
import SearchBar from "../components/SearchBar";
import ServiceCard from "../components/ServiceCard";
import useServicos from "../hooks/useServicos";
import { logger } from "../utils/logger";

const SETORES_VALIDOS = ["CO", "AV", "QA", "TAB"];

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [os, setOs] = useState("");
  const [client, setClient] = useState("");
  const [sector, setSector] = useState("");
  const [system, setSystem] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const [errors, setErrors] = useState({});

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("info");

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const {
    servicosFiltrados,
    loading,
    erro,
    busca,
    setBusca,
    salvarServico,
    removerServico,
  } = useServicos();

  const router = useRouter();

  function showFeedback(title, message, type = "info") {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackType(type);
    setFeedbackVisible(true);
  }

  function fecharFeedback() {
    setFeedbackVisible(false);
    setFeedbackTitle("");
    setFeedbackMessage("");
    setFeedbackType("info");
  }

  function limparFormulario() {
    setOs("");
    setClient("");
    setSector("");
    setSystem("");
    setDeliveryDate("");
    setErrors({});
  }

  function fecharModal() {
    limparFormulario();
    setEditingId(null);
    setModalVisible(false);
  }

  function abrirNovoServico() {
    limparFormulario();
    setEditingId(null);
    setModalVisible(true);
  }

  function formatarOs(texto) {
    return (texto || "").replace(/\D/g, "");
  }

  function formatarCliente(texto) {
    return (texto || "").toUpperCase();
  }

  function formatarData(texto) {
    const numeros = (texto || "").replace(/\D/g, "").slice(0, 8);

    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) {
      return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    }
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  }

  function isValidDateBR(date) {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
    if (!regex.test(date)) return false;

    const [day, month, year] = date.split("/").map(Number);
    const data = new Date(year, month - 1, day);

    return (
      data.getFullYear() === year &&
      data.getMonth() === month - 1 &&
      data.getDate() === day
    );
  }

  function validarFormulario() {
    const novosErros = {};

    const osTratado = os.trim();
    const clientTratado = client.trim().toUpperCase();
    const sectorTratado = sector.trim().toUpperCase();
    const systemTratado = system.trim();
    const deliveryDateTratado = deliveryDate.trim();

    if (!osTratado) {
      novosErros.os = "Preencha o número da OS.";
    }

    if (!clientTratado) {
      novosErros.client = "Preencha o cliente.";
    }

    if (!sectorTratado) {
      novosErros.sector = "Selecione o setor.";
    } else if (!SETORES_VALIDOS.includes(sectorTratado)) {
      novosErros.sector = "Setor inválido.";
    }

    if (!systemTratado) {
      novosErros.system = "Preencha o sistema.";
    }

    if (!deliveryDateTratado) {
      novosErros.deliveryDate = "Preencha a data de entrega.";
    } else if (!isValidDateBR(deliveryDateTratado)) {
      novosErros.deliveryDate = "Digite uma data válida no formato dd/mm/aaaa.";
    }

    setErrors(novosErros);

    if (Object.keys(novosErros).length > 0) {
      showFeedback(
        "Atenção",
        "Revise os campos destacados antes de salvar.",
        "warning"
      );
      return false;
    }

    return true;
  }

  async function onSalvarServico() {
    if (!validarFormulario()) return;

    const dados = {
      os: os.trim(),
      client: client.trim().toUpperCase(),
      sector: sector.trim().toUpperCase(),
      system: system.trim(),
      delivery_date: deliveryDate.trim(),
    };

    const estavaEditando = !!editingId;

    try {
      await salvarServico(editingId, dados);
      fecharModal();

      showFeedback(
        "Sucesso",
        estavaEditando
          ? "OS atualizada com sucesso."
          : "OS criada com sucesso.",
        "success"
      );
    } catch (error) {
      logger.error("Erro ao salvar serviço:", error);
      showFeedback(
        "Erro",
        error?.message || "Não foi possível salvar.",
        "error"
      );
    }
  }

  function confirmarRemocaoServico(id) {
    setSelectedDeleteId(id);
    setDeleteVisible(true);
  }

  function fecharDeleteModal() {
    setDeleteVisible(false);
    setSelectedDeleteId(null);
  }

  async function executarRemocaoServico() {
    if (!selectedDeleteId) return;

    try {
      await removerServico(selectedDeleteId);
      fecharDeleteModal();
      showFeedback("Sucesso", "OS excluída com sucesso.", "success");
    } catch (error) {
      logger.error("Erro ao excluir serviço:", error);
      fecharDeleteModal();
      showFeedback(
        "Erro",
        error?.message || "Não foi possível excluir.",
        "error"
      );
    }
  }

  function editarServico(servico) {
    setEditingId(servico.id);
    setOs(servico.os || "");
    setClient((servico.client || "").toUpperCase());
    setSector((servico.sector || "").toUpperCase());
    setSystem(servico.system || "");
    setDeliveryDate(servico.delivery_date || "");
    setErrors({});
    setModalVisible(true);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (erro) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>{erro}</Text>
      </SafeAreaView>
    );
  }

  const feedbackAccentStyle =
    feedbackType === "success"
      ? styles.feedbackAccentSuccess
      : feedbackType === "error"
      ? styles.feedbackAccentError
      : feedbackType === "warning"
      ? styles.feedbackAccentWarning
      : styles.feedbackAccentInfo;

  const feedbackButtonStyle =
    feedbackType === "success"
      ? styles.feedbackButtonSuccess
      : feedbackType === "error"
      ? styles.feedbackButtonError
      : feedbackType === "warning"
      ? styles.feedbackButtonWarning
      : styles.feedbackButtonInfo;

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar value={busca} onChangeText={setBusca} />

      <AddServiceButton onPress={abrirNovoServico} />

      <FlatList
        data={servicosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ServiceCard
            {...item}
            onPress={() =>
              router.push({
                pathname: "/os-relatorios",
                params: {
                  id: item.id,
                  os: item.os,
                  client: item.client,
                  sector: item.sector,
                  system: item.system,
                  delivery_date: item.delivery_date,
                },
              })
            }
            onDelete={() => confirmarRemocaoServico(item.id)}
            onEdit={() => editarServico(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma OS encontrada.</Text>
        }
        contentContainerStyle={
          servicosFiltrados.length === 0 ? styles.emptyContainer : null
        }
      />

      <NewServiceModal
        visible={modalVisible}
        onClose={fecharModal}
        onSave={onSalvarServico}
        os={os}
        setOs={(text) => setOs(formatarOs(text))}
        client={client}
        setClient={(text) => setClient(formatarCliente(text))}
        sector={sector}
        setSector={setSector}
        system={system}
        setSystem={setSystem}
        deliveryDate={deliveryDate}
        setDeliveryDate={(text) => setDeliveryDate(formatarData(text))}
        errors={errors}
      />

      <Modal visible={feedbackVisible} transparent animationType="fade">
        <View style={styles.feedbackOverlay}>
          <View style={styles.feedbackBox}>
            <View style={[styles.feedbackAccent, feedbackAccentStyle]} />
            <Text style={styles.feedbackTitle}>{feedbackTitle}</Text>
            <Text style={styles.feedbackMessage}>{feedbackMessage}</Text>

            <Pressable
              style={[styles.feedbackButton, feedbackButtonStyle]}
              onPress={fecharFeedback}
            >
              <Text style={styles.feedbackButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharDeleteModal}
      >
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteBox}>
            <View style={styles.deleteIconCircle}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </View>

            <Text style={styles.deleteTitle}>Confirmar exclusão</Text>
            <Text style={styles.deleteMessage}>
              Tem certeza que deseja excluir esta OS?
            </Text>

            <View style={styles.deleteButtonRow}>
              <Pressable
                style={styles.deleteCancelButton}
                onPress={fecharDeleteModal}
              >
                <Text style={styles.deleteCancelText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.deleteConfirmButton}
                onPress={executarRemocaoServico}
              >
                <Text style={styles.deleteConfirmText}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f3f5f7",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },

  feedbackOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  feedbackBox: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  feedbackAccent: {
    width: 64,
    height: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  feedbackAccentSuccess: {
    backgroundColor: "#16A34A",
  },
  feedbackAccentError: {
    backgroundColor: "#DC2626",
  },
  feedbackAccentWarning: {
    backgroundColor: "#D97706",
  },
  feedbackAccentInfo: {
    backgroundColor: "#0E5A8A",
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111827",
  },
  feedbackMessage: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  feedbackButton: {
    paddingVertical: 12,
    paddingHorizontal: 34,
    borderRadius: 12,
  },
  feedbackButtonSuccess: {
    backgroundColor: "#16A34A",
  },
  feedbackButtonError: {
    backgroundColor: "#DC2626",
  },
  feedbackButtonWarning: {
    backgroundColor: "#D97706",
  },
  feedbackButtonInfo: {
    backgroundColor: "#0E5A8A",
  },
  feedbackButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  deleteOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  deleteBox: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 10,
  },
  deleteIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  deleteIcon: {
    fontSize: 28,
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
    textAlign: "center",
  },
  deleteMessage: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 22,
  },
  deleteButtonRow: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },
  deleteCancelButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteConfirmButton: {
    flex: 1,
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteCancelText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
  },
  deleteConfirmText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
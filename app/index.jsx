import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddServiceButton from "../components/AddServiceButton";
import NewServiceModal from "../components/NewServiceModal";
import SearchBar from "../components/SearchBar";
import ServiceCard from "../components/ServiceCard";
import useServicos from "../hooks/useServicos";
import { logger } from "../utils/logger";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [os, setOs] = useState("");
  const [client, setClient] = useState("");
  const [sector, setSector] = useState("");
  const [system, setSystem] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
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

  function limparFormulario() {
    setOs("");
    setClient("");
    setSector("");
    setSystem("");
    setDeliveryDate("");
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

  async function onSalvarServico() {
    const dados = {
      os,
      client,
      sector,
      system,
      delivery_date: deliveryDate,
    };

    try {
      await salvarServico(editingId, dados);
      fecharModal();
    } catch (error) {
      logger.error("Erro ao salvar serviço:", error);
      Alert.alert("Erro", error?.message || "Não foi possível salvar.");
    }
  }

  function confirmarRemocaoServico(id) {
    Alert.alert(
      "Excluir serviço",
      "Tem certeza que deseja excluir esta OS?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await removerServico(id);
            } catch (error) {
              logger.error("Erro ao excluir serviço:", error);
              Alert.alert("Erro", error?.message || "Não foi possível excluir.");
            }
          },
        },
      ]
    );
  }

  function editarServico(servico) {
    setEditingId(servico.id);
    setOs(servico.os || "");
    setClient(servico.client || "");
    setSector(servico.sector || "");
    setSystem(servico.system || "");
    setDeliveryDate(servico.delivery_date || "");
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
        setOs={setOs}
        client={client}
        setClient={setClient}
        sector={sector}
        setSector={setSector}
        system={system}
        setSystem={setSystem}
        deliveryDate={deliveryDate}
        setDeliveryDate={setDeliveryDate}
      />
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
});
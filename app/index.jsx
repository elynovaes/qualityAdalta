import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import {
  createServico,
  deleteServico,
  getServicos,
  updateServico,
} from "../services/serviceApi";

export default function Home() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [os, setOs] = useState("");
  const [client, setClient] = useState("");
  const [sector, setSector] = useState("");
  const [system, setSystem] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const router = useRouter();

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      setLoading(true);
      setErro("");

      const dados = await getServicos();
      console.log("Dados recebidos:", dados);

      setServicos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      setErro("Não foi possível carregar os serviços.");
      setServicos([]);
    } finally {
      setLoading(false);
    }
  };

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

  function salvarServico() {
    const dados = {
    os,
    client,
    sector,
    system,
    delivery_date: deliveryDate,
    };

    console.log("Dados enviados:", dados);
    console.log("editingId:", editingId);

    if (editingId) {
      updateServico(editingId, dados)
        .then(async (servicoAtualizado) => {
          console.log("Serviço atualizado:", servicoAtualizado);
          await carregarServicos();
          fecharModal();
        })
        .catch((error) => {
          console.log("Erro ao atualizar serviço:", error);
          Alert.alert("Erro", error?.message || "Não foi possível atualizar.");
        });
    } else {
      createServico(dados)
        .then(async (novoServico) => {
          console.log("Serviço criado:", novoServico);
          await carregarServicos();
          fecharModal();
        })
        .catch((error) => {
          console.log("Erro ao criar serviço:", error);
          Alert.alert("Erro", error?.message || "Não foi possível criar.");
        });
    }
  }

  function removerServico(id) {
    Alert.alert(
      "Excluir serviço",
      "Tem certeza que deseja excluir esta OS?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            deleteServico(id)
              .then(async () => {
                await carregarServicos();
              })
              .catch((error) => {
                console.log("Erro ao excluir serviço:", error);
                Alert.alert("Erro", error?.message || "Não foi possível excluir.");
              });
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

  const texto = (busca || "").toLowerCase();

  const servicosFiltrados = servicos.filter((item) => {
    if (!item) return false;

    const clientTexto = (item.client || "").toLowerCase();
    const osTexto = (item.os || "").toLowerCase();

    return clientTexto.includes(texto) || osTexto.includes(texto);
  });

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
            onDelete={() => removerServico(item.id)}
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
        onSave={salvarServico}
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
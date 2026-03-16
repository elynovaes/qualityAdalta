import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddServiceButton from "../components/AddServiceButton";
import NewServiceModal from "../components/NewServiceModal";
import SearchBar from "../components/SearchBar";
import ServiceCard from "../components/ServiceCard";
import { createServico, deleteServico, getServicos, updateServico } from "../services/serviceApi";

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

  useEffect(() => {
    carregarServicos();
  }, []);

  const router = useRouter();

  function carregarServicos() {
    setLoading(true);

    getServicos()
    .then((response) => {
      setServicos(response.data);
      setErro("");
    })
    .catch(() => {
      setErro("Erro ao carregar serviços.");
    })
    .finally(() => {
      setLoading(false);
    });
  }

  function limparFormulario() {
    setOs("");
    setClient("");
    setSector("");
    setSystem("");
    setDeliveryDate("");
  }

  function fecharModal() {
    limparFormulario();
    setModalVisible(false);
  }

  function salvarServico() {

  const dados = {
    os,
    client,
    sector,
    system,
    delivery_date: deliveryDate,
  };

  if (editingId) {

    updateServico(editingId, dados)
      .then(() => {

        setServicos((prev) =>
          prev.map((item) =>
            item.id === editingId ? { ...item, ...dados } : item
          )
        );

        setEditingId(null);
        fecharModal();

      })
      .catch(() => {
        Alert.alert("Erro", "Não foi possível atualizar.");
      });

  } else {

    createServico(dados)
      .then((response) => {

        setServicos((prev) => [response.data, ...prev]);

        fecharModal();

      })
      .catch(() => {
        Alert.alert("Erro", "Não foi possível criar.");
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
              .then(() => {

                setServicos((prev) =>
                  prev.filter((servico) => servico.id !== id)
                );

              })
              .catch(() => {
                Alert.alert("Erro", "Não foi possível excluir.");
              });

          }
        }
      ]
    );

  }

  function editarServico(servico) {

    setEditingId(servico.id);

    setOs(servico.os);
    setClient(servico.client);
    setSector(servico.sector);
    setSystem(servico.system);
    setDeliveryDate(servico.delivery_date);

    setModalVisible(true);
  }

  const servicosFiltrados = servicos.filter((item) => {
    const texto = busca.toLowerCase();

    return (
      item.client.toLowerCase().includes(texto) ||
      item.os.toLowerCase().includes(texto)
    );
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

      <AddServiceButton onPress={() => setModalVisible(true)} />

      <FlatList
        data={servicosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ServiceCard
            {...item}
            onPress={() =>
              router.push({
                pathname: "/formulario",
                params: {
                  os: item.os,
                  client: item.client,
                  system: item.system
                }
              })
            }
            onDelete={() => removerServico(item.id)}
            onEdit={() => editarServico(item)}
          />
        )}
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
});
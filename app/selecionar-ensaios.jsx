import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ENSAIOS_INICIAIS = [
  {
    id: "1",
    nome: "Start up de Unidades de Tratamento de Ar - UTA",
  },
  {
    id: "2",
    nome: "Inspeção de Operação de UTA",
  },
  {
    id: "3",
    nome: "Start up de Ventiladores e Exaustores",
  },
  {
    id: "4",
    nome: "Inspeção de Operação de Ventiladores e Exaustores",
  },
];

export default function SelecionarEnsaios() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [ensaios, setEnsaios] = useState(ENSAIOS_INICIAIS);
  const [selecionados, setSelecionados] = useState([]);
  const [novoEnsaio, setNovoEnsaio] = useState("");

  const generalData = useMemo(() => {
    try {
      return params.generalData ? JSON.parse(params.generalData) : {};
    } catch {
      return {};
    }
  }, [params.generalData]);

  const selectedReports = useMemo(() => {
    try {
      return params.selectedReports ? JSON.parse(params.selectedReports) : [];
    } catch {
      return [];
    }
  }, [params.selectedReports]);

  const reportCodes = useMemo(() => {
    try {
      return params.reportCodes ? JSON.parse(params.reportCodes) : [];
    } catch {
      return [];
    }
  }, [params.reportCodes]);

  function toggleEnsaio(id) {
    if (selecionados.includes(id)) {
      setSelecionados((prev) => prev.filter((item) => item !== id));
      return;
    }

    setSelecionados((prev) => [...prev, id]);
  }

  function adicionarNovoEnsaio() {
    const nomeLimpo = novoEnsaio.trim();

    if (!nomeLimpo) {
      Alert.alert("Atenção", "Digite o nome do novo ensaio.");
      return;
    }

    const jaExiste = ensaios.some(
      (item) => item.nome.toLowerCase() === nomeLimpo.toLowerCase()
    );

    if (jaExiste) {
      Alert.alert("Atenção", "Esse ensaio já está na lista.");
      return;
    }

    const novoItem = {
      id: Date.now().toString(),
      nome: nomeLimpo,
    };

    setEnsaios((prev) => [...prev, novoItem]);
    setNovoEnsaio("");
  }

  function avancar() {
    const ensaiosSelecionados = ensaios.filter((item) =>
      selecionados.includes(item.id)
    );

    if (ensaiosSelecionados.length === 0) {
      Alert.alert("Atenção", "Selecione pelo menos um ensaio.");
      return;
    }

    router.push({
      pathname: "/formulario-oq",
      params: {
        ...params,
        selectedReports: JSON.stringify(selectedReports),
        generalData: JSON.stringify(generalData),
        reportCodes: JSON.stringify(reportCodes),
        selectedTests: JSON.stringify(ensaiosSelecionados),
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Escolha os ensaios</Text>

        <Text style={styles.subtitle}>OS {params.os}</Text>
        <Text style={styles.subInfo}>{params.client}</Text>
        <Text style={styles.subInfo}>{params.system}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Relatórios selecionados</Text>

          {selectedReports.length > 0 ? (
            selectedReports.map((item, index) => (
              <Text key={index} style={styles.infoItem}>
                • {item.title}
              </Text>
            ))
          ) : (
            <Text style={styles.infoItem}>Nenhum relatório encontrado.</Text>
          )}
        </View>

        <View style={styles.listBox}>
          {ensaios.map((item) => {
            const ativo = selecionados.includes(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, ativo && styles.cardActive]}
                onPress={() => toggleEnsaio(item.id)}
              >
                <View style={[styles.checkbox, ativo && styles.checkboxActive]}>
                  {ativo ? <Text style={styles.checkText}>✓</Text> : null}
                </View>

                <Text style={[styles.cardText, ativo && styles.cardTextActive]}>
                  {item.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.addBox}>
          <Text style={styles.addTitle}>Adicionar novo ensaio</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite o nome do novo ensaio"
            value={novoEnsaio}
            onChangeText={setNovoEnsaio}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={adicionarNovoEnsaio}
          >
            <Text style={styles.buttonText}>Adicionar ensaio</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={avancar}>
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f5f7",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  subInfo: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 2,
  },
  infoBox: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111827",
  },
  infoItem: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  listBox: {
    marginTop: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  cardActive: {
    backgroundColor: "#e8f1ff",
    borderColor: "#2563eb",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#9ca3af",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  checkboxActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  checkText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  cardText: {
    flex: 1,
    fontSize: 15,
    color: "#1f2937",
  },
  cardTextActive: {
    color: "#1d4ed8",
    fontWeight: "600",
  },
  addBox: {
    marginTop: 24,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  addTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  addButton: {
    marginTop: 12,
    backgroundColor: "#16a34a",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  nextButton: {
    marginTop: 24,
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
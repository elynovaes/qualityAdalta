import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SelecionarAnexo() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const anexos = [
    {
      id: 'startup_uta',
      titulo: 'Startup de Unidade de Tratamento - UTA',
      rota: '/anexos/startup-uta',
    },
  ];

  const abrirAnexo = (anexo) => {
    router.push({
      pathname: anexo.rota,
      params: {
        ...params,
        anexoId: anexo.id,
        anexoTitulo: anexo.titulo,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecionar Anexo</Text>
      <Text style={styles.subtitle}>
        Escolha um anexo para abrir a tela de preenchimento.
      </Text>

      <ScrollView contentContainerStyle={styles.lista}>
        {anexos.map((anexo) => (
          <TouchableOpacity
            key={anexo.id}
            style={styles.card}
            onPress={() => abrirAnexo(anexo)}
          >
            <Text style={styles.cardTitle}>{anexo.titulo}</Text>
            <Text style={styles.cardDescription}>
              Toque para preencher os dados deste anexo.
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: '#D9DEE8',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
});
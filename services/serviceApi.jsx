import axios from "axios";

const API_URL = "https://api-servicos.onrender.com/servicos";

export function getServicos() {
  return axios.get(API_URL);
}

export function createServico(novoServico) {
  return axios.post(API_URL, novoServico);
}

export function deleteServico(id) {
  return axios.delete(`${API_URL}/${id}`);
}

export function updateServico(id, servicoAtualizado) {
  return axios.put(`${API_URL}/${id}`, servicoAtualizado);
}
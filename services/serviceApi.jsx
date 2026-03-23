/* import axios from "axios";

const API_URL = "http://192.168.1.7:3001/servicos";
// const API_URL = "https://api-servicos.onrender.com/servicos";


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
} */

const SUPABASE_URL = 'https://pkddscxgogkwuulziylk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZGRzY3hnb2drd3V1bHppeWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjgxMDgsImV4cCI6MjA4OTgwNDEwOH0.zDXJ-8wSJQ7CUCZPEUYg44pmvwXfGx8B1Vitj7DMt4o';

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

export async function getServicos() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/servicos?select=*`, {
    headers,
  });

  const data = await response.json();

  console.log('Status:', response.status);
  console.log('Resposta Supabase:', data);

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}
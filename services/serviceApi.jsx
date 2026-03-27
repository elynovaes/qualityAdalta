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

import { getSupabaseConfigOrThrow } from '../constants/env';
import { logger } from '../utils/logger';

const { supabaseUrl, supabaseAnonKey } = getSupabaseConfigOrThrow();

const headers = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
};

export async function getServicos() {
  const response = await fetch(`${supabaseUrl}/rest/v1/servicos?select=*`, {
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

export async function createServico(novoServico) {
  const response = await fetch(`${supabaseUrl}/rest/v1/servicos`, {
    method: 'POST',
    headers: {
      ...headers,
      Prefer: 'return=representation',
    },
    body: JSON.stringify([novoServico]),
  });

  const data = await response.json();

  logger.info('STATUS createServico:', response.status);
  logger.info('DATA createServico:', data);
  logger.info('NOVO SERVIÇO ENVIADO:', novoServico);

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return Array.isArray(data) ? data[0] : data;
}

export async function updateServico(id, osAtualizada) {
  const response = await fetch(`${supabaseUrl}/rest/v1/servicos?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(osAtualizada),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data[0];
}

export async function deleteServico(id) {
  const response = await fetch(`${supabaseUrl}/rest/v1/servicos?id=eq.${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(JSON.stringify(data));
  }

  return true;
}
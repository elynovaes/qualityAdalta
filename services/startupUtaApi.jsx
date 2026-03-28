import { getSupabaseConfigOrThrow } from '../constants/env';

const { supabaseUrl, supabaseAnonKey } = getSupabaseConfigOrThrow();

const headers = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
};

export async function createStartupUta(novoStartup) {
  const response = await fetch(`${supabaseUrl}/rest/v1/startup_uta`, {
    method: 'POST',
    headers: {
      ...headers,
      Prefer: 'return=representation',
    },
    body: JSON.stringify([novoStartup]),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return Array.isArray(data) ? data[0] : data;
}
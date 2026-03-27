const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseConfigOrThrow() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Configuração Supabase ausente. Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}
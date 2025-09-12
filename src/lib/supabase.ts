import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase:', {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Configurada' : 'Não configurada'
  })
  throw new Error('Variáveis de ambiente do Supabase não configuradas. Verifique o arquivo .env')
}

console.log('Configuração Supabase:', {
  url: supabaseUrl,
  key: supabaseAnonKey ? 'Configurada' : 'Não configurada'
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Testar conexão e verificar se as tabelas existem
console.log('Testando conexão com Supabase...')

supabase.from('usuarios').select('*').limit(1).then(({ data, error }) => {
  if (error) {
    console.error('Erro ao conectar com Supabase ou tabela usuarios não existe:', error)
    console.log('Você precisa executar as migrações no painel do Supabase')
  } else {
    console.log('Conexão com Supabase estabelecida com sucesso!')
    console.log('Usuários encontrados:', data)
  }
})

// Tipos para o banco de dados
export interface Usuario {
  id: string
  username: string
  senha: string
  nome: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Transacao {
  id: string
  codigo?: string
  usuario_id: string
  plataforma: string
  valor: number
  data_transacao: string
  status: 'aguardando' | 'sacado' | 'falhou'
  observacoes?: string
  created_at: string
  updated_at: string
  usuarios?: Usuario
}
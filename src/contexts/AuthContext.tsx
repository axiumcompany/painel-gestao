import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase, Usuario } from '../lib/supabase'

interface AuthContextType {
  user: Usuario | null
  login: (username: string, senha: string) => Promise<{ success: boolean; error?: string; user?: Usuario }>
  logout: () => Promise<void>
  loading: boolean
  isAdmin: boolean
  viewingAs: Usuario | null
  accessAs: (user: Usuario) => void
  returnToAdmin: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null)
  const [viewingAs, setViewingAs] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há sessão salva
    const savedUser = localStorage.getItem('user_session')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem('user_session')
      }
    }
    setLoading(false)
  }, [])

  const login = async (username: string, senha: string) => {
    try {
      setLoading(true)
      
      console.log('=== TENTATIVA DE LOGIN ===')
      console.log('Username:', username)
      console.log('Senha:', senha)
      
      // Buscar usuário pelo username
      const { data: usuario, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('username', username)
        .single()

      console.log('=== RESULTADO DA CONSULTA ===')
      console.log('Usuário encontrado:', usuario)
      console.log('Erro da consulta:', userError)

      if (userError || !usuario) {
        console.error('ERRO: Usuário não encontrado ou erro na consulta:', userError)
        return { success: false, error: `Usuário não encontrado: ${userError?.message || 'Usuário inexistente'}` }
      }

      // Comparação simples da senha (em produção usar bcrypt)
      if (usuario.senha !== senha) {
        console.log('ERRO: Senha incorreta')
        console.log('Senha esperada:', usuario.senha)
        console.log('Senha recebida:', senha)
        return { success: false, error: 'Senha incorreta' }
      }

      // Salvar sessão
      setUser(usuario)
      localStorage.setItem('user_session', JSON.stringify(usuario))
      
      console.log('=== LOGIN REALIZADO COM SUCESSO ===')
      console.log('Usuário logado:', usuario)
      return { success: true, user: usuario }
    } catch (error) {
      console.error('=== ERRO CRÍTICO NO LOGIN ===', error)
      return { success: false, error: 'Erro interno do sistema' }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setUser(null)
    setViewingAs(null)
    localStorage.removeItem('user_session')
  }

  const accessAs = (targetUser: Usuario) => {
    if (user?.is_admin) {
      setViewingAs(targetUser)
    }
  }

  const returnToAdmin = () => {
    setViewingAs(null)
  }

  const isAdmin = user?.is_admin === true && !viewingAs

  const value: AuthContextType = {
    user: viewingAs || user,
    login,
    logout,
    loading,
    isAdmin,
    viewingAs,
    accessAs,
    returnToAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
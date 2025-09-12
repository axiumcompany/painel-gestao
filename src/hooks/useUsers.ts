import { useState, useEffect } from 'react'
import { supabase, Usuario } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useUsers = () => {
  const [users, setUsers] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchUsers = async () => {
    if (!user?.is_admin) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setUsers(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar usuários:', err)
    } finally {
      setLoading(false)
    }
  }

  const addUser = async (userData: {
    username: string
    senha: string
    nome: string
    is_admin: boolean
  }) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .insert([userData])

      if (error) {
        throw error
      }

      await fetchUsers()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const updateUser = async (id: string, updates: Partial<Usuario>) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ 
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        throw error
      }

      await fetchUsers()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      await fetchUsers()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [user])

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers
  }
}
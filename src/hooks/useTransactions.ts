import { useState, useEffect } from 'react'
import { supabase, Transacao } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchTransactions = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      let query = supabase.from('transacoes').select(`
        *,
        usuarios (id, nome, username, is_admin)
      `)

      // Se não for admin, buscar apenas transações do usuário
      if (!user.is_admin) {
        query = query.eq('usuario_id', user.id)
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setTransactions(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar transações:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTransaction = async (transactionData: {
    codigo: string
    plataforma: string
    valor: number
    data_transacao: string
    status?: 'aguardando' | 'sacado' | 'falhou'
    observacoes?: string
  }) => {
    try {
      // Verificar se o código já existe
      const { data: existingTransaction } = await supabase
        .from('transacoes')
        .select('id')
        .eq('codigo', transactionData.codigo)
        .single()

      if (existingTransaction) {
        return { success: false, error: 'Código de transação já existe' }
      }

      const { error } = await supabase
        .from('transacoes')
        .insert([{
          codigo: transactionData.codigo,
          plataforma: transactionData.plataforma,
          valor: transactionData.valor,
          data_transacao: transactionData.data_transacao,
          status: transactionData.status || 'aguardando',
          observacoes: transactionData.observacoes || null,
          usuario_id: user?.id,
        }])

      if (error) {
        throw error
      }

      await fetchTransactions()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const updateTransaction = async (id: string, updates: Partial<Transacao>) => {
    try {
      const { error } = await supabase
        .from('transacoes')
        .update({ 
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        throw error
      }

      await fetchTransactions()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transacoes')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      await fetchTransactions()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const getStats = () => {
    const total = transactions.reduce((sum, t) => sum + t.valor, 0)
    const pending = transactions.filter(t => t.status === 'aguardando').length
    const completed = transactions.filter(t => t.status === 'sacado').length
    const failed = transactions.filter(t => t.status === 'falhou').length
    const successRate = transactions.length > 0 ? (completed / transactions.length) * 100 : 0

    return {
      total,
      pending,
      completed,
      failed,
      successRate,
      count: transactions.length
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [user])

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getStats,
    refetch: fetchTransactions
  }
}
import React, { useState } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import { StatsCards } from './StatsCards'
import { TotalSection } from './TotalSection'
import { TransactionTable } from './TransactionTable'
import { TransactionModal } from './TransactionModal'
import { Transacao } from '../../lib/supabase'

export const Dashboard: React.FC = () => {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction, getStats } = useTransactions()
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: 'add' | 'edit' | 'view'
    transaction: Transacao | null
  }>({
    isOpen: false,
    mode: 'add',
    transaction: null
  })

  const stats = getStats()

  const handleOpenModal = (mode: 'add' | 'edit' | 'view', transaction: Transacao | null = null) => {
    setModalState({ isOpen: true, mode, transaction })
  }

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: 'add', transaction: null })
  }

  const handleSubmitTransaction = async (transactionData: any) => {
    let result
    
    if (modalState.mode === 'add') {
      result = await addTransaction(transactionData)
    } else if (modalState.mode === 'edit' && modalState.transaction) {
      result = await updateTransaction(modalState.transaction.id, transactionData)
    }

    if (result && !result.success) {
      alert('Erro ao salvar transação: ' + result.error)
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
      const result = await deleteTransaction(id)
      if (!result.success) {
        alert('Erro ao deletar transação: ' + result.error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-white"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <TotalSection total={stats.total} transactionCount={stats.count} transactions={transactions} />
      <StatsCards stats={stats} />
      <TransactionTable
        transactions={transactions}
        onAdd={() => handleOpenModal('add')}
        onEdit={(transaction) => handleOpenModal('edit', transaction)}
        onView={(transaction) => handleOpenModal('view', transaction)}
        onDelete={handleDeleteTransaction}
      />
      
      <TransactionModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTransaction}
        transaction={modalState.transaction}
        mode={modalState.mode}
      />
    </div>
  )
}
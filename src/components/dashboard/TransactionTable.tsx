import React, { useState, useMemo } from 'react'
import { Edit, Trash2, Eye, Plus, Search } from 'lucide-react'
import { Transacao } from '../../lib/supabase'
import { formatCurrency } from '../../utils/formatters'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { useAuth } from '../../contexts/AuthContext'

interface TransactionTableProps {
  transactions: Transacao[]
  onEdit: (transaction: Transacao) => void
  onDelete: (id: string) => void
  onView: (transaction: Transacao) => void
  onAdd: () => void
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  onView,
  onAdd
}) => {
  const { isAdmin } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [plataformaFilter, setPlataformaFilter] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transacao
    direction: 'asc' | 'desc'
  } | null>(null)

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.plataforma.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !statusFilter || transaction.status === statusFilter
      const matchesPlataforma = !plataformaFilter || transaction.plataforma === plataformaFilter
      
      return matchesSearch && matchesStatus && matchesPlataforma
    })

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [transactions, searchTerm, statusFilter, plataformaFilter, sortConfig])

  const handleSort = (key: keyof Transacao) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getStatusBadge = (status: Transacao['status']) => {
    const styles = {
      aguardando: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      sacado: 'bg-green-500/20 text-green-400 border-green-500/30',
      falhou: 'bg-red-500/20 text-red-400 border-red-500/30'
    }

    const labels = {
      aguardando: 'Aguardando',
      sacado: 'Sacado',
      falhou: 'Falhou'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]} capitalize`}>
        {labels[status]}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Transações</h2>
        <Button onClick={onAdd} icon={Plus}>
          <span className="hidden sm:inline">Nova Transação</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-800/30 backdrop-filter backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10">
        <div className="flex-1">
          <Input
            placeholder="Buscar por plataforma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-white/10 rounded-lg sm:rounded-xl text-white focus:border-white/30 focus:outline-none text-sm"
        >
          <option value="">Todos os status</option>
          <option value="aguardando">Aguardando</option>
          <option value="sacado">Sacado</option>
          <option value="falhou">Falhou</option>
        </select>
        
        <select
          value={plataformaFilter}
          onChange={(e) => setPlataformaFilter(e.target.value)}
          className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-white/10 rounded-lg sm:rounded-xl text-white focus:border-white/30 focus:outline-none text-sm"
        >
          <option value="">Todas as plataformas</option>
          <option value="96B">96B</option>
          <option value="K85">K85</option>
          <option value="56F">56F</option>
          <option value="65K">65K</option>
          <option value="78TT">78TT</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900/60 backdrop-filter backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('created_at')}
                >
                  Código
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('plataforma')}
                >
                  Plataforma
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('valor')}
                >
                  Valor
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('data_transacao')}
                >
                  Data
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                {isAdmin && (
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Usuário
                  </th>
                )}
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredAndSortedTransactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className="text-blue-400 font-mono text-xs sm:text-sm">{transaction.codigo}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className="text-white font-medium text-sm">{transaction.plataforma}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className="text-green-400 font-semibold text-xs sm:text-sm">
                      {formatCurrency(transaction.valor)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className="text-gray-300 text-xs sm:text-sm">{formatDate(transaction.data_transacao)}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  {isAdmin && (
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className="text-gray-300 text-sm">
                        {transaction.usuarios?.nome} (@{transaction.usuarios?.username})
                      </span>
                    </td>
                  )}
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex space-x-1 sm:space-x-2">
                      <button
                        onClick={() => onView(transaction)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-400/10"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-yellow-400 transition-colors rounded-lg hover:bg-yellow-400/10"
                      >
                        <Edit size={14} />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => onDelete(transaction.id)}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedTransactions.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400">Nenhuma transação encontrada</p>
          </div>
        )}
      </div>
    </div>
  )
}
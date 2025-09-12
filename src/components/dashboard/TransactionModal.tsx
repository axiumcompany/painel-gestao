import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Transacao } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (transaction: any) => void
  transaction?: Transacao | null
  mode: 'add' | 'edit' | 'view'
}

const PLATAFORMAS = ['96B', 'K85', '56F', '65K', '78TT']

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  mode
}) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    codigo: '',
    plataforma: '',
    valor: '',
    data_transacao: new Date().toISOString().split('T')[0],
    status: 'aguardando' as 'aguardando' | 'sacado' | 'falhou',
    observacoes: ''
  })

  useEffect(() => {
    if (transaction && (mode === 'edit' || mode === 'view')) {
      setFormData({
        codigo: transaction.codigo || '',
        plataforma: transaction.plataforma,
        valor: transaction.valor.toString(),
        data_transacao: transaction.data_transacao,
        status: transaction.status,
        observacoes: transaction.observacoes || ''
      })
    } else {
      setFormData({
        codigo: '',
        plataforma: '',
        valor: '',
        data_transacao: new Date().toISOString().split('T')[0],
        status: 'aguardando',
        observacoes: ''
      })
    }
  }, [transaction, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.codigo || !formData.plataforma || !formData.valor || !formData.data_transacao) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    onSubmit({
      codigo: formData.codigo,
      plataforma: formData.plataforma,
      valor: parseFloat(formData.valor),
      data_transacao: formData.data_transacao,
      status: formData.status,
      observacoes: formData.observacoes || null
    })
    onClose()
  }

  const isReadonly = mode === 'view'
  const title = mode === 'add' ? 'Nova Transação' : mode === 'edit' ? 'Editar Transação' : 'Visualizar Transação'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Código da Transação"
            value={formData.codigo}
            onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
            placeholder="Ex: TRX001"
            disabled={isReadonly}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Plataforma
            </label>
            <select
              value={formData.plataforma}
              onChange={(e) => setFormData({ ...formData, plataforma: e.target.value })}
              disabled={isReadonly}
              className="w-full px-5 py-4 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-300"
            >
              <option value="">Selecione uma plataforma</option>
              {PLATAFORMAS.map(plat => (
                <option key={plat} value={plat}>{plat}</option>
              ))}
            </select>
          </div>
          
          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            placeholder="0,00"
            disabled={isReadonly}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Data da Transação"
            type="date"
            value={formData.data_transacao}
            onChange={(e) => setFormData({ ...formData, data_transacao: e.target.value })}
            disabled={isReadonly}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              disabled={isReadonly || !user?.is_admin}
              className="w-full px-5 py-4 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-300"
            >
              <option value="aguardando">Aguardando Saque</option>
              <option value="sacado">Sacado</option>
              <option value="falhou">Falhou</option>
            </select>
          </div>
        </div>

        {user?.is_admin && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              disabled={isReadonly}
              rows={3}
              className="w-full px-5 py-4 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-300"
              placeholder="Observações sobre a transação..."
            />
          </div>
        )}

        {!isReadonly && (
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              {mode === 'add' ? 'Criar' : 'Atualizar'}
            </Button>
          </div>
        )}
      </form>
    </Modal>
  )
}
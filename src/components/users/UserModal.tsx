import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Usuario } from '../../lib/supabase'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (user: any) => void
  user?: Usuario | null
  mode: 'add' | 'edit'
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  mode
}) => {
  const [formData, setFormData] = useState({
    username: '',
    senha: '',
    nome: '',
    is_admin: false
  })

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        username: user.username,
        senha: user.senha,
        nome: user.nome,
        is_admin: user.is_admin
      })
    } else {
      setFormData({
        username: '',
        senha: '',
        nome: '',
        is_admin: false
      })
    }
  }, [user, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.username || !formData.senha || !formData.nome) return

    onSubmit(formData)
    onClose()
  }

  const title = mode === 'add' ? 'Novo Usuário' : 'Editar Usuário'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nome Completo"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Digite o nome completo"
          />
          
          <Input
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Digite o username"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Senha"
            type="password"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            placeholder="Digite a senha"
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Tipo de Usuário
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="is_admin"
                  checked={!formData.is_admin}
                  onChange={() => setFormData({ ...formData, is_admin: false })}
                  className="w-4 h-4 text-white"
                />
                <span className="text-gray-300">Usuário</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="is_admin"
                  checked={formData.is_admin}
                  onChange={() => setFormData({ ...formData, is_admin: true })}
                  className="w-4 h-4 text-white"
                />
                <span className="text-gray-300">Administrador</span>
              </label>
            </div>
          </div>
        </div>

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
      </form>
    </Modal>
  )
}
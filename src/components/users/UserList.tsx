import React from 'react'
import { Edit, Trash2, Plus, Eye, Shield, User as UserIcon } from 'lucide-react'
import { Usuario } from '../../lib/supabase'
import { Button } from '../common/Button'
import { useAuth } from '../../contexts/AuthContext'
import { useUsers } from '../../hooks/useUsers'

interface UserListProps {
  onEdit: (user: Usuario) => void
  onAdd: () => void
}

export const UserList: React.FC<UserListProps> = ({ onEdit, onAdd }) => {
  const { users, loading, deleteUser } = useUsers()
  const { accessAs, user: currentUser } = useAuth()

  const handleDelete = async (id: string) => {
    if (currentUser?.id === id) {
      alert('Você não pode deletar sua própria conta')
      return
    }
    
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      const result = await deleteUser(id)
      if (!result.success) {
        alert('Erro ao deletar usuário: ' + result.error)
      }
    }
  }

  const handleAccessAs = (user: Usuario) => {
    if (confirm(`Deseja acessar como ${user.nome}?`)) {
      accessAs(user)
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR') + ' ' + 
           new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Usuários</h2>
        <Button onClick={onAdd} icon={Plus}>
          <span className="hidden sm:inline">Novo Usuário</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-gray-900/60 backdrop-filter backdrop-blur-2xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            {/* Avatar */}
            <div className="flex items-center mb-3 sm:mb-4">
              <div className={`
                p-2 sm:p-3 rounded-lg sm:rounded-xl mr-3 sm:mr-4
                ${user.is_admin 
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-600'
                }
              `}>
                {user.is_admin ? (
                  <Shield className="text-white" size={24} />
                ) : (
                  <UserIcon className="text-white" size={24} />
                )}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">{user.nome}</h3>
                <p className="text-xs sm:text-sm text-gray-400">@{user.username}</p>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-3 sm:mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-400">Função:</span>
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${user.is_admin 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }
                `}>
                  {user.is_admin ? 'Administrador' : 'Usuário'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-400">Criado:</span>
                <span className="text-xs sm:text-sm text-gray-300">
                  {formatDateTime(user.created_at)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => handleAccessAs(user)}
                className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-xs sm:text-sm font-medium"
                title="Acessar como"
              >
                <Eye size={14} className="mx-auto" />
              </button>
              <button
                onClick={() => onEdit(user)}
                className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-xs sm:text-sm font-medium"
                title="Editar"
              >
                <Edit size={14} className="mx-auto" />
              </button>
              {user.id !== currentUser?.id && (
                <button
                  onClick={() => handleDelete(user.id)}
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-xs sm:text-sm font-medium"
                  title="Deletar"
                >
                  <Trash2 size={14} className="mx-auto" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
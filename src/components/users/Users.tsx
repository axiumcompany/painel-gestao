import React, { useState } from 'react'
import { UserList } from './UserList'
import { UserModal } from './UserModal'
import { Usuario } from '../../lib/supabase'
import { useUsers } from '../../hooks/useUsers'

export const Users: React.FC = () => {
  const { addUser, updateUser } = useUsers()
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: 'add' | 'edit'
    user: Usuario | null
  }>({
    isOpen: false,
    mode: 'add',
    user: null
  })

  const handleOpenModal = (mode: 'add' | 'edit', user: Usuario | null = null) => {
    setModalState({ isOpen: true, mode, user })
  }

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: 'add', user: null })
  }

  const handleSubmitUser = async (userData: any) => {
    let result
    
    if (modalState.mode === 'add') {
      result = await addUser(userData)
    } else if (modalState.mode === 'edit' && modalState.user) {
      result = await updateUser(modalState.user.id, userData)
    }

    if (result && !result.success) {
      alert('Erro ao salvar usuário: ' + result.error)
    }
  }

  return (
    <div>
      <UserList
        onAdd={() => handleOpenModal('add')}
        onEdit={(user) => handleOpenModal('edit', user)}
      />
      
      <UserModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitUser}
        user={modalState.user}
        mode={modalState.mode}
      />
    </div>
  )
}
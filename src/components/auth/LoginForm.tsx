import React, { useState } from 'react'
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../common/Button'
import { Input } from '../common/Input'

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await login(username, password)
      if (!result.success) {
        setError(result.error || 'Erro ao fazer login')
      }
    } catch (error) {
      setError('Erro interno do sistema')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-72 h-32 sm:h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative w-full max-w-sm sm:max-w-md z-10">
        {/* Main Card */}
        <div className="bg-gray-900/60 backdrop-filter backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-white to-gray-200 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
              <User className="text-black" size={20} />
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-white tracking-wider uppercase mb-2">
              Sistema Premium
            </h1>
            <p className="text-sm sm:text-base text-gray-400">Acesse sua conta</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Input
              label="Username"
              type="text"
              placeholder="Digite seu username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={User}
              disabled={isLoading}
            />
            
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-300">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-gray-800/50 border border-white/10 rounded-lg sm:rounded-xl text-white text-sm sm:text-base placeholder-gray-400 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl">
                <p className="text-red-400 text-xs sm:text-sm text-center">{error}</p>
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isLoading}
              icon={LogIn}
              size="md"
              className="w-full"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Transacao } from '../../lib/supabase';

interface TotalSectionProps {
  total: number;
  transactionCount: number;
  transactions: Transacao[];
}

export const TotalSection: React.FC<TotalSectionProps> = ({ total, transactionCount, transactions }) => {
  // Calcular valores reais baseados nos status das transações
  const completedTotal = transactions
    .filter(t => t.status === 'sacado')
    .reduce((sum, t) => sum + t.valor, 0);
    
  const pendingTotal = transactions
    .filter(t => t.status === 'aguardando')
    .reduce((sum, t) => sum + t.valor, 0);
    
  const failedTotal = transactions
    .filter(t => t.status === 'falhou')
    .reduce((sum, t) => sum + t.valor, 0);

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-filter backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute top-0 right-0 w-20 sm:w-40 h-20 sm:h-40 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div className="w-full sm:w-auto">
              <h2 className="text-sm sm:text-lg font-medium text-gray-400 uppercase tracking-wider mb-2">
                Total Geral do Sistema
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  {formatCurrency(total)}
                </span>
                <div className="flex items-center text-green-400">
                  <TrendingUp size={16} className="mr-1" />
                  <span className="text-xs sm:text-sm font-medium">+12.5%</span>
                </div>
              </div>
            </div>
            
            <div className="text-left sm:text-right w-full sm:w-auto">
              <div className="flex items-center text-gray-400 mb-1 sm:mb-2 justify-start sm:justify-end">
                <BarChart3 size={16} className="mr-2" />
                <span className="text-xs sm:text-sm uppercase tracking-wider">Transações</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">
                {transactionCount}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 sm:pt-6 border-t border-white/10">
            <div className="text-center">
              <div className="text-sm sm:text-xl lg:text-2xl font-bold text-green-400 mb-1">
                {formatCurrency(completedTotal)}
              </div>
              <div className="text-xs sm:text-xs text-gray-400 uppercase tracking-wider">
                Sacado
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm sm:text-xl lg:text-2xl font-bold text-yellow-400 mb-1">
                {formatCurrency(pendingTotal)}
              </div>
              <div className="text-xs sm:text-xs text-gray-400 uppercase tracking-wider">
                Aguardando
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm sm:text-xl lg:text-2xl font-bold text-red-400 mb-1">
                {formatCurrency(failedTotal)}
              </div>
              <div className="text-xs sm:text-xs text-gray-400 uppercase tracking-wider">
                Falhou
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
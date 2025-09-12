import { User, Transaction } from '../types';

const USERS_KEY = 'financial_users';
const TRANSACTIONS_KEY = 'financial_transactions';
const AUTH_KEY = 'financial_auth';

// Usuários iniciais
export const INITIAL_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: '205874',
    role: 'admin',
    name: 'Administrador',
    createdAt: Date.now()
  }
];

// Transações iniciais baseadas na planilha
export const SEED_TRANSACTIONS: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  { codigo: 'TRX001', plataforma: 'K85', valor: 1500.00, data: '15/01/2024', status: 'concluido' },
  { codigo: 'TRX002', plataforma: '78TT', valor: 2300.50, data: '16/01/2024', status: 'aguardando' },
  { codigo: 'TRX003', plataforma: '96B', valor: 850.75, data: '17/01/2024', status: 'concluido' },
  { codigo: 'TRX004', plataforma: 'K85', valor: 3200.00, data: '18/01/2024', status: 'falhou' },
  { codigo: 'TRX005', plataforma: '78TT', valor: 1850.25, data: '19/01/2024', status: 'concluido' },
  { codigo: 'TRX006', plataforma: '96B', valor: 975.50, data: '20/01/2024', status: 'aguardando' },
  { codigo: 'TRX007', plataforma: 'K85', valor: 4500.00, data: '21/01/2024', status: 'concluido' },
  { codigo: 'TRX008', plataforma: '78TT', valor: 1250.75, data: '22/01/2024', status: 'aguardando' },
];

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(users);
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getTransactions = (): Transaction[] => {
  const transactions = localStorage.getItem(TRANSACTIONS_KEY);
  if (!transactions) {
    const initialTransactions: Transaction[] = SEED_TRANSACTIONS.map((t, index) => ({
      ...t,
      id: (index + 1).toString(),
      userId: '1', // Admin user
      createdAt: Date.now() - (SEED_TRANSACTIONS.length - index) * 86400000, // Spread over days
      updatedAt: Date.now() - (SEED_TRANSACTIONS.length - index) * 86400000,
    }));
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(initialTransactions));
    return initialTransactions;
  }
  return JSON.parse(transactions);
};

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_KEY);
};
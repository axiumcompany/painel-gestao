export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  codigo: string;
  plataforma: string;
  valor: number;
  data: string; // DD/MM/YYYY
  status: 'aguardando' | 'concluido' | 'falhou';
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  viewingAs: User | null;
  accessAs: (user: User) => void;
  returnToAdmin: () => void;
}
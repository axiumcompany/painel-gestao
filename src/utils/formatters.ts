export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: string): string => {
  return date;
};

export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('pt-BR') + ' ' + 
         new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export const generateTransactionId = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return 'TRX' + timestamp + random;
};

export const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};
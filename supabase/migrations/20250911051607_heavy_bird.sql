/*
  # Insert sample transaction data

  1. Sample Data
    - Insert sample transactions for the admin user
    - Various platforms and statuses for demonstration
    - Realistic values and dates

  2. Notes
    - All transactions are assigned to the admin user initially
    - Dates are spread over recent months for variety
*/

-- Insert sample transactions (assuming admin user exists)
INSERT INTO transacoes (usuario_id, plataforma, valor, data_transacao, status, observacoes) 
SELECT 
  u.id,
  plataforma,
  valor,
  data_transacao::date,
  status::transaction_status,
  observacoes
FROM usuarios u, (
  VALUES 
    ('K85', 1500.00, '2024-01-15', 'sacado', 'Transação processada com sucesso'),
    ('78TT', 2300.50, '2024-01-16', 'aguardando', null),
    ('96B', 850.75, '2024-01-17', 'sacado', 'Saque realizado'),
    ('K85', 3200.00, '2024-01-18', 'falhou', 'Erro no processamento'),
    ('78TT', 1850.25, '2024-01-19', 'sacado', null),
    ('96B', 975.50, '2024-01-20', 'aguardando', null),
    ('K85', 4500.00, '2024-01-21', 'sacado', 'Transação de alto valor'),
    ('78TT', 1250.75, '2024-01-22', 'aguardando', null),
    ('56F', 2100.00, '2024-01-23', 'sacado', null),
    ('65K', 1750.25, '2024-01-24', 'falhou', 'Falha na comunicação'),
    ('96B', 3300.50, '2024-01-25', 'aguardando', null),
    ('K85', 2800.00, '2024-01-26', 'sacado', null)
) AS sample_data(plataforma, valor, data_transacao, status, observacoes)
WHERE u.username = 'admin'
ON CONFLICT DO NOTHING;
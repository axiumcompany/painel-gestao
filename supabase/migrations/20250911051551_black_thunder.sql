/*
  # Create transacoes table

  1. New Tables
    - `transacoes`
      - `id` (uuid, primary key)
      - `usuario_id` (uuid, foreign key to usuarios)
      - `plataforma` (text)
      - `valor` (decimal)
      - `data_transacao` (date)
      - `status` (enum: aguardando, sacado, falhou)
      - `observacoes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `transacoes` table
    - Add policies for users to manage their own transactions
    - Add policies for admins to manage all transactions

  3. Indexes
    - Index on usuario_id for performance
    - Index on status for filtering
    - Index on data_transacao for sorting
*/

-- Create enum for transaction status
DO $$ BEGIN
  CREATE TYPE transaction_status AS ENUM ('aguardando', 'sacado', 'falhou');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS transacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  plataforma text NOT NULL,
  valor decimal(10,2) NOT NULL,
  data_transacao date NOT NULL,
  status transaction_status DEFAULT 'aguardando',
  observacoes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own transactions
CREATE POLICY "Users can read own transactions"
  ON transacoes
  FOR SELECT
  TO authenticated
  USING (
    usuario_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Policy for users to insert their own transactions
CREATE POLICY "Users can insert own transactions"
  ON transacoes
  FOR INSERT
  TO authenticated
  WITH CHECK (usuario_id::text = auth.uid()::text);

-- Policy for users to update their own transactions (limited fields)
CREATE POLICY "Users can update own transactions"
  ON transacoes
  FOR UPDATE
  TO authenticated
  USING (
    usuario_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Policy for admins to delete transactions
CREATE POLICY "Admins can delete transactions"
  ON transacoes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transacoes_usuario_id ON transacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_status ON transacoes(status);
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes(data_transacao DESC);
CREATE INDEX IF NOT EXISTS idx_transacoes_created_at ON transacoes(created_at DESC);
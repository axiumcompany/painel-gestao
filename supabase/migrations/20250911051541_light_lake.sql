/*
  # Create usuarios table

  1. New Tables
    - `usuarios`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `senha` (text)
      - `nome` (text)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `usuarios` table
    - Add policy for authenticated users to read their own data
    - Add policy for admins to manage all users

  3. Initial Data
    - Insert default admin user
*/

CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  senha text NOT NULL,
  nome text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own data
CREATE POLICY "Users can read own data"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text OR is_admin = true);

-- Policy for users to update their own data
CREATE POLICY "Users can update own data"
  ON usuarios
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text OR is_admin = true);

-- Policy for admins to insert new users
CREATE POLICY "Admins can insert users"
  ON usuarios
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Policy for admins to delete users
CREATE POLICY "Admins can delete users"
  ON usuarios
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Insert default admin user
INSERT INTO usuarios (username, senha, nome, is_admin) 
VALUES ('admin', '205874', 'Administrador', true)
ON CONFLICT (username) DO NOTHING;
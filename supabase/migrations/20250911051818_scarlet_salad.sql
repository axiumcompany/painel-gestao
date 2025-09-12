/*
  # Create admin user manually

  1. Purpose
    - Ensure admin user exists in the database
    - Handle any conflicts gracefully
    - Verify the user can be queried

  2. Admin User Details
    - Username: admin
    - Password: 205874
    - Name: Administrador
    - Role: Admin (is_admin = true)
*/

-- First, let's check if the table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  senha text NOT NULL,
  nome text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Enable read access for all users" ON usuarios;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON usuarios;
DROP POLICY IF EXISTS "Enable update for users based on email" ON usuarios;

-- Create simple policies for now (we'll make them more restrictive later)
CREATE POLICY "Enable read access for all users" ON usuarios FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON usuarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for users based on email" ON usuarios FOR UPDATE USING (true);

-- Delete existing admin user if exists and recreate
DELETE FROM usuarios WHERE username = 'admin';

-- Insert admin user
INSERT INTO usuarios (username, senha, nome, is_admin) 
VALUES ('admin', '205874', 'Administrador', true);

-- Verify the user was created
SELECT * FROM usuarios WHERE username = 'admin';
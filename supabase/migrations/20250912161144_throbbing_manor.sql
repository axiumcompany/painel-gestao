/*
  # Add codigo column to transacoes table

  1. Changes
    - Add codigo column to transacoes table
    - Make it unique and not null
    - Add index for better performance
    - Update existing records with generated codes

  2. Security
    - Maintain existing RLS policies
*/

-- Add the codigo column
ALTER TABLE transacoes ADD COLUMN IF NOT EXISTS codigo text;

-- Update existing records with generated codes
DO $$
DECLARE
    rec RECORD;
    counter INTEGER := 1;
BEGIN
    FOR rec IN SELECT id FROM transacoes WHERE codigo IS NULL ORDER BY created_at
    LOOP
        UPDATE transacoes 
        SET codigo = 'TRX' || LPAD(counter::text, 3, '0')
        WHERE id = rec.id;
        counter := counter + 1;
    END LOOP;
END $$;

-- Make codigo NOT NULL and UNIQUE after updating existing records
ALTER TABLE transacoes ALTER COLUMN codigo SET NOT NULL;
ALTER TABLE transacoes ADD CONSTRAINT transacoes_codigo_unique UNIQUE (codigo);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_transacoes_codigo ON transacoes(codigo);
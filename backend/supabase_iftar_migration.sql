-- ============================================================
-- MSA Campus Hub — Iftar Tickets Table
-- Run this ONCE in your Supabase SQL Editor
-- Project: https://jvaaaxdbfitfclabjuhj.supabase.co
-- ============================================================

-- 1. Create the table
CREATE TABLE iftar_tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  payment_method  TEXT NOT NULL CHECK (payment_method IN ('paypal', 'revolut', 'bank')),
  paid            BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Unique email constraint (prevents double-registration)
ALTER TABLE iftar_tickets
  ADD CONSTRAINT iftar_tickets_email_unique UNIQUE (email);

-- 3. Enable Row Level Security
ALTER TABLE iftar_tickets ENABLE ROW LEVEL SECURITY;

-- 4. Allow anyone (including guests) to INSERT (register)
CREATE POLICY "public_can_register"
  ON iftar_tickets
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 5. Allow authenticated users to read their OWN ticket
CREATE POLICY "self_can_read_own_ticket"
  ON iftar_tickets
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

-- NOTE: The backend uses the service_role key (supabaseAdmin) which bypasses
-- RLS entirely — so GET /api/iftar-tickets and PATCH /:id/paid work fine
-- without any additional policies.

-- ============================================================
-- DONE! You should now see an iftar_tickets table in your
-- Supabase Table Editor. Verify with:
--   SELECT * FROM iftar_tickets;
-- ============================================================

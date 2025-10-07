-- Fix security vulnerabilities by enabling RLS and restricting access

-- 1. Enable RLS on propostas table (currently disabled)
ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;

-- 2. Drop overly permissive policies on propostas
DROP POLICY IF EXISTS "allow_public_insert" ON public.propostas;
DROP POLICY IF EXISTS "allow_authenticated_read" ON public.propostas;
DROP POLICY IF EXISTS "allow_authenticated_update" ON public.propostas;
DROP POLICY IF EXISTS "allow_authenticated_delete" ON public.propostas;

-- 3. Create admin-only policies for propostas
CREATE POLICY "Admins can view propostas"
ON public.propostas
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert propostas"
ON public.propostas
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update propostas"
ON public.propostas
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete propostas"
ON public.propostas
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Fix sofia_messages policies - restrict to admin only
DROP POLICY IF EXISTS "Permitir inserção pública de mensagens" ON public.sofia_messages;
DROP POLICY IF EXISTS "Permitir leitura pública de mensagens" ON public.sofia_messages;

CREATE POLICY "Admins can view sofia_messages"
ON public.sofia_messages
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert sofia_messages"
ON public.sofia_messages
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Note: Edge functions use service role key to bypass RLS for webhook inserts
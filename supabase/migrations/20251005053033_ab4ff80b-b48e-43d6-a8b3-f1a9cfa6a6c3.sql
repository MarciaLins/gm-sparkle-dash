-- 1. Criar ENUM para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Criar tabela user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Criar função SECURITY DEFINER para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. RLS Policies para user_roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Atualizar RLS policies para tabela clientes
DROP POLICY IF EXISTS "Authenticated users can view clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated users can insert clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated users can update clientes" ON public.clientes;
DROP POLICY IF EXISTS "Authenticated users can delete clientes" ON public.clientes;

CREATE POLICY "Admins can view clientes"
ON public.clientes FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert clientes"
ON public.clientes FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update clientes"
ON public.clientes FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete clientes"
ON public.clientes FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Atualizar RLS policies para tabela equipe
DROP POLICY IF EXISTS "Authenticated users can view equipe" ON public.equipe;
DROP POLICY IF EXISTS "Authenticated users can insert equipe" ON public.equipe;
DROP POLICY IF EXISTS "Authenticated users can update equipe" ON public.equipe;
DROP POLICY IF EXISTS "Authenticated users can delete equipe" ON public.equipe;

CREATE POLICY "Admins can view equipe"
ON public.equipe FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert equipe"
ON public.equipe FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update equipe"
ON public.equipe FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete equipe"
ON public.equipe FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 7. Atualizar RLS policies para tabela eventos
DROP POLICY IF EXISTS "Authenticated users can view eventos" ON public.eventos;
DROP POLICY IF EXISTS "Authenticated users can insert eventos" ON public.eventos;
DROP POLICY IF EXISTS "Authenticated users can update eventos" ON public.eventos;
DROP POLICY IF EXISTS "Authenticated users can delete eventos" ON public.eventos;

CREATE POLICY "Admins can view eventos"
ON public.eventos FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert eventos"
ON public.eventos FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update eventos"
ON public.eventos FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete eventos"
ON public.eventos FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 8. Atualizar RLS policies para tabela financeiro
DROP POLICY IF EXISTS "Authenticated users can view financeiro" ON public.financeiro;
DROP POLICY IF EXISTS "Authenticated users can insert financeiro" ON public.financeiro;
DROP POLICY IF EXISTS "Authenticated users can update financeiro" ON public.financeiro;
DROP POLICY IF EXISTS "Authenticated users can delete financeiro" ON public.financeiro;

CREATE POLICY "Admins can view financeiro"
ON public.financeiro FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert financeiro"
ON public.financeiro FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update financeiro"
ON public.financeiro FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete financeiro"
ON public.financeiro FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 9. Atualizar RLS policies para tabela lista_espera
DROP POLICY IF EXISTS "Authenticated users can view lista_espera" ON public.lista_espera;
DROP POLICY IF EXISTS "Authenticated users can insert lista_espera" ON public.lista_espera;
DROP POLICY IF EXISTS "Authenticated users can update lista_espera" ON public.lista_espera;
DROP POLICY IF EXISTS "Authenticated users can delete lista_espera" ON public.lista_espera;

CREATE POLICY "Admins can view lista_espera"
ON public.lista_espera FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert lista_espera"
ON public.lista_espera FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lista_espera"
ON public.lista_espera FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lista_espera"
ON public.lista_espera FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 10. Atualizar RLS policies para tabela servicos
DROP POLICY IF EXISTS "Authenticated users can view servicos" ON public.servicos;
DROP POLICY IF EXISTS "Authenticated users can insert servicos" ON public.servicos;
DROP POLICY IF EXISTS "Authenticated users can update servicos" ON public.servicos;
DROP POLICY IF EXISTS "Authenticated users can delete servicos" ON public.servicos;

CREATE POLICY "Admins can view servicos"
ON public.servicos FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert servicos"
ON public.servicos FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update servicos"
ON public.servicos FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete servicos"
ON public.servicos FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 11. Atualizar RLS policies para tabela alocacao_equipe
DROP POLICY IF EXISTS "Authenticated users can view alocacao_equipe" ON public.alocacao_equipe;
DROP POLICY IF EXISTS "Authenticated users can insert alocacao_equipe" ON public.alocacao_equipe;
DROP POLICY IF EXISTS "Authenticated users can update alocacao_equipe" ON public.alocacao_equipe;
DROP POLICY IF EXISTS "Authenticated users can delete alocacao_equipe" ON public.alocacao_equipe;

CREATE POLICY "Admins can view alocacao_equipe"
ON public.alocacao_equipe FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert alocacao_equipe"
ON public.alocacao_equipe FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update alocacao_equipe"
ON public.alocacao_equipe FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete alocacao_equipe"
ON public.alocacao_equipe FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
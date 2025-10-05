-- Criar tabela de propostas
CREATE TABLE public.propostas (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  nome_cliente text NOT NULL,
  email_cliente text NOT NULL,
  telefone_cliente text,
  tipo_evento text NOT NULL,
  data_evento date,
  local_evento text,
  detalhes_conversa jsonb,
  valor_proposta numeric,
  observacoes text,
  status text NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Aprovado', 'Recusado'))
);

-- Habilitar RLS
ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;

-- Policy: Permitir INSERT público (para Make.com sem autenticação)
CREATE POLICY "allow_public_insert" 
ON public.propostas 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Policy: Permitir SELECT apenas para usuários autenticados
CREATE POLICY "allow_authenticated_read" 
ON public.propostas 
FOR SELECT 
TO authenticated
USING (true);

-- Policy: Permitir UPDATE apenas para usuários autenticados
CREATE POLICY "allow_authenticated_update" 
ON public.propostas 
FOR UPDATE 
TO authenticated
USING (true);

-- Policy: Permitir DELETE apenas para usuários autenticados
CREATE POLICY "allow_authenticated_delete" 
ON public.propostas 
FOR DELETE 
TO authenticated
USING (true);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_propostas_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_propostas_updated_at
BEFORE UPDATE ON public.propostas
FOR EACH ROW
EXECUTE FUNCTION public.update_propostas_updated_at();
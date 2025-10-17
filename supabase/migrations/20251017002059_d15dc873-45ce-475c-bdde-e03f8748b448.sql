-- Criar tabela para registrar pagamentos e reservas
CREATE TABLE IF NOT EXISTS public.pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_cliente TEXT NOT NULL,
  email_cliente TEXT NOT NULL,
  telefone_cliente TEXT,
  pacote_selecionado TEXT NOT NULL,
  valor_total NUMERIC NOT NULL,
  valor_sinal NUMERIC NOT NULL,
  status_pagamento TEXT DEFAULT 'pendente',
  checkout_session_id TEXT,
  checkout_url TEXT,
  conversation_id UUID,
  data_evento DATE,
  tipo_evento TEXT,
  local_evento TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- Permitir que admins vejam todos os pagamentos
CREATE POLICY "Admins can view pagamentos"
ON public.pagamentos
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Permitir que admins insiram pagamentos
CREATE POLICY "Admins can insert pagamentos"
ON public.pagamentos
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Permitir que admins atualizem pagamentos
CREATE POLICY "Admins can update pagamentos"
ON public.pagamentos
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Criar índice para melhor performance
CREATE INDEX idx_pagamentos_email ON public.pagamentos(email_cliente);
CREATE INDEX idx_pagamentos_status ON public.pagamentos(status_pagamento);
CREATE INDEX idx_pagamentos_conversation ON public.pagamentos(conversation_id);
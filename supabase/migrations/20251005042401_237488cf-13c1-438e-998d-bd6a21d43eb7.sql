-- Criar tabela para armazenar mensagens da Sofia
CREATE TABLE public.sofia_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  user_message TEXT NOT NULL,
  sofia_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Criar índice para pesquisas por conversation_id
CREATE INDEX idx_sofia_messages_conversation_id ON public.sofia_messages(conversation_id);

-- Ativar Row Level Security
ALTER TABLE public.sofia_messages ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem inserir (para o Make.com via edge function)
CREATE POLICY "Permitir inserção pública de mensagens"
ON public.sofia_messages
FOR INSERT
WITH CHECK (true);

-- Política: Todos podem ler (para o frontend receber via Realtime)
CREATE POLICY "Permitir leitura pública de mensagens"
ON public.sofia_messages
FOR SELECT
USING (true);

-- Ativar Realtime para esta tabela
ALTER PUBLICATION supabase_realtime ADD TABLE public.sofia_messages;
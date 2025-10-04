-- Criar tabela de pacotes de serviços
CREATE TABLE public.pacotes_servicos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  preco_base NUMERIC NOT NULL,
  preco_tipo TEXT NOT NULL CHECK (preco_tipo IN ('fixo', 'a_partir')),
  categoria TEXT,
  detalhes TEXT[],
  ordem_exibicao INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.pacotes_servicos ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (qualquer um pode ver os pacotes)
CREATE POLICY "Pacotes são visíveis para todos"
ON public.pacotes_servicos
FOR SELECT
USING (ativo = true);

-- Política para edição (apenas autenticados podem editar)
CREATE POLICY "Usuários autenticados podem editar pacotes"
ON public.pacotes_servicos
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_pacotes_servicos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pacotes_servicos_updated_at
BEFORE UPDATE ON public.pacotes_servicos
FOR EACH ROW
EXECUTE FUNCTION public.update_pacotes_servicos_updated_at();

-- Popular tabela com os 6 pacotes
INSERT INTO public.pacotes_servicos (nome, descricao, preco_base, preco_tipo, categoria, detalhes, ordem_exibicao) VALUES
(
  'Serenata e Capela',
  'Serenata à capela, homenagem para momentos especiais',
  300.00,
  'fixo',
  'Serenata',
  ARRAY['1 ou 2 músicas', 'Apenas o som do violino', 'Ideal para momentos íntimos e especiais'],
  1
),
(
  'Apresentação Solo',
  'Apresentação solo, apenas o violino',
  900.00,
  'a_partir',
  'Performance',
  ARRAY['Duração: a partir de 1h de apresentação', 'Variedade de músicas', 'Atende todos os tipos de eventos', 'Ideal para cerimônias de casamentos', 'Eventos corporativos'],
  2
),
(
  'Apresentação Solo + Sistema de Som',
  'Apresentação solo com sistema de som profissional',
  1300.00,
  'a_partir',
  'Performance Premium',
  ARRAY['Sistema de som profissional JBL', 'Cobertura completa do evento', 'Microfone para palestras', 'Duração: a partir de 1h ou mais', 'Atende todo tipo de evento'],
  3
),
(
  'Apresentação Solo + Sistema de Som + Filmmaker',
  'Pacote completo com gravação profissional',
  1600.00,
  'a_partir',
  'Performance + Registro',
  ARRAY['Tudo da Opção 3', 'Gravação profissional exclusiva', 'Resumo do evento em vídeo', 'Imagens da apresentação', 'Imagens de todo o evento'],
  4
),
(
  'Apresentação Solo + Sistema de Som + Filmmaker + Imagens de Drone',
  'Pacote premium com filmagem cinematográfica',
  2200.00,
  'a_partir',
  'Performance Cinematográfica',
  ARRAY['Tudo da Opção 4', 'Imagens com drone (cenas cinematográficas)', 'Drone captura momentos em altitude', 'Dois tipos disponíveis: Estabilizado e FPV', 'Imagens disponibilizadas via link ou arquivo', 'Cenas aéreas profissionais'],
  5
),
(
  'Serviços Avulsos',
  'Contrate serviços individuais conforme sua necessidade',
  300.00,
  'a_partir',
  'Avulsos',
  ARRAY['Drone Estabilizado: a partir de R$ 600,00', 'Drone FPV: a partir de R$ 700,00', 'Filmmaker: a partir de R$ 300,00', 'Personalize seu pacote'],
  6
);
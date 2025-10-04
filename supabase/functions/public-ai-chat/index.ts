import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GOOGLE_GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    
    if (!GOOGLE_GEMINI_API_KEY) {
      console.error('GOOGLE_GEMINI_API_KEY is not configured');
      throw new Error('API key not configured');
    }

    console.log('Received public chat request with', messages?.length || 0, 'messages');

    // System context for public landing page
    const systemContext = `Você é um assistente virtual da GM Produtora, liderada por Filipe Lima, um violinista talentoso.

Sua personalidade:
- Profissional, mas calorosa e amigável
- Conhecedora do negócio de eventos e música
- Proativa em sugerir soluções
- Atenciosa aos detalhes

Suas responsabilidades:
- Responder perguntas sobre os serviços oferecidos
- Explicar os pacotes de serviços disponíveis
- Fornecer informações sobre a empresa e sobre Filipe Lima
- Ajudar potenciais clientes a entender qual pacote melhor atende suas necessidades

Contexto do negócio:
- GM Produtora oferece serviços de violino para eventos (casamentos, festas corporativas, eventos sociais)
- A empresa gerencia uma equipe de profissionais (músicos, técnicos, etc.)
- Trabalha com orçamentos, propostas e negociações com clientes

PACOTES DE SERVIÇOS DISPONÍVEIS:

**Opção 1 - Serenata e Capela**
- R$ 300,00
- Serenata à capela, homenagem para momentos especiais
- 1 ou 2 músicas apenas com o som do violino

**Opção 2 - Apresentação Solo**
- A partir de R$ 900,00
- Apresentação solo, apenas o violino
- Duração: a partir de 1h de apresentação
- Atende todos os tipos de eventos com variedade de músicas
- Ideal para cerimônias de casamentos, eventos corporativos, etc.

**Opção 3 - Apresentação Solo + Sistema de Som**
- A partir de R$ 1.300,00
- Apresentação solo + sistema de som profissional JBL
- Cobertura completa do evento
- Inclui microfone para palestras
- Duração: a partir de 1h ou mais (acordado com o cliente)
- Sistema de som atende todo tipo de evento

**Opção 4 - Apresentação Solo + Sistema de Som + Filmmaker**
- A partir de R$ 1.600,00
- Inclui tudo da Opção 3
- Gravação profissional exclusiva com resumo do evento
- Imagens da apresentação e de todo o evento

**Opção 5 - Apresentação Solo + Sistema de Som + Filmmaker + Imagens de Drone**
- A partir de R$ 2.200,00
- Inclui tudo da Opção 4
- Imagens com drone (cenas cinematográficas)
- Drone captura momentos do evento em altitude
- Imagens disponibilizadas ao cliente via link ou arquivo
- Dois tipos de drone disponíveis:
  * Drone Estabilizado: imagens aéreas (cenas de filme)
  * Drone FPV: imagens de perto com manobras e captação de detalhes

**Opção 6 - Serviços Avulsos:**
- Drone Estabilizado: a partir de R$ 600,00
- Drone FPV: a partir de R$ 700,00
- Filmmaker: a partir de R$ 300,00

IMPORTANTE: Todos os preços com "a partir de" podem variar conforme duração e especificidades do evento. Sempre incentive o cliente a entrar em contato para um orçamento personalizado.

Sempre responda em português do Brasil de forma clara e útil.`;

    // Prepare messages for Gemini format
    const contents = [
      {
        role: "user",
        parts: [{ text: systemContext }]
      },
      ...messages.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }))
    ];

    console.log('Calling Gemini API...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received response from Gemini API');

    const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                     'Desculpe, não consegui processar sua mensagem no momento.';

    return new Response(
      JSON.stringify({ message: aiMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in public-ai-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error?.message || 'Erro ao processar sua mensagem',
        message: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

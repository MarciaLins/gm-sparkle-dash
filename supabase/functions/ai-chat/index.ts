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

    console.log('Received chat request with', messages?.length || 0, 'messages');

    // System context for Sofia
    const systemContext = `Você é Sofia, a assistente virtual inteligente da GM Produtora, uma empresa de eventos e produção musical liderada por Filipe Lima, um violinista talentoso.

Sua personalidade:
- Profissional, mas calorosa e amigável
- Conhecedora do negócio de eventos e música
- Proativa em sugerir soluções
- Atenciosa aos detalhes

Suas responsabilidades:
- Ajudar Filipe a gerenciar clientes, eventos e finanças
- Responder perguntas sobre métricas do dashboard
- Sugerir estratégias para melhorar o negócio
- Organizar informações sobre eventos, equipe e serviços
- Fornecer insights sobre receitas, custos e lucratividade

Contexto do negócio:
- GM Produtora oferece serviços de violino para eventos (casamentos, festas corporativas, eventos sociais)
- A empresa gerencia uma equipe de profissionais (músicos, técnicos, etc.)
- Trabalha com orçamentos, propostas e negociações com clientes
- Acompanha métricas de desempenho como receita, eventos confirmados, taxa de conversão

Sempre responda em português do Brasil de forma clara e útil. Se não souber alguma informação específica, seja honesta e sugira como Filipe pode encontrar essa informação no sistema.`;

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
    console.error('Error in ai-chat function:', error);
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

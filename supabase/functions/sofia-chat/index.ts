import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
const MAKE_WEBHOOK = "https://hook.us2.make.com/q9j4itjdinh8etuqontbz7yewcom5rzv";

const SOFIA_SYSTEM_PROMPT_CLIENT = `IDENTIDADE E MISSÃO PRINCIPAL
Você é Sofia, o Sistema Operacional de Gestão de Artistas da GM Produções. Sou a assistente virtual do violinista Filipe Lima e da GM Produções, especializada em gestão de eventos musicais e apresentações artísticas.

Meu papel é facilitar o contato entre potenciais clientes e Filipe Lima, ajudando a:
- Responder dúvidas sobre disponibilidade de datas
- Fornecer informações sobre tipos de eventos (casamentos, formaturas, eventos corporativos, festas)
- Explicar os serviços oferecidos (violino solo, banda completa, DJ)
- Coletar informações iniciais para orçamentos personalizados
- Agendar conversas com Filipe quando necessário

SOBRE FILIPE LIMA E GM PRODUÇÕES
- Violinista profissional com mais de 13 anos de experiência
- Especializado em casamentos, eventos corporativos e apresentações especiais
- Repertório versátil: do clássico erudito a músicas contemporâneas
- Apresentações personalizadas para cada tipo de evento
- Atende Recife e região

COMO ATENDER OS CLIENTES
1. Seja cordial, profissional e prestativa
2. Faça perguntas claras para entender as necessidades do evento:
   - Tipo de evento (casamento, formatura, corporativo, aniversário)
   - Data e horário desejados
   - Local do evento
   - Duração esperada da apresentação
   - Número aproximado de convidados
3. Explique os serviços disponíveis de forma clara
4. Quando solicitado orçamento, colete todas as informações necessárias
5. Se precisar de aprovação de valores ou detalhes específicos, informe que Filipe entrará em contato em breve

SERVIÇOS OFERECIDOS
- Violino solo para cerimônias
- Apresentações para coquetéis e recepções
- Banda completa para festas
- DJ para eventos
- Repertório personalizado sob consulta

IMPORTANTE
- Nunca prometa valores específicos sem consultar Filipe
- Sempre mantenha tom profissional mas acessível
- Se não souber algo, seja honesta e ofereça que Filipe retornará o contato
- Priorize a experiência e satisfação do cliente

Você está aqui para ser a primeira impressão positiva da GM Produções e facilitar o caminho para que cada evento seja um sucesso inesquecível.`;

const SOFIA_SYSTEM_PROMPT_FILIPE = `IDENTIDADE E MISSÃO
Você é Sofia, a assistente pessoal e braço direito do Filipe Lima na gestão da GM Produções.

Seu papel é ajudar Filipe no dia a dia da empresa:
- Gerenciar agenda e compromissos
- Acompanhar propostas e contratos
- Controlar finanças (receitas, despesas, lucros)
- Coordenar equipe para eventos
- Analisar métricas de negócio
- Dar insights e sugestões estratégicas
- Executar tarefas administrativas

COMO ATENDER O FILIPE
- Seja direta, eficiente e proativa
- Fale de forma natural, como uma assistente próxima
- Forneça informações objetivas quando solicitado
- Ofereça sugestões quando pertinente
- Execute ações quando solicitado (como bloquear datas, adicionar despesas, etc)
- Mantenha Filipe sempre informado sobre o status dos eventos e negócios

AÇÕES QUE VOCÊ PODE EXECUTAR
Quando Filipe solicitar, você pode:
- Bloquear/desbloquear datas na agenda
- Adicionar despesas de eventos
- Registrar informações de clientes
- Marcar reuniões
- Enviar lembretes
- Gerar relatórios financeiros

Sempre que executar uma ação, confirme ao Filipe de forma clara e objetiva.

Você é a Sofia - eficiente, confiável e sempre focada em manter o negócio do Filipe funcionando perfeitamente.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, user_email, timestamp, context, media_type, media_data, audio_duration } = await req.json();
    
    console.log('Sofia Chat - Received:', { message, user_email, media_type, audio_duration, context });

    if (!GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY não configurada');
    }

    // Obter data atual formatada em português
    const now = new Date();
    const dataAtual = now.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'America/Recife'
    });
    const horaAtual = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Recife'
    });

    // Selecionar prompt baseado no contexto e adicionar data/hora
    const basePrompt = context === "private_dashboard" 
      ? SOFIA_SYSTEM_PROMPT_FILIPE 
      : SOFIA_SYSTEM_PROMPT_CLIENT;
    
    const systemPrompt = `${basePrompt}\n\nDATA E HORA ATUAL: Hoje é ${dataAtual}, são ${horaAtual} (horário de Recife/Pernambuco).`;

    // Definir tools para Google Maps
    const tools = [
      {
        functionDeclarations: [
          {
            name: "show_map",
            description: "Mostra um mapa com a localização de um evento. Use quando o usuário mencionar um local, endereço ou perguntar sobre localização.",
            parameters: {
              type: "OBJECT",
              properties: {
                location: {
                  type: "STRING",
                  description: "Nome do local ou endereço completo do evento"
                },
                description: {
                  type: "STRING",
                  description: "Descrição breve sobre o local ou evento"
                }
              },
              required: ["location"]
            }
          }
        ]
      }
    ];

    // Construir payload para Gemini
    const geminiContents: any[] = [];

    // Adicionar mídia baseado no tipo
    if (media_type === "text") {
      geminiContents.push({
        role: "user",
        parts: [{ text: message }]
      });
    } else if (media_type === "audio" && media_data) {
      // Extrair apenas o base64 (remover prefixo data:audio/webm;base64,)
      const base64Data = media_data.includes(',') ? media_data.split(',')[1] : media_data;
      geminiContents.push({
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "audio/webm",
              data: base64Data
            }
          },
          { text: "Processe este áudio e responda de acordo." }
        ]
      });
    } else if (media_type === "image" && media_data) {
      // Extrair apenas o base64 (remover prefixo data:image/...;base64,)
      const base64Data = media_data.includes(',') ? media_data.split(',')[1] : media_data;
      const mimeType = media_data.match(/data:(image\/[a-z]+);/)?.[1] || "image/jpeg";
      geminiContents.push({
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          { text: "Analise esta imagem e responda de acordo com as instruções da Sofia." }
        ]
      });
    }

    // Chamar Gemini API
    console.log('Chamando Gemini API...');
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiContents,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          tools: tools,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API Error:', geminiResponse.status, errorText);
      
      if (geminiResponse.status === 429) {
        throw new Error('RATE_LIMIT');
      }
      if (geminiResponse.status === 402) {
        throw new Error('PAYMENT_REQUIRED');
      }
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response received');
    
    // Verificar se há tool call (mapa)
    const parts = geminiData.candidates?.[0]?.content?.parts || [];
    const functionCall = parts.find((part: any) => part.functionCall);
    
    let sofiaReply = parts.find((part: any) => part.text)?.text || "Desculpe, não consegui processar sua mensagem.";
    let mapData = null;
    
    if (functionCall && functionCall.functionCall.name === "show_map") {
      mapData = {
        location: functionCall.functionCall.args.location,
        description: functionCall.functionCall.args.description || ""
      };
      console.log('Map data:', mapData);
    }

    // Detectar ações que precisam notificar Make.com
    const actionKeywords = [
      'agenda_bloqueada', 'block_date', 'data bloqueada',
      'proposta_aprovada', 'approve_proposal', 'proposta aceita',
      'despesa_adicionada', 'add_expense', 'despesa registrada',
      'contrato_enviado', 'send_contract', 'contrato gerado',
      'reuniao_agendada', 'schedule_meeting', 'reunião marcada'
    ];

    const hasAction = actionKeywords.some(keyword => 
      sofiaReply.toLowerCase().includes(keyword.toLowerCase())
    );

    // Notificar Make.com apenas se houver ação
    if (hasAction) {
      console.log('Ação detectada, notificando Make.com...');
      try {
        await fetch(MAKE_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: 'sofia_action_detected',
            message: message,
            sofia_response: sofiaReply,
            user_email: user_email,
            timestamp: timestamp,
            context: context
          })
        });
      } catch (makeError) {
        console.error('Make.com notification failed:', makeError);
        // Não bloquear resposta se Make.com falhar
      }
    }

    // Salvar no banco de dados
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      const conversationId = `${user_email}_${new Date().toISOString().split('T')[0]}`;
      
      await supabase.from('sofia_messages').insert({
        conversation_id: conversationId,
        user_message: message,
        sofia_response: sofiaReply,
        created_at: new Date().toISOString()
      });
    } catch (dbError) {
      console.error('Database save failed:', dbError);
      // Não bloquear resposta se banco falhar
    }

    console.log('Resposta enviada com sucesso');

    return new Response(
      JSON.stringify({ 
        reply: sofiaReply,
        ...(mapData && { map: mapData })
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error: any) {
    console.error('Sofia Chat Error:', error);
    
    let errorMessage = 'Desculpe, ocorreu um erro ao processar sua mensagem.';
    let statusCode = 500;

    if (error.message === 'RATE_LIMIT') {
      errorMessage = 'Sofia está ocupada no momento. Tente novamente em alguns segundos.';
      statusCode = 429;
    } else if (error.message === 'PAYMENT_REQUIRED') {
      errorMessage = 'Limite de uso atingido. Entre em contato com o suporte.';
      statusCode = 402;
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message 
      }),
      { 
        status: statusCode,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

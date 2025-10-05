import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MAKE_WEBHOOK_DASHBOARD = "https://hook.us2.make.com/q9j4itjdinh8etuqontbz7yewcom5rzv";
const MAKE_WEBHOOK_LANDING = "https://hook.us2.make.com/ngw41roxe6sx7txxqmfn8mae305618tt";

const SOFIA_SYSTEM_PROMPT_CLIENT = `IDENTIDADE E MISSÃO PRINCIPAL
Você é Sofia, assistente do violinista Filipe Lima, especializada em gestão de eventos musicais e apresentações artísticas.

Meu papel é facilitar o contato entre potenciais clientes e Filipe Lima, ajudando a:
- Responder dúvidas sobre disponibilidade de datas
- Fornecer informações sobre tipos de eventos (casamentos, formaturas, eventos corporativos, festas)
- Explicar os serviços oferecidos (violino solo, banda completa, DJ)
- Coletar informações iniciais para orçamentos personalizados
- Agendar conversas com Filipe quando necessário

SOBRE FILIPE LIMA
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

Você está aqui para ser a primeira impressão positiva de Filipe Lima e facilitar o caminho para que cada evento seja um sucesso inesquecível.`;

const SOFIA_SYSTEM_PROMPT_FILIPE = `IDENTIDADE E MISSÃO
Você é Sofia, a assistente pessoal e braço direito do Filipe Lima.

Seu papel é ajudar Filipe no dia a dia da empresa:
- Gerenciar agenda e compromissos
- Acompanhar propostas e contratos
- Controlar finanças (receitas, despesas, lucros)
- Coordenar equipe para eventos
- Analisar métricas de negócio
- Dar insights e sugestões estratégicas
- Executar tarefas administrativas

FERRAMENTAS DISPONÍVEIS
Você tem acesso direto ao banco de dados e pode:
- CONSULTAR dados de eventos, clientes, finanças, propostas, equipe e serviços
- EXECUTAR AÇÕES como criar eventos, atualizar propostas, registrar despesas, gerenciar clientes e alocar equipe

Use as ferramentas query_database e execute_action quando Filipe pedir informações ou ações.

COMO ATENDER O FILIPE
- Seja direta, eficiente e proativa
- Fale de forma natural, como uma assistente próxima
- Forneça informações objetivas quando solicitado
- Ofereça sugestões quando pertinente
- Execute ações quando solicitado
- Sempre confirme ações executadas de forma clara

EXEMPLOS DE USO:
- "Quantos eventos tenho esse mês?" → Use query_database na tabela eventos
- "Bloqueia dia 15 de novembro" → Use execute_action para criar evento de bloqueio
- "Quanto gastei em hotel esse ano?" → Use query_database em financeiro com filtros
- "Registra despesa de R$ 500 em hotel" → Use execute_action create_expense

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

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

    // Retrieve conversation history (last 15 messages)
    const conversationId = `${user_email}_${new Date(timestamp).toISOString().split('T')[0]}`;
    const { data: messageHistory } = await supabase
      .from('sofia_messages')
      .select('user_message, sofia_response')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(15);

    // Definir tools expandidos
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
          },
          {
            name: "query_database",
            description: "Consulta dados do banco. Use para buscar informações sobre eventos, clientes, finanças, propostas, equipe ou serviços.",
            parameters: {
              type: "OBJECT",
              properties: {
                table: {
                  type: "STRING",
                  enum: ["eventos", "clientes", "financeiro", "propostas", "equipe", "servicos", "pacotes_servicos"],
                  description: "Tabela a consultar"
                },
                filters: {
                  type: "STRING",
                  description: "Filtros JSON opcional (ex: {\"status\": \"Confirmado\"})"
                },
                limit: {
                  type: "NUMBER",
                  description: "Máximo de registros (padrão: 10)"
                }
              },
              required: ["table"]
            }
          },
          {
            name: "execute_action",
            description: "Executa uma ação no banco. Use para criar eventos, atualizar propostas, registrar despesas, gerenciar clientes ou alocar equipe.",
            parameters: {
              type: "OBJECT",
              properties: {
                action: {
                  type: "STRING",
                  enum: ["create_event", "update_event", "update_proposal_status", "create_expense", "create_client", "update_client", "allocate_team"],
                  description: "Ação a executar"
                },
                data: {
                  type: "STRING",
                  description: "Dados JSON necessários para a ação"
                }
              },
              required: ["action", "data"]
            }
          }
        ]
      }
    ];

    // Construir payload para Gemini com histórico
    const geminiContents: any[] = [];
    
    // Add previous messages in chronological order
    if (messageHistory && messageHistory.length > 0) {
      messageHistory.reverse().forEach(msg => {
        geminiContents.push({
          role: "user",
          parts: [{ text: msg.user_message }]
        });
        if (msg.sofia_response) {
          geminiContents.push({
            role: "model",
            parts: [{ text: msg.sofia_response }]
          });
        }
      });
    }

    // Adicionar mensagem atual baseado no tipo
    if (media_type === "text") {
      geminiContents.push({
        role: "user",
        parts: [{ text: message }]
      });
    } else if (media_type === "audio" && media_data) {
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
    
    // Processar resposta e function calls
    const parts = geminiData.candidates?.[0]?.content?.parts || [];
    let sofiaReply = "";
    let mapData = null;
    
    for (const part of parts) {
      if (part.text) {
        sofiaReply += part.text;
      }
      
      if (part.functionCall) {
        const functionCall = part.functionCall;
        console.log('Function call detected:', functionCall.name, functionCall.args);
        
        if (functionCall.name === "show_map") {
          mapData = {
            location: functionCall.args.location,
            description: functionCall.args.description || ""
          };
        } else if (functionCall.name === "query_database") {
          const filters = functionCall.args.filters ? JSON.parse(functionCall.args.filters) : {};
          const result = await executeQuery(supabase, {
            table: functionCall.args.table,
            filters: filters,
            limit: functionCall.args.limit || 10
          });
          sofiaReply += `\n\n📊 Dados encontrados: ${result.count} registro(s)\n${JSON.stringify(result.data, null, 2)}`;
        } else if (functionCall.name === "execute_action") {
          const data = JSON.parse(functionCall.args.data);
          const result = await executeAction(supabase, {
            action: functionCall.args.action,
            data: data
          });
          if (result.success) {
            sofiaReply += `\n\n✅ ${result.message}`;
          } else {
            sofiaReply += `\n\n❌ Erro: ${result.error}`;
          }
        }
      }
    }
    
    if (!sofiaReply) {
      sofiaReply = "Desculpe, não consegui processar sua mensagem.";
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

    if (hasAction) {
      console.log('Ação detectada, notificando Make.com...');
      // Selecionar webhook baseado no contexto
      const webhookUrl = context === "landing_page" ? MAKE_WEBHOOK_LANDING : MAKE_WEBHOOK_DASHBOARD;
      
      try {
        await fetch(webhookUrl, {
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
      }
    }

    // Salvar no banco de dados
    try {
      await supabase.from('sofia_messages').insert({
        conversation_id: conversationId,
        user_message: message,
        sofia_response: sofiaReply,
        created_at: new Date().toISOString()
      });
    } catch (dbError) {
      console.error('Database save failed:', dbError);
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

// Helper function to execute database queries
async function executeQuery(supabase: any, args: any) {
  const { table, filters = {}, limit = 10 } = args;
  
  try {
    let query = supabase.from(table).select('*');
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('>')) {
        query = query.gt(key, value.substring(1));
      } else if (typeof value === 'string' && value.startsWith('<')) {
        query = query.lt(key, value.substring(1));
      } else {
        query = query.eq(key, value);
      }
    });
    
    const { data, error } = await query.limit(limit);
    
    if (error) throw error;
    
    return {
      success: true,
      data: data,
      count: data.length
    };
  } catch (error: any) {
    console.error('Query error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper function to execute database actions
async function executeAction(supabase: any, args: any) {
  const { action, data } = args;
  
  try {
    switch (action) {
      case 'create_event':
        const { data: newEvent, error: eventError } = await supabase
          .from('eventos')
          .insert([{
            nome_evento: data.nome_evento,
            tipo_evento: data.tipo_evento,
            local_evento: data.local_evento,
            data_inicio: data.data_inicio,
            data_fim: data.data_fim,
            id_cliente: data.id_cliente,
            status_evento: data.status_evento || 'Pendente'
          }])
          .select();
        
        if (eventError) throw eventError;
        return { success: true, message: 'Evento criado com sucesso', data: newEvent };
      
      case 'update_event':
        const { data: updatedEvent, error: updateError } = await supabase
          .from('eventos')
          .update(data.updates)
          .eq('id', data.id)
          .select();
        
        if (updateError) throw updateError;
        return { success: true, message: 'Evento atualizado', data: updatedEvent };
      
      case 'update_proposal_status':
        const { error: proposalError } = await supabase
          .from('propostas')
          .update({ status: data.status })
          .eq('id', data.id);
        
        if (proposalError) throw proposalError;
        return { success: true, message: `Proposta marcada como ${data.status}` };
      
      case 'create_expense':
        const { data: newExpense, error: expenseError } = await supabase
          .from('financeiro')
          .insert([{
            tipo: 'Saída',
            categoria: data.categoria,
            descricao: data.descricao,
            valor: data.valor,
            id_evento: data.id_evento,
            status: data.status || 'Pendente'
          }])
          .select();
        
        if (expenseError) throw expenseError;
        return { success: true, message: 'Despesa registrada', data: newExpense };
      
      case 'create_client':
        const { data: newClient, error: clientError } = await supabase
          .from('clientes')
          .insert([{
            nome_cliente: data.nome_cliente,
            email_contato: data.email_contato,
            telefone_contato: data.telefone_contato,
            observacoes_ia: data.observacoes_ia
          }])
          .select();
        
        if (clientError) throw clientError;
        return { success: true, message: 'Cliente criado', data: newClient };
      
      case 'update_client':
        const { error: updateClientError } = await supabase
          .from('clientes')
          .update(data.updates)
          .eq('id', data.id);
        
        if (updateClientError) throw updateClientError;
        return { success: true, message: 'Cliente atualizado' };
      
      case 'allocate_team':
        const { data: allocation, error: allocError } = await supabase
          .from('alocacao_equipe')
          .insert([{
            id_evento: data.id_evento,
            id_membro_equipe: data.id_membro_equipe,
            valor_acordado: data.valor_acordado
          }])
          .select();
        
        if (allocError) throw allocError;
        return { success: true, message: 'Equipe alocada ao evento', data: allocation };
      
      default:
        return { success: false, error: 'Ação não reconhecida' };
    }
  } catch (error: any) {
    console.error('Action error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
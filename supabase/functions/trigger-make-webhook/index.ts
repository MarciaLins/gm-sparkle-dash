import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  evento: string;
  dados: Record<string, any>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { evento, dados }: WebhookPayload = await req.json();

    console.log(`[Webhook] Evento: ${evento}, User: ${user.id}`);

    // Buscar webhook ativo para este evento
    const { data: webhooks, error: webhookError } = await supabase
      .from('make_webhooks')
      .select('webhook_url, total_execucoes')
      .eq('user_id', user.id)
      .eq('evento', evento)
      .eq('ativo', true)
      .limit(1);

    if (webhookError) {
      console.error('Error fetching webhook:', webhookError);
      throw webhookError;
    }

    if (!webhooks || webhooks.length === 0) {
      console.log(`[Webhook] Nenhum webhook ativo encontrado para evento: ${evento}`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Nenhum webhook configurado para este evento' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const webhookUrl = webhooks[0].webhook_url;

    // Payload estruturado para o Make
    const payload = {
      evento,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      dados,
      metadata: {
        app_version: '1.0.0',
        source: 'filipe-lima-app'
      }
    };

    console.log(`[Webhook] Enviando para: ${webhookUrl}`);

    // Enviar para o Make
    const makeResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!makeResponse.ok) {
      console.error(`[Webhook] Make retornou erro: ${makeResponse.status}`);
      throw new Error(`Make webhook failed: ${makeResponse.status}`);
    }

    console.log(`[Webhook] Sucesso! Status: ${makeResponse.status}`);

    // Atualizar estatísticas
    await supabase
      .from('make_webhooks')
      .update({
        ultima_execucao: new Date().toISOString(),
        total_execucoes: webhooks[0].total_execucoes ? webhooks[0].total_execucoes + 1 : 1
      })
      .eq('user_id', user.id)
      .eq('evento', evento);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Webhook enviado com sucesso' 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Webhook] Erro:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

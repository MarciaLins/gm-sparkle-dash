import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      nome_cliente, 
      email_cliente, 
      telefone_cliente,
      valor_total,
      pacote_selecionado,
      tipo_evento,
      local_evento,
      data_evento
    } = await req.json();

    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('Mercado Pago access token não configurado');
    }

    // Calcular valor do sinal (50% do total)
    const valorSinal = valor_total * 0.5;

    console.log('Criando preferência Mercado Pago para:', {
      nome_cliente,
      email_cliente,
      valor_total,
      valor_sinal: valorSinal
    });

    // Criar preferência de pagamento no Mercado Pago
    const preferenceResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title: `Reserva - ${pacote_selecionado}`,
            description: `Sinal (50%) para ${tipo_evento}`,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: valorSinal,
          }
        ],
        payer: {
          name: nome_cliente,
          email: email_cliente,
          phone: telefone_cliente ? {
            number: telefone_cliente
          } : undefined,
        },
        back_urls: {
          success: 'https://vtjoeazrgdqvubytwogh.supabase.co/functions/v1/sofia-response?status=success',
          failure: 'https://vtjoeazrgdqvubytwogh.supabase.co/functions/v1/sofia-response?status=failure',
          pending: 'https://vtjoeazrgdqvubytwogh.supabase.co/functions/v1/sofia-response?status=pending',
        },
        auto_return: 'approved',
        external_reference: email_cliente,
        notification_url: 'https://vtjoeazrgdqvubytwogh.supabase.co/functions/v1/sofia-response',
        metadata: {
          nome_cliente,
          email_cliente,
          telefone_cliente,
          tipo_evento,
          local_evento,
          data_evento,
          pacote_selecionado,
          valor_total,
          valor_sinal: valorSinal,
        }
      }),
    });

    if (!preferenceResponse.ok) {
      const errorText = await preferenceResponse.text();
      console.error('Erro ao criar preferência Mercado Pago:', errorText);
      throw new Error(`Erro ao criar link de pagamento: ${errorText}`);
    }

    const preference = await preferenceResponse.json();
    console.log('Preferência criada com sucesso:', preference.id);

    return new Response(
      JSON.stringify({
        checkout_url: preference.init_point,
        preference_id: preference.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Erro na função create-mercadopago-preference:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
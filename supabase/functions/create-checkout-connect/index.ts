import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      nome_cliente,
      email_cliente,
      telefone_cliente,
      pacote_selecionado,
      valor_total,
      conversation_id,
      data_evento,
      tipo_evento,
      local_evento,
      connected_account_id,
    } = await req.json();

    console.log("[CREATE-CHECKOUT-CONNECT] Dados recebidos:", {
      nome_cliente,
      email_cliente,
      pacote_selecionado,
      valor_total,
      connected_account_id,
    });

    // Validações
    if (!nome_cliente || !email_cliente || !pacote_selecionado || !valor_total || !connected_account_id) {
      throw new Error("Dados obrigatórios faltando");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Calcular 50% do valor como sinal
    const valor_sinal = Math.round(valor_total * 0.5);
    const valor_sinal_centavos = valor_sinal * 100; // Stripe usa centavos

    // Calcular taxa da aplicação (5% do valor do sinal)
    const application_fee = Math.round(valor_sinal_centavos * 0.05);

    console.log("[CREATE-CHECKOUT-CONNECT] Valores calculados:", {
      valor_total,
      valor_sinal,
      valor_sinal_centavos,
      application_fee,
    });

    // Criar sessão de checkout com Stripe Connect
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `${pacote_selecionado} - Sinal (50%)`,
              description: `Reserva para ${tipo_evento || "evento"}`,
            },
            unit_amount: valor_sinal_centavos,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/landing?payment=success`,
      cancel_url: `${req.headers.get("origin")}/landing?payment=cancelled`,
      customer_email: email_cliente,
      payment_intent_data: {
        application_fee_amount: application_fee,
        transfer_data: {
          destination: connected_account_id,
        },
      },
      metadata: {
        nome_cliente,
        pacote_selecionado,
        conversation_id: conversation_id || "",
        tipo_evento: tipo_evento || "",
      },
    });

    console.log("[CREATE-CHECKOUT-CONNECT] Sessão criada:", {
      session_id: session.id,
      url: session.url,
    });

    // Salvar no Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: pagamento, error: dbError } = await supabase
      .from("pagamentos")
      .insert({
        nome_cliente,
        email_cliente,
        telefone_cliente,
        pacote_selecionado,
        valor_total,
        valor_sinal,
        checkout_session_id: session.id,
        checkout_url: session.url,
        conversation_id,
        data_evento,
        tipo_evento,
        local_evento,
        status_pagamento: "pendente",
      })
      .select()
      .single();

    if (dbError) {
      console.error("[CREATE-CHECKOUT-CONNECT] Erro ao salvar no DB:", dbError);
      throw dbError;
    }

    console.log("[CREATE-CHECKOUT-CONNECT] Pagamento registrado:", pagamento.id);

    return new Response(
      JSON.stringify({
        checkout_url: session.url,
        session_id: session.id,
        pagamento_id: pagamento.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[CREATE-CHECKOUT-CONNECT] Erro:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Erro ao criar checkout",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

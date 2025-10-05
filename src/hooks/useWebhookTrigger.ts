import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWebhookTrigger = () => {
  const [isLoading, setIsLoading] = useState(false);

  const trigger = async (evento: string, dados: Record<string, any>) => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.warn('[Webhook] Usuário não autenticado, webhook não será enviado');
        return { success: false, error: 'Não autenticado' };
      }

      const { data, error } = await supabase.functions.invoke('trigger-make-webhook', {
        body: { evento, dados }
      });

      if (error) {
        console.error('[Webhook] Erro ao disparar:', error);
        return { success: false, error: error.message };
      }

      console.log('[Webhook] Disparado com sucesso:', evento);
      return { success: true, data };
      
    } catch (error) {
      console.error('[Webhook] Erro inesperado:', error);
      return { success: false, error: String(error) };
    } finally {
      setIsLoading(false);
    }
  };

  return { trigger, isLoading };
};

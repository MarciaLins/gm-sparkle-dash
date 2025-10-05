import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { ChatPanel } from "@/components/ChatPanel";
import { EventsAndTasks } from "@/components/EventsAndTasks";
import { DollarSign, TrendingUp, Users, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: metricsData } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      // Buscar eventos
      const { data: eventosData, error: eventosError } = await supabase
        .from('eventos')
        .select('*');
      
      if (eventosError) throw eventosError;
      
      // Buscar faturamento do mês atual da tabela financeiro
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      
      const { data: financeiroData, error: financeiroError } = await supabase
        .from('financeiro')
        .select('valor')
        .eq('tipo', 'Receita')
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString());
      
      if (financeiroError) throw financeiroError;
      
      const faturamentoMes = financeiroData?.reduce((acc, item) => acc + (Number(item.valor) || 0), 0) || 0;
      const eventosConfirmados = eventosData?.filter(e => e.status_evento === "Confirmado").length || 0;
      
      // Buscar faturamento dos últimos 6 meses
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      
      const { data: faturamentoSemestralData, error: faturamentoSemestralError } = await supabase
        .from('financeiro')
        .select('valor')
        .eq('tipo', 'Receita')
        .gte('created_at', sixMonthsAgo.toISOString())
        .lte('created_at', endOfMonth.toISOString());
      
      if (faturamentoSemestralError) throw faturamentoSemestralError;
      
      const faturamentoSemestral = faturamentoSemestralData?.reduce((acc, item) => acc + (Number(item.valor) || 0), 0) || 0;
      
      return {
        faturamento: faturamentoMes,
        faturamentoSemestral,
        eventosConfirmados,
        novoLeads: 5,
      };
    }
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
                Dashboard
              </span>
              <span className="text-foreground"> | Filipe Lima</span>
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Faturamento (Mês)"
              value={`R$ ${(metricsData?.faturamento || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={DollarSign}
              trend={{ value: "12%", positive: true }}
            />
            <MetricCard
              title="Lucro Líquido (Mês)"
              value="R$ 8.500,00"
              icon={TrendingUp}
              trend={{ value: "8%", positive: true }}
            />
            <MetricCard
              title="Novos Leads"
              value={metricsData?.novoLeads?.toString() || '0'}
              icon={Users}
            />
            <MetricCard
              title="Eventos Confirmados"
              value={metricsData?.eventosConfirmados?.toString() || '0'}
              icon={Calendar}
            />
          </div>

          {/* Faturamento Semestral Card */}
          <div className="grid grid-cols-1 mb-8">
            <MetricCard
              title="Faturamento Semestral"
              value={`R$ ${(metricsData?.faturamentoSemestral || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={TrendingUp}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events and Tasks */}
            <div className="h-[600px]">
              <EventsAndTasks />
            </div>

            {/* Chat Panel */}
            <div className="h-[600px]">
              <ChatPanel />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

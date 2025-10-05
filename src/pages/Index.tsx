import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { EventsAndTasks } from "@/components/EventsAndTasks";
import { DollarSign, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: financeiro } = useQuery({
    queryKey: ['financeiro-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financeiro')
        .select('*')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  const { data: clientes } = useQuery({
    queryKey: ['clientes-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
      
      if (error) throw error;
      return count || 0;
    }
  });

  const faturamentoMes = financeiro
    ?.filter(t => t.tipo === 'receita')
    .reduce((sum, t) => sum + (Number(t.valor) || 0), 0) || 0;

  const despesasMes = financeiro
    ?.filter(t => t.tipo === 'despesa')
    .reduce((sum, t) => sum + (Number(t.valor) || 0), 0) || 0;

  const lucroMes = faturamentoMes - despesasMes;

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
              <span className="text-foreground"> | GM Produtora</span>
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Faturamento (Mês)"
                value={`R$ ${faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                icon={DollarSign}
              />
              <MetricCard
                title="Lucro Líquido (Mês)"
                value={`R$ ${lucroMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                icon={TrendingUp}
              />
              <MetricCard
                title="Novos Leads"
                value={clientes?.toString() || "0"}
                icon={Users}
              />
            </div>

            {/* Events and Tasks */}
            <EventsAndTasks />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

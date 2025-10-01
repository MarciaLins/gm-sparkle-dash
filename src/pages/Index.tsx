import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { ChatPanel } from "@/components/ChatPanel";
import { EventsAndTasks } from "@/components/EventsAndTasks";
import { DollarSign, TrendingUp, Users } from "lucide-react";

const Index = () => {
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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
            {/* Left Section - 70% */}
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  title="Faturamento (Mês)"
                  value="R$ 125.400"
                  icon={DollarSign}
                  trend={{ value: "+12.5%", positive: true }}
                />
                <MetricCard
                  title="Lucro Líquido (Mês)"
                  value="R$ 48.200"
                  icon={TrendingUp}
                  trend={{ value: "+8.3%", positive: true }}
                />
                <MetricCard
                  title="Novos Leads"
                  value="34"
                  icon={Users}
                  trend={{ value: "+15.2%", positive: true }}
                />
              </div>

              {/* Events and Tasks */}
              <EventsAndTasks />
            </div>

            {/* Right Section - 30% */}
            <div className="lg:h-[calc(100vh-120px)] lg:sticky lg:top-[88px]">
              <ChatPanel />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

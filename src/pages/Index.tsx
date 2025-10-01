import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users } from "lucide-react";

const Index = () => {
  // Versão simplificada para teste do Visual Editor
  console.log("Dashboard carregado - modo de teste do Visual Editor");

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
          <div className="mb-6">
            <p className="text-muted-foreground">
              Versão simplificada para testar o Visual Editor
            </p>
          </div>

          {/* Metric Cards Simplificados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1 */}
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Faturamento (Mês)
                </CardTitle>
                <DollarSign className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">R$ 1.250,00</div>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Lucro Líquido (Mês)
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">R$ 800,00</div>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Novos Leads
                </CardTitle>
                <Users className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">3</div>
              </CardContent>
            </Card>
          </div>

          {/* Card de Teste */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Área de Teste do Visual Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Esta é uma versão simplificada do dashboard com elementos estáticos.
              </p>
              <p className="text-muted-foreground mb-4">
                Tente selecionar este texto ou os cards acima usando o Visual Editor.
              </p>
              <button className="bg-accent text-accent-foreground px-4 py-2 rounded-md hover:bg-accent/90">
                Botão de Teste
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

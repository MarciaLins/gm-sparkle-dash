import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface MakeWebhook {
  id: string;
  nome: string;
  evento: string;
  webhook_url: string;
  ativo: boolean;
  user_id: string;
  created_at: string;
  ultima_execucao: string | null;
  total_execucoes: number;
}

const Configuracoes = () => {
  const { toast } = useToast();

  // Dados mockados até a migração ser executada
  const webhooks: MakeWebhook[] = [
    {
      id: '1',
      nome: 'Webhook Make Principal',
      evento: 'nova_transacao',
      webhook_url: 'https://hook.us2.make.com/w9x6b127jopvrsyudcvj5ohydiktbkgt',
      ativo: true,
      user_id: '1',
      created_at: new Date().toISOString(),
      ultima_execucao: null,
      total_execucoes: 0
    },
    {
      id: '2',
      nome: 'Webhook Make Principal',
      evento: 'proposta_aprovada',
      webhook_url: 'https://hook.us2.make.com/w9x6b127jopvrsyudcvj5ohydiktbkgt',
      ativo: true,
      user_id: '1',
      created_at: new Date().toISOString(),
      ultima_execucao: null,
      total_execucoes: 0
    },
    {
      id: '3',
      nome: 'Webhook Make Principal',
      evento: 'proposta_recusada',
      webhook_url: 'https://hook.us2.make.com/w9x6b127jopvrsyudcvj5ohydiktbkgt',
      ativo: true,
      user_id: '1',
      created_at: new Date().toISOString(),
      ultima_execucao: null,
      total_execucoes: 0
    }
  ];

  const handleSave = () => {
    toast({
      title: "Configurações salvas!",
      description: "Suas regras de negócio foram atualizadas com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-2">Configure as regras de negócio do sistema</p>
        </header>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custos Operacionais</CardTitle>
              <CardDescription>Defina os custos padrão para cálculos automáticos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custo-km">Custo por KM (Deslocamento)</Label>
                <Input 
                  id="custo-km" 
                  placeholder="R$ 0,00" 
                  defaultValue="R$ 2,50"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Valor cobrado por quilômetro rodado
                </p>
              </div>

              <div>
                <Label htmlFor="custo-hospedagem">Custo Médio de Hotel/Alimentação</Label>
                <Input 
                  id="custo-hospedagem" 
                  placeholder="R$ 0,00"
                  defaultValue="R$ 350,00"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Valor estimado por dia de hospedagem e alimentação
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Margem de Lucro</CardTitle>
              <CardDescription>Configure sua meta de lucratividade</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="margem-lucro">Meta de Margem de Lucro (%)</Label>
                <Input 
                  id="margem-lucro" 
                  type="number"
                  placeholder="0"
                  defaultValue="30"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Percentual desejado de lucro sobre os custos totais
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Integração com Make</CardTitle>
                  <CardDescription>Automatize workflows com webhooks</CardDescription>
                </div>
                {webhooks && webhooks.length > 0 && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    {webhooks.filter(w => w.ativo).length} Ativo(s)
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">Webhook URL Configurado</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono break-all">
                  https://hook.us2.make.com/w9x6b127jopvrsyudcvj5ohydiktbkgt
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Eventos Ativos</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['nova_transacao', 'proposta_aprovada', 'proposta_recusada', 'novo_cliente', 'novo_lead'].map((evento) => {
                    const webhook = webhooks?.find(w => w.evento === evento);
                    return (
                      <div key={evento} className="flex items-center gap-2 text-sm">
                        <div className={`h-2 w-2 rounded-full ${webhook?.ativo ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-muted-foreground">
                          {evento.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {webhooks && webhooks.length > 0 && (
                <div className="rounded-lg border border-border p-3 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Estatísticas</p>
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">
                      {webhooks.reduce((sum, w) => sum + (w.total_execucoes || 0), 0)}
                    </span>
                    {' '}webhooks enviados
                  </p>
                </div>
              )}

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('https://www.make.com/en/integrations/webhooks', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Como configurar no Make
              </Button>
            </CardContent>
          </Card>

          <Button 
            onClick={handleSave}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Salvar Configurações
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Configuracoes;

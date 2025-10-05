import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Configuracoes = () => {
  const { toast } = useToast();

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

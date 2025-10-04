import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const propostaSchema = z.object({
  nomeEvento: z.string().trim().min(1, "Nome do evento é obrigatório").max(200),
  dataEvento: z.string().min(1, "Data do evento é obrigatória"),
  localEvento: z.string().trim().min(1, "Local do evento é obrigatório").max(300),
  valorFinal: z.number().positive("Valor deve ser positivo"),
  valorMinimo: z.number().positive("Valor deve ser positivo"),
});

const AprovacaoProposta = () => {
  const [nomeEvento, setNomeEvento] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [localEvento, setLocalEvento] = useState("");
  const [valorFinal, setValorFinal] = useState("");
  const [valorMinimo, setValorMinimo] = useState("");
  const [analiseIA, setAnaliseIA] = useState("");
  const [lucroLiquido, setLucroLiquido] = useState("");
  const [margemLucro, setMargemLucro] = useState("");
  const { toast } = useToast();

  const handleAprovar = () => {
    const validation = propostaSchema.safeParse({
      nomeEvento,
      dataEvento,
      localEvento,
      valorFinal: parseFloat(valorFinal),
      valorMinimo: parseFloat(valorMinimo),
    });

    if (!validation.success) {
      toast({
        title: "Erro de validação",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    console.log("Proposta aprovada", validation.data);
    toast({ title: "Proposta aprovada com sucesso!" });
  };

  const handleRecusar = () => {
    console.log("Proposta recusada");
    toast({ title: "Proposta recusada" });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
                Proposta Pendente
              </span>
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8 space-y-6">
          {/* Detalhes do Evento */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Detalhes do Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nomeEvento" className="text-muted-foreground">Nome do Evento</Label>
                <Input
                  id="nomeEvento"
                  value={nomeEvento}
                  onChange={(e) => setNomeEvento(e.target.value)}
                  placeholder="Nome do evento"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="dataEvento" className="text-muted-foreground">Data</Label>
                <Input
                  id="dataEvento"
                  type="date"
                  value={dataEvento}
                  onChange={(e) => setDataEvento(e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="localEvento" className="text-muted-foreground">Local</Label>
                <Input
                  id="localEvento"
                  value={localEvento}
                  onChange={(e) => setLocalEvento(e.target.value)}
                  placeholder="Local do evento"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {/* Definição de Valores */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Definição de Valores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="valorFinal" className="text-muted-foreground">Valor Final da Proposta</Label>
                <Input
                  id="valorFinal"
                  type="number"
                  value={valorFinal}
                  onChange={(e) => setValorFinal(e.target.value)}
                  placeholder="0,00"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="valorMinimo" className="text-muted-foreground">Valor Mínimo para Negociação</Label>
                <Input
                  id="valorMinimo"
                  type="number"
                  value={valorMinimo}
                  onChange={(e) => setValorMinimo(e.target.value)}
                  placeholder="0,00"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {/* Análise Estratégica da Sofia */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Análise Estratégica da Sofia</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={analiseIA}
                onChange={(e) => setAnaliseIA(e.target.value)}
                placeholder="A análise da Sofia aparecerá aqui..."
                className="min-h-[150px] bg-background border-border text-foreground"
                readOnly
              />
            </CardContent>
          </Card>

          {/* Simulação de Lucro */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Simulação de Lucro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="lucroLiquido" className="text-muted-foreground">Lucro Líquido Estimado</Label>
                <Input
                  id="lucroLiquido"
                  value={lucroLiquido}
                  onChange={(e) => setLucroLiquido(e.target.value)}
                  placeholder="R$ 0,00"
                  className="bg-background border-border text-foreground"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="margemLucro" className="text-muted-foreground">Margem de Lucro (%)</Label>
                <Input
                  id="margemLucro"
                  value={margemLucro}
                  onChange={(e) => setMargemLucro(e.target.value)}
                  placeholder="0%"
                  className="bg-background border-border text-foreground"
                  readOnly
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={handleRecusar}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Recusar Proposta
            </Button>
            <Button
              onClick={handleAprovar}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Aprovar e Enviar Proposta
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AprovacaoProposta;

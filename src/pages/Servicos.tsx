import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useState } from "react";

const Servicos = () => {
  const [editingId, setEditingId] = useState<number | null>(null);

  // Mock data - substituir por dados reais do Supabase
  const [servicos, setServicos] = useState([
    { id: 1, nome: "Fotografia de Casamento", preco_base: "R$ 3.500,00", descricao: "Cobertura completa do evento" },
    { id: 2, nome: "Vídeo Institucional", preco_base: "R$ 2.800,00", descricao: "Produção audiovisual profissional" },
    { id: 3, nome: "Formatura", preco_base: "R$ 2.200,00", descricao: "Cobertura fotográfica e vídeo" },
    { id: 4, nome: "Ensaio Fotográfico", preco_base: "R$ 800,00", descricao: "Sessão de fotos externa ou estúdio" },
  ]);

  return (
    <Layout>
      <div className="container mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Meus Serviços</h1>
          <p className="text-muted-foreground mt-2">Gerencie seu catálogo de serviços</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicos.map((servico) => (
            <Card key={servico.id} className="hover:border-accent/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">{servico.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                {editingId === servico.id ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`nome-${servico.id}`}>Nome do Serviço</Label>
                      <Input id={`nome-${servico.id}`} defaultValue={servico.nome} />
                    </div>
                    <div>
                      <Label htmlFor={`preco-${servico.id}`}>Preço Base</Label>
                      <Input id={`preco-${servico.id}`} defaultValue={servico.preco_base} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-accent">{servico.preco_base}</p>
                    <p className="text-sm text-muted-foreground">{servico.descricao}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {editingId === servico.id ? (
                  <div className="flex gap-2 w-full">
                    <Button
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                      onClick={() => setEditingId(null)}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setEditingId(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setEditingId(servico.id)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Servicos;

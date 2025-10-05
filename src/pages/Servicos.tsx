import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Servicos = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editPreco, setEditPreco] = useState("");
  const queryClient = useQueryClient();

  const { data: servicos } = useQuery({
    queryKey: ['servicos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const updateServico = useMutation({
    mutationFn: async ({ id, nome, preco }: { id: number; nome: string; preco: number }) => {
      const { error } = await supabase
        .from('servicos')
        .update({ nome_servico: nome, preco_base: preco })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
      toast({ title: "Serviço atualizado com sucesso!" });
      setEditingId(null);
    },
    onError: () => {
      toast({ title: "Erro ao atualizar serviço", variant: "destructive" });
    }
  });

  const handleEdit = (servico: any) => {
    setEditingId(servico.id);
    setEditNome(servico.nome_servico);
    setEditPreco(servico.preco_base.toString());
  };

  const handleSave = (id: number) => {
    if (!editNome || !editPreco) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    const precoNumerico = parseFloat(editPreco.replace(/[^\d,]/g, '').replace(',', '.'));
    
    updateServico.mutate({
      id,
      nome: editNome,
      preco: precoNumerico
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Meus Serviços</h1>
          <p className="text-muted-foreground mt-2">Gerencie seu catálogo de serviços</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicos && servicos.length > 0 ? (
            servicos.map((servico) => (
              <Card key={servico.id} className="hover:border-accent/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{servico.nome_servico}</CardTitle>
                </CardHeader>
                <CardContent>
                  {editingId === servico.id ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`nome-${servico.id}`}>Nome do Serviço</Label>
                        <Input 
                          id={`nome-${servico.id}`} 
                          value={editNome}
                          onChange={(e) => setEditNome(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`preco-${servico.id}`}>Preço Base</Label>
                        <Input 
                          id={`preco-${servico.id}`} 
                          value={editPreco}
                          onChange={(e) => setEditPreco(e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-accent">
                        R$ {Number(servico.preco_base).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {editingId === servico.id ? (
                    <div className="flex gap-2 w-full">
                      <Button
                        className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                        onClick={() => handleSave(servico.id)}
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
                      onClick={() => handleEdit(servico)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-8">Nenhum serviço cadastrado</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Servicos;

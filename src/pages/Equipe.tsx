import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const membroSchema = z.object({
  nome_membro: z.string().trim().min(1, "Nome é obrigatório").max(100),
  funcao_membro: z.string().trim().min(1, "Função é obrigatória").max(100),
  valor_pagamento: z.number().positive("Valor deve ser positivo"),
});

const Equipe = () => {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [funcao, setFuncao] = useState("");
  const [valor, setValor] = useState("");
  const queryClient = useQueryClient();

  const { data: equipe } = useQuery({
    queryKey: ['equipe'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipe')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const addMembro = useMutation({
    mutationFn: async (novoMembro: { nome_membro: string; funcao_membro: string; valor_pagamento: number }) => {
      const { error } = await supabase
        .from('equipe')
        .insert([novoMembro]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipe'] });
      toast({ title: "Membro adicionado com sucesso!" });
      setOpen(false);
      setNome("");
      setFuncao("");
      setValor("");
    },
    onError: () => {
      toast({ title: "Erro ao adicionar membro", variant: "destructive" });
    }
  });

  const handleSave = () => {
    const valorNumerico = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));
    
    const validation = membroSchema.safeParse({
      nome_membro: nome,
      funcao_membro: funcao,
      valor_pagamento: valorNumerico,
    });

    if (!validation.success) {
      toast({ 
        title: "Erro de validação", 
        description: validation.error.errors[0].message,
        variant: "destructive" 
      });
      return;
    }
    
    addMembro.mutate({
      nome_membro: validation.data.nome_membro,
      funcao_membro: validation.data.funcao_membro,
      valor_pagamento: validation.data.valor_pagamento
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Minha Equipe</h1>
            <p className="text-muted-foreground mt-2">Gerencie os membros da sua equipe</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Novo Membro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Membro</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input 
                    id="nome" 
                    placeholder="Nome do membro" 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="funcao">Função</Label>
                  <Input 
                    id="funcao" 
                    placeholder="Ex: Fotógrafo, Cinegrafista" 
                    value={funcao}
                    onChange={(e) => setFuncao(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="valor">Valor Padrão</Label>
                  <Input 
                    id="valor" 
                    placeholder="R$ 0,00" 
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleSave}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Salvar Membro
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Membros da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Valor Padrão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipe && equipe.length > 0 ? (
                  equipe.map((membro) => (
                    <TableRow key={membro.id}>
                      <TableCell className="font-medium">{membro.nome_membro}</TableCell>
                      <TableCell>{membro.funcao_membro}</TableCell>
                      <TableCell>R$ {Number(membro.valor_pagamento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Nenhum membro cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Equipe;

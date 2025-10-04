import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingDown, TrendingUp, Plus } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { z } from "zod";

const transacaoSchema = z.object({
  descricao: z.string().trim().min(1, "Descrição é obrigatória").max(200),
  valor: z.number().positive("Valor deve ser positivo"),
  tipo: z.enum(['receita', 'despesa'], { errorMap: () => ({ message: "Tipo deve ser receita ou despesa" }) }),
});

const Financeiro = () => {
  const [open, setOpen] = useState(false);
  const [mesFilter, setMesFilter] = useState("todos");
  const [categoriaFilter, setCategoriaFilter] = useState("todos");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("");
  const queryClient = useQueryClient();

  const { data: transacoes } = useQuery({
    queryKey: ['financeiro', mesFilter, categoriaFilter],
    queryFn: async () => {
      let query = supabase
        .from('financeiro')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (categoriaFilter !== 'todos') {
        query = query.eq('tipo', categoriaFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  const addTransacao = useMutation({
    mutationFn: async (novaTransacao: { descricao: string; valor: number; tipo: string; categoria: string }) => {
      const { error } = await supabase
        .from('financeiro')
        .insert([novaTransacao]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeiro'] });
      queryClient.invalidateQueries({ queryKey: ['financeiro-dashboard'] });
      toast({ title: "Transação adicionada com sucesso!" });
      setOpen(false);
      setDescricao("");
      setValor("");
      setTipo("");
    },
    onError: () => {
      toast({ title: "Erro ao adicionar transação", variant: "destructive" });
    }
  });

  const handleSave = () => {
    const valorNumerico = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));
    
    const validation = transacaoSchema.safeParse({
      descricao,
      valor: valorNumerico,
      tipo: tipo as 'receita' | 'despesa',
    });

    if (!validation.success) {
      toast({ 
        title: "Erro de validação", 
        description: validation.error.errors[0].message,
        variant: "destructive" 
      });
      return;
    }
    
    addTransacao.mutate({
      descricao: validation.data.descricao,
      valor: validation.data.valor,
      tipo: validation.data.tipo,
      categoria: validation.data.tipo === 'receita' ? 'Receita' : 'Despesa'
    });
  };

  const receitaTotal = transacoes
    ?.filter(t => t.tipo === 'receita')
    .reduce((sum, t) => sum + (Number(t.valor) || 0), 0) || 0;

  const despesaTotal = transacoes
    ?.filter(t => t.tipo === 'despesa')
    .reduce((sum, t) => sum + (Number(t.valor) || 0), 0) || 0;

  const lucroTotal = receitaTotal - despesaTotal;

  return (
    <Layout>
      <div className="container mx-auto p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meu Financeiro</h1>
            <p className="text-muted-foreground mt-2">Controle suas finanças</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Receita Total (Ano)"
            value={`R$ ${receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={TrendingUp}
          />
          <MetricCard
            title="Despesa Total (Ano)"
            value={`R$ ${despesaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={TrendingDown}
          />
          <MetricCard
            title="Lucro Líquido (Ano)"
            value={`R$ ${lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Transações</CardTitle>
              <div className="flex gap-4">
                <Select value={mesFilter} onValueChange={setMesFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="01">Janeiro</SelectItem>
                    <SelectItem value="02">Fevereiro</SelectItem>
                    <SelectItem value="03">Março</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Despesa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Transação</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="descricao">Descrição</Label>
                        <Input 
                          id="descricao" 
                          placeholder="Descrição da transação" 
                          value={descricao}
                          onChange={(e) => setDescricao(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="valor">Valor</Label>
                        <Input 
                          id="valor" 
                          placeholder="R$ 0,00" 
                          value={valor}
                          onChange={(e) => setValor(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo">Tipo</Label>
                        <Select value={tipo} onValueChange={setTipo}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="receita">Receita</SelectItem>
                            <SelectItem value="despesa">Despesa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleSave}
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        Salvar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoes && transacoes.length > 0 ? (
                  transacoes.map((transacao) => (
                    <TableRow key={transacao.id}>
                      <TableCell>{format(new Date(transacao.created_at), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="font-medium">{transacao.descricao}</TableCell>
                      <TableCell>{transacao.categoria}</TableCell>
                      <TableCell className={`text-right font-semibold ${transacao.tipo === 'receita' ? 'text-green-500' : 'text-red-500'}`}>
                        R$ {Number(transacao.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Nenhuma transação encontrada
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

export default Financeiro;

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

const Financeiro = () => {
  const [open, setOpen] = useState(false);
  const [mesFilter, setMesFilter] = useState("todos");
  const [categoriaFilter, setCategoriaFilter] = useState("todos");

  // Mock data - substituir por dados reais do Supabase
  const transacoes = [
    { id: 1, data: "2025-01-15", descricao: "Casamento Silva", categoria: "Receita", valor: "R$ 5.000,00", tipo: "receita" },
    { id: 2, data: "2025-01-20", descricao: "Equipamento Fotográfico", categoria: "Despesa", valor: "R$ 1.200,00", tipo: "despesa" },
    { id: 3, data: "2025-02-05", descricao: "Formatura", categoria: "Receita", valor: "R$ 3.500,00", tipo: "receita" },
  ];

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
            value="R$ 285.600"
            icon={TrendingUp}
          />
          <MetricCard
            title="Despesa Total (Ano)"
            value="R$ 142.800"
            icon={TrendingDown}
          />
          <MetricCard
            title="Lucro Líquido (Ano)"
            value="R$ 142.800"
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
                        <Input id="descricao" placeholder="Descrição da transação" />
                      </div>
                      <div>
                        <Label htmlFor="valor">Valor</Label>
                        <Input id="valor" placeholder="R$ 0,00" />
                      </div>
                      <div>
                        <Label htmlFor="tipo">Tipo</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="receita">Receita</SelectItem>
                            <SelectItem value="despesa">Despesa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
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
                {transacoes.map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell>{transacao.data}</TableCell>
                    <TableCell className="font-medium">{transacao.descricao}</TableCell>
                    <TableCell>{transacao.categoria}</TableCell>
                    <TableCell className={`text-right font-semibold ${transacao.tipo === 'receita' ? 'text-green-500' : 'text-red-500'}`}>
                      {transacao.valor}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Financeiro;

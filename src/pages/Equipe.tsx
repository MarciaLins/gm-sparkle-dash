import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useState } from "react";

const Equipe = () => {
  const [open, setOpen] = useState(false);

  // Mock data - substituir por dados reais do Supabase
  const equipe = [
    { id: 1, nome: "Pedro Fotógrafo", funcao: "Fotógrafo Principal", valor_padrao: "R$ 800,00" },
    { id: 2, nome: "Ana Videomaker", funcao: "Cinegrafista", valor_padrao: "R$ 900,00" },
    { id: 3, nome: "Lucas Drone", funcao: "Operador de Drone", valor_padrao: "R$ 600,00" },
  ];

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
                  <Input id="nome" placeholder="Nome do membro" />
                </div>
                <div>
                  <Label htmlFor="funcao">Função</Label>
                  <Input id="funcao" placeholder="Ex: Fotógrafo, Cinegrafista" />
                </div>
                <div>
                  <Label htmlFor="valor">Valor Padrão</Label>
                  <Input id="valor" placeholder="R$ 0,00" />
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
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
                {equipe.map((membro) => (
                  <TableRow key={membro.id}>
                    <TableCell className="font-medium">{membro.nome}</TableCell>
                    <TableCell>{membro.funcao}</TableCell>
                    <TableCell>{membro.valor_padrao}</TableCell>
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

export default Equipe;

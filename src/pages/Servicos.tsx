import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ChatPanel } from "@/components/ChatPanel";
import { Pencil, MessageCircle, Check, X } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Pacote {
  id: number;
  nome: string;
  descricao: string;
  preco_base: number;
  preco_tipo: 'fixo' | 'a_partir';
  categoria: string | null;
  detalhes: string[];
  ordem_exibicao: number;
  ativo: boolean;
}

const Servicos = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    nome: "",
    descricao: "",
    preco_base: "",
    categoria: "",
  });
  const [selectedPacoteForChat, setSelectedPacoteForChat] = useState<Pacote | null>(null);
  const queryClient = useQueryClient();

  const { data: pacotes, isLoading } = useQuery({
    queryKey: ['pacotes_servicos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pacotes_servicos')
        .select('*')
        .eq('ativo', true)
        .order('ordem_exibicao', { ascending: true });
      
      if (error) throw error;
      return data as Pacote[];
    }
  });

  const updatePacote = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Pacote> & { id: number }) => {
      const { error } = await supabase
        .from('pacotes_servicos')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacotes_servicos'] });
      toast({ title: "Pacote atualizado com sucesso!" });
      setEditingId(null);
    },
    onError: () => {
      toast({ title: "Erro ao atualizar pacote", variant: "destructive" });
    }
  });

  const handleStartEdit = (pacote: Pacote) => {
    setEditingId(pacote.id);
    setEditForm({
      nome: pacote.nome,
      descricao: pacote.descricao,
      preco_base: pacote.preco_base.toString(),
      categoria: pacote.categoria || "",
    });
  };

  const handleSaveEdit = () => {
    if (!editingId || !editForm.nome || !editForm.preco_base) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    const precoNumerico = parseFloat(editForm.preco_base.replace(/[^\d,]/g, '').replace(',', '.'));
    
    updatePacote.mutate({
      id: editingId,
      nome: editForm.nome,
      descricao: editForm.descricao,
      preco_base: precoNumerico,
      categoria: editForm.categoria,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ nome: "", descricao: "", preco_base: "", categoria: "" });
  };

  const handleAskSofia = (pacote: Pacote) => {
    setSelectedPacoteForChat(pacote);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Meus Pacotes de Serviços</h1>
          <p className="text-muted-foreground mt-2">Gerencie seus pacotes e converse com Sofia sobre orçamentos</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Coluna de Pacotes - 70% */}
          <div className="flex-1 lg:w-[70%]">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando pacotes...</p>
              </div>
            ) : pacotes && pacotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pacotes.map((pacote) => (
                  <Card key={pacote.id} className="hover:border-accent/50 transition-all duration-300 flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{pacote.nome}</CardTitle>
                          {pacote.categoria && (
                            <Badge variant="secondary" className="mb-2">{pacote.categoria}</Badge>
                          )}
                        </div>
                        <Badge variant={pacote.preco_tipo === 'fixo' ? 'default' : 'outline'}>
                          {pacote.preco_tipo === 'fixo' ? 'Preço Fixo' : 'A partir de'}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <p className="text-muted-foreground mb-4">{pacote.descricao}</p>
                      
                      <div className="mb-4">
                        <p className="text-3xl font-bold text-accent">
                          {pacote.preco_tipo === 'a_partir' && 'A partir de '}
                          R$ {Number(pacote.preco_base).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      {pacote.detalhes && pacote.detalhes.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-semibold text-sm">Inclui:</p>
                          <ul className="text-sm space-y-1">
                            {pacote.detalhes.map((detalhe, idx) => (
                              <li key={idx} className="flex items-start">
                                <Check className="h-4 w-4 mr-2 mt-0.5 text-accent flex-shrink-0" />
                                <span className="text-muted-foreground">{detalhe}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex gap-2 pt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleStartEdit(pacote)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Editar Pacote</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="nome">Nome do Pacote</Label>
                              <Input
                                id="nome"
                                value={editForm.nome}
                                onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="categoria">Categoria</Label>
                              <Input
                                id="categoria"
                                value={editForm.categoria}
                                onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="descricao">Descrição</Label>
                              <Textarea
                                id="descricao"
                                value={editForm.descricao}
                                onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="preco">Preço Base</Label>
                              <Input
                                id="preco"
                                value={editForm.preco_base}
                                onChange={(e) => setEditForm({ ...editForm, preco_base: e.target.value })}
                                placeholder="0,00"
                              />
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Button onClick={handleSaveEdit} className="flex-1">
                                <Check className="h-4 w-4 mr-2" />
                                Salvar
                              </Button>
                              <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        className="flex-1"
                        onClick={() => handleAskSofia(pacote)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Perguntar à Sofia
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Nenhum pacote cadastrado</p>
              </Card>
            )}
          </div>

          {/* Coluna do Chat - 30% */}
          <div className="lg:w-[30%] lg:sticky lg:top-4 lg:h-[calc(100vh-8rem)]">
            <ChatPanel 
              initialMessage={
                selectedPacoteForChat 
                  ? `Gostaria de saber mais sobre o pacote "${selectedPacoteForChat.nome}" (${selectedPacoteForChat.preco_tipo === 'fixo' ? 'R$ ' + selectedPacoteForChat.preco_base.toFixed(2) : 'a partir de R$ ' + selectedPacoteForChat.preco_base.toFixed(2)})`
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Servicos;

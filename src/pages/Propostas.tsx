import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Check, X } from "lucide-react";

interface Proposta {
  id: number;
  created_at: string;
  nome_cliente: string;
  email_cliente: string;
  telefone_cliente?: string;
  tipo_evento: string;
  data_evento?: string;
  local_evento?: string;
  valor_proposta?: number;
  observacoes?: string;
  status: string;
}

const Propostas = () => {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setSession(session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: propostas, isLoading } = useQuery({
    queryKey: ["propostas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("propostas")
        .select("*")
        .eq("status", "Pendente")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Proposta[];
    },
    enabled: !!session,
  });

  const handleUpdateStatus = async (id: number, novoStatus: "Aprovado" | "Recusado") => {
    try {
      const { error } = await supabase
        .from("propostas")
        .update({ status: novoStatus })
        .eq("id", id);

      if (error) throw error;

      // Se aprovado, enviar ID para o webhook do Make.com
      if (novoStatus === "Aprovado") {
        try {
          await fetch("https://hook.us2.make.com/q9j4itjdinh8etuqontbz7yewcom5rzv", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ proposta_id: id }),
          });
        } catch (webhookError) {
          console.error("Erro ao enviar para webhook:", webhookError);
        }
      }

      toast({
        title: `Proposta ${novoStatus.toLowerCase()}!`,
        description: "O status foi atualizado com sucesso.",
      });

      // Atualizar a lista
      queryClient.invalidateQueries({ queryKey: ["propostas"] });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar proposta",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Propostas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as propostas enviadas pela Sofia
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : propostas && propostas.length > 0 ? (
          <div className="grid gap-4">
            {propostas.map((proposta) => (
              <Card key={proposta.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{proposta.nome_cliente}</CardTitle>
                      <CardDescription>
                        {proposta.tipo_evento} • {proposta.email_cliente}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{proposta.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {proposta.telefone_cliente && (
                      <div>
                        <span className="text-muted-foreground">Telefone:</span>
                        <p className="font-medium">{proposta.telefone_cliente}</p>
                      </div>
                    )}
                    {proposta.data_evento && (
                      <div>
                        <span className="text-muted-foreground">Data do Evento:</span>
                        <p className="font-medium">
                          {new Date(proposta.data_evento).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    )}
                    {proposta.local_evento && (
                      <div>
                        <span className="text-muted-foreground">Local:</span>
                        <p className="font-medium">{proposta.local_evento}</p>
                      </div>
                    )}
                    {proposta.valor_proposta && (
                      <div>
                        <span className="text-muted-foreground">Valor Proposto:</span>
                        <p className="font-medium">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(Number(proposta.valor_proposta))}
                        </p>
                      </div>
                    )}
                  </div>

                  {proposta.observacoes && (
                    <div>
                      <span className="text-sm text-muted-foreground">Observações:</span>
                      <p className="text-sm mt-1">{proposta.observacoes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => handleUpdateStatus(proposta.id, "Aprovado")}
                      className="flex-1"
                      variant="default"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Aprovar
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(proposta.id, "Recusado")}
                      className="flex-1"
                      variant="destructive"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Recusar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">
                Não há propostas pendentes no momento.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Propostas;

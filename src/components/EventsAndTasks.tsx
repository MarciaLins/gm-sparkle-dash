import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const tasks = [
  { id: 1, title: "Confirmar buffet para evento Silva", completed: false, priority: "Alta" },
  { id: 2, title: "Enviar proposta para novo cliente", completed: false, priority: "Alta" },
  { id: 3, title: "Revisar contratos da semana", completed: true, priority: "Média" },
  { id: 4, title: "Agendar reunião com fornecedores", completed: false, priority: "Média" },
  { id: 5, title: "Atualizar portfolio no site", completed: true, priority: "Baixa" },
];

export const EventsAndTasks = () => {
  const { data: eventos } = useQuery({
    queryKey: ['eventos-proximos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .gte('data_inicio', new Date().toISOString())
        .order('data_inicio', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="events" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Próximos Eventos
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Minhas Tarefas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="mt-6 space-y-4">
            {eventos && eventos.length > 0 ? (
              eventos.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 border border-border hover:border-accent/50 transition-all duration-300"
                >
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-foreground">{event.nome_evento}</h4>
                      <Badge
                        variant={event.status_evento === "Confirmado" ? "default" : "secondary"}
                        className={event.status_evento === "Confirmado" ? "bg-accent text-accent-foreground" : ""}
                      >
                        {event.status_evento || "Pendente"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.data_inicio && format(new Date(event.data_inicio), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                    <p className="text-sm text-muted-foreground">{event.local_evento}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">Nenhum evento próximo</p>
            )}
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-6 space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border hover:border-accent/50 transition-all duration-300"
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      task.completed ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    task.priority === "Alta"
                      ? "border-red-500/50 text-red-500"
                      : task.priority === "Média"
                      ? "border-amber-500/50 text-amber-500"
                      : "border-blue-500/50 text-blue-500"
                  }
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

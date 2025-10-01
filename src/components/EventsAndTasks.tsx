import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const events = [
  {
    id: 1,
    title: "Casamento Silva & Santos",
    date: "15 Nov 2025",
    time: "18:00",
    location: "Espaço Natureza",
    status: "Confirmado",
  },
  {
    id: 2,
    title: "Festa Corporativa Tech",
    date: "22 Nov 2025",
    time: "20:00",
    location: "Hotel Premium",
    status: "Pendente",
  },
  {
    id: 3,
    title: "Aniversário 15 Anos",
    date: "30 Nov 2025",
    time: "19:00",
    location: "Chácara Feliz",
    status: "Confirmado",
  },
];

const tasks = [
  { id: 1, title: "Confirmar buffet para evento Silva", completed: false, priority: "Alta" },
  { id: 2, title: "Enviar proposta para novo cliente", completed: false, priority: "Alta" },
  { id: 3, title: "Revisar contratos da semana", completed: true, priority: "Média" },
  { id: 4, title: "Agendar reunião com fornecedores", completed: false, priority: "Média" },
  { id: 5, title: "Atualizar portfolio no site", completed: true, priority: "Baixa" },
];

export const EventsAndTasks = () => {
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
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50 border border-border hover:border-accent/50 transition-all duration-300"
              >
                <div className="p-2 rounded-lg bg-accent/10">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-foreground">{event.title}</h4>
                    <Badge
                      variant={event.status === "Confirmado" ? "default" : "secondary"}
                      className={event.status === "Confirmado" ? "bg-accent text-accent-foreground" : ""}
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.date} às {event.time}
                  </p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            ))}
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

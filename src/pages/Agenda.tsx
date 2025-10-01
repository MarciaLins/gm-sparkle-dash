import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const Agenda = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Mock events - substituir por dados reais do Supabase
  const events = [
    { id: 1, title: "Casamento Silva", date: "2025-10-15", time: "18:00", location: "Espaço Garden" },
    { id: 2, title: "Formatura Medicina", date: "2025-10-20", time: "20:00", location: "Hotel Imperial" },
  ];

  return (
    <Layout>
      <div className="container mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Minha Agenda</h1>
          <p className="text-muted-foreground mt-2">Gerencie seus eventos e compromissos</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="p-4 border border-border rounded-lg hover:border-accent/50 cursor-pointer transition-all duration-300"
                    >
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.date} às {event.time}
                      </p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <Sheet open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{selectedEvent?.title}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium">{selectedEvent?.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horário</p>
                <p className="font-medium">{selectedEvent?.time}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Local</p>
                <p className="font-medium">{selectedEvent?.location}</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
};

export default Agenda;

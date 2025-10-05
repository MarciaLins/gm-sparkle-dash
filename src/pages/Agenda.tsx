import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays } from "lucide-react";

interface EventoAgenda {
  id: string | number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'evento' | 'feriado';
  status?: string;
  feriadoType?: string;
}

// Feriados Nacionais 2025
const feriadosNacionais2025 = [
  { date: new Date(2025, 0, 1), name: "Ano Novo", type: "Nacional" },
  { date: new Date(2025, 2, 4), name: "Carnaval", type: "Nacional" },
  { date: new Date(2025, 3, 18), name: "Sexta-feira Santa", type: "Nacional" },
  { date: new Date(2025, 3, 21), name: "Tiradentes", type: "Nacional" },
  { date: new Date(2025, 4, 1), name: "Dia do Trabalho", type: "Nacional" },
  { date: new Date(2025, 5, 19), name: "Corpus Christi", type: "Nacional" },
  { date: new Date(2025, 8, 7), name: "Independência do Brasil", type: "Nacional" },
  { date: new Date(2025, 9, 12), name: "Nossa Senhora Aparecida", type: "Nacional" },
  { date: new Date(2025, 10, 2), name: "Finados", type: "Nacional" },
  { date: new Date(2025, 10, 15), name: "Proclamação da República", type: "Nacional" },
  { date: new Date(2025, 10, 20), name: "Dia da Consciência Negra", type: "Nacional" },
  { date: new Date(2025, 11, 25), name: "Natal", type: "Nacional" },
];

// Feriados Estaduais de Pernambuco 2025
const feriadosEstaduaisPE2025 = [
  { date: new Date(2025, 2, 6), name: "Revolução Pernambucana de 1817", type: "Estadual PE" },
  { date: new Date(2025, 5, 24), name: "São João (Pernambuco)", type: "Estadual PE" },
];

// Feriados Municipais de Pernambuco 2025 (principais cidades)
const feriadosMunicipaisPE2025 = [
  // Recife
  { date: new Date(2025, 2, 12), name: "Aniversário de Recife", type: "Municipal - Recife" },
  { date: new Date(2025, 6, 16), name: "Nossa Senhora do Carmo", type: "Municipal - Recife" },
  
  // Olinda
  { date: new Date(2025, 2, 12), name: "Aniversário de Olinda", type: "Municipal - Olinda" },
  { date: new Date(2025, 10, 16), name: "São Bento", type: "Municipal - Olinda" },
  
  // Jaboatão dos Guararapes
  { date: new Date(2025, 7, 3), name: "Aniversário de Jaboatão", type: "Municipal - Jaboatão" },
  
  // Caruaru
  { date: new Date(2025, 4, 18), name: "Aniversário de Caruaru", type: "Municipal - Caruaru" },
  { date: new Date(2025, 5, 24), name: "São João (Caruaru)", type: "Municipal - Caruaru" },
  
  // Petrolina
  { date: new Date(2025, 6, 14), name: "Aniversário de Petrolina", type: "Municipal - Petrolina" },
  
  // Paulista
  { date: new Date(2025, 6, 28), name: "Aniversário de Paulista", type: "Municipal - Paulista" },
  
  // Cabo de Santo Agostinho
  { date: new Date(2025, 5, 29), name: "São Pedro", type: "Municipal - Cabo" },
  
  // Camaragibe
  { date: new Date(2025, 4, 14), name: "Aniversário de Camaragibe", type: "Municipal - Camaragibe" },
  
  // Garanhuns
  { date: new Date(2025, 8, 9), name: "Aniversário de Garanhuns", type: "Municipal - Garanhuns" },
  
  // Vitória de Santo Antão
  { date: new Date(2025, 5, 13), name: "Santo Antônio", type: "Municipal - Vitória SA" },
  
  // Igarassu
  { date: new Date(2025, 8, 27), name: "Aniversário de Igarassu", type: "Municipal - Igarassu" },
  
  // São Lourenço da Mata
  { date: new Date(2025, 7, 10), name: "São Lourenço", type: "Municipal - São Lourenço" },
  
  // Abreu e Lima
  { date: new Date(2025, 5, 27), name: "Aniversário de Abreu e Lima", type: "Municipal - Abreu e Lima" },
  
  // Santa Cruz do Capibaribe
  { date: new Date(2025, 5, 13), name: "Santo Antônio", type: "Municipal - Santa Cruz" },
  
  // Serra Talhada
  { date: new Date(2025, 7, 15), name: "Aniversário de Serra Talhada", type: "Municipal - Serra Talhada" },
  
  // Gravatá
  { date: new Date(2025, 9, 11), name: "Aniversário de Gravatá", type: "Municipal - Gravatá" },
  
  // Escada
  { date: new Date(2025, 7, 24), name: "Aniversário de Escada", type: "Municipal - Escada" },
  
  // Belo Jardim
  { date: new Date(2025, 4, 9), name: "Aniversário de Belo Jardim", type: "Municipal - Belo Jardim" },
  
  // Arcoverde
  { date: new Date(2025, 4, 13), name: "Aniversário de Arcoverde", type: "Municipal - Arcoverde" },
];

const todosFeriados2025 = [
  ...feriadosNacionais2025,
  ...feriadosEstaduaisPE2025,
  ...feriadosMunicipaisPE2025,
];

const Agenda = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventoAgenda | null>(null);

  // Buscar eventos do banco de dados
  const { data: eventosDB } = useQuery({
    queryKey: ['eventos-agenda'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('data_inicio', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Combinar eventos do banco com feriados
  const todosEventos = useMemo<EventoAgenda[]>(() => {
    const eventos: EventoAgenda[] = eventosDB?.map(e => {
      // Garantir que a data seja interpretada corretamente no fuso horário local
      const dataEvento = e.data_inicio ? new Date(e.data_inicio) : new Date();
      
      return {
        id: e.id,
        title: e.nome_evento || 'Evento',
        date: format(dataEvento, 'yyyy-MM-dd'),
        time: format(dataEvento, 'HH:mm'),
        location: e.local_evento || '',
        type: 'evento' as const,
        status: e.status_evento || undefined
      };
    }) || [];

    const feriados: EventoAgenda[] = todosFeriados2025.map((f, idx) => ({
      id: `feriado-${idx}`,
      title: f.name,
      date: format(f.date, 'yyyy-MM-dd'),
      time: 'Dia inteiro',
      location: '',
      type: 'feriado' as const,
      feriadoType: f.type
    }));

    return [...eventos, ...feriados].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [eventosDB]);

  // Filtrar eventos para a data selecionada
  const eventosDoDia = useMemo(() => {
    if (!date) return [];
    return todosEventos.filter(e => 
      isSameDay(new Date(e.date), date)
    );
  }, [date, todosEventos]);

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
                modifiers={{
                  feriado: todosFeriados2025.map(f => f.date),
                  evento: eventosDB?.map(e => e.data_inicio ? new Date(e.data_inicio) : new Date()) || []
                }}
                modifiersStyles={{
                  feriado: { 
                    backgroundColor: 'hsl(var(--destructive) / 0.1)',
                    color: 'hsl(var(--destructive))',
                    fontWeight: 'bold'
                  },
                  evento: {
                    backgroundColor: 'hsl(var(--accent) / 0.2)',
                    color: 'hsl(var(--accent-foreground))',
                    fontWeight: 'bold'
                  }
                }}
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'hsl(var(--accent) / 0.2)' }} />
                  <span className="text-muted-foreground">Eventos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'hsl(var(--destructive) / 0.1)' }} />
                  <span className="text-muted-foreground">Feriados</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                {date ? format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Próximos Eventos'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {date && eventosDoDia.length > 0 ? (
                  <div className="space-y-4">
                    {eventosDoDia.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="p-4 border border-border rounded-lg hover:border-accent/50 cursor-pointer transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{event.title}</h3>
                          {event.type === 'feriado' ? (
                            <Badge variant="destructive" className="text-xs">{event.feriadoType}</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">{event.status || 'Evento'}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.time}
                        </p>
                        {event.location && (
                          <p className="text-sm text-muted-foreground">{event.location}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : date ? (
                  <div className="text-center text-muted-foreground py-8">
                    <CalendarDays className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Nenhum evento nesta data</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todosEventos.slice(0, 10).map((event) => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="p-4 border border-border rounded-lg hover:border-accent/50 cursor-pointer transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{event.title}</h3>
                          {event.type === 'feriado' ? (
                            <Badge variant="destructive" className="text-xs">{event.feriadoType}</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">{event.status || 'Evento'}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.date} às {event.time}
                        </p>
                        {event.location && (
                          <p className="text-sm text-muted-foreground">{event.location}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <Sheet open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {selectedEvent?.title}
                {selectedEvent?.type === 'feriado' && (
                  <Badge variant="destructive" className="text-xs">{selectedEvent?.feriadoType}</Badge>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium">
                  {selectedEvent?.date && format(new Date(selectedEvent.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horário</p>
                <p className="font-medium">{selectedEvent?.time}</p>
              </div>
              {selectedEvent?.location && (
                <div>
                  <p className="text-sm text-muted-foreground">Local</p>
                  <p className="font-medium">{selectedEvent?.location}</p>
                </div>
              )}
              {selectedEvent?.status && (
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="secondary">{selectedEvent?.status}</Badge>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
};

export default Agenda;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Quote } from "lucide-react";
import logoFilipeLima from "@/assets/logo-filipe-lima.jpg";
import filipeLimaVideo from "@/assets/filipe-lima-video.mp4";

interface Message {
  id: number;
  text: string;
  sender: "user" | "sofia";
  timestamp: Date;
}

export default function Landing() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! Fico feliz com seu interesse. Para qual data e tipo de evento seria?",
      sender: "sofia",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInput("");

      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: "Entendi! Estou processando sua solicitação...",
          sender: "sofia",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <header className="bg-card border-b border-border py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <div className="w-16 h-16 rounded-lg overflow-hidden">
            <img 
              src={logoFilipeLima} 
              alt="Filipe Lima Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
              Filipe Lima
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Violinista | A Trilha Sonora Perfeita para o Seu Momento Inesquecível
            </p>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="py-20 px-4 md:px-8 bg-card">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
              Sobre Filipe Lima
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Com mais de 13 anos de experiência, Filipe Lima é um violinista renomado que já encantou
              milhares de pessoas em casamentos, eventos corporativos e apresentações especiais.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Sua versatilidade musical abrange desde o clássico erudito até músicas contemporâneas,
              sempre com a elegância e sensibilidade que transformam momentos em memórias inesquecíveis.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Cada apresentação é cuidadosamente personalizada para refletir a essência do seu evento,
              criando uma atmosfera única e sofisticada.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-[0_0_40px_rgba(252,211,77,0.2)]">
              <img
                src="https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80"
                alt="Filipe Lima Violinista"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
            O Que Dizem Nossos Clientes
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria & João",
                event: "Casamento",
                text: "O Filipe transformou nosso casamento em algo mágico. Cada nota tocada era perfeita e emocionante. Nossos convidados não param de elogiar!",
              },
              {
                name: "Ricardo Santos",
                event: "Evento Corporativo",
                text: "Profissionalismo exemplar. A apresentação do Filipe elevou o nível do nosso evento corporativo. Impecável do início ao fim.",
              },
              {
                name: "Ana Paula",
                event: "Aniversário",
                text: "Uma experiência inesquecível! O Filipe entendeu exatamente o que queríamos e entregou muito além das expectativas. Simplesmente perfeito!",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-[0_0_30px_rgba(252,211,77,0.15)] transition-all duration-300">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-accent mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-accent">{testimonial.event}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Chat Button */}
      <Button
        onClick={() => setChatOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-accent to-amber-400 hover:shadow-[0_0_40px_rgba(252,211,77,0.4)] transition-all duration-300 z-50"
      >
        <MessageCircle className="h-8 w-8 text-primary-foreground" />
      </Button>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 bg-card border-accent/20">
          <DialogHeader className="border-b border-border p-6">
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
              Sofia, assistente pessoal do Filipe Lima
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {message.timestamp.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border flex gap-2">
            <Input
              placeholder="Digite sua mensagem aqui..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="bg-secondary border-border"
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

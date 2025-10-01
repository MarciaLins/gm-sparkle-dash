import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Quote } from "lucide-react";
import logoFilipeLima from "@/assets/logo-filipe-lima.jpg";
import filipeLimaVideo from "@/assets/filipe-lima-video.mp4";
import filipeLimaPhoto from "@/assets/filipe-lima-photo.jpg";

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
      <header className="bg-card border-b border-border py-4 px-4 md:py-6 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3 md:gap-6">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={logoFilipeLima} 
              alt="Filipe Lima Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent truncate">
              Filipe Lima
            </h1>
            <p className="text-xs md:text-sm lg:text-base text-muted-foreground line-clamp-2">
              Violinista | A Trilha Sonora Perfeita para o Seu Momento Inesquecível
            </p>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="py-12 px-4 md:py-16 lg:py-20 md:px-8 bg-card">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <img 
                src={logoFilipeLima} 
                alt="Watermark" 
                className="w-full h-auto object-contain"
              />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent relative z-10">
              Sobre Filipe Lima
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-3 md:mb-4 relative z-10">
              Com mais de 13 anos de experiência, Filipe Lima é um violinista renomado que já encantou
              milhares de pessoas em casamentos, eventos corporativos e apresentações especiais.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-3 md:mb-4 relative z-10">
              Sua versatilidade musical abrange desde o clássico erudito até músicas contemporâneas,
              sempre com a elegância e sensibilidade que transformam momentos em memórias inesquecíveis.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed relative z-10">
              Cada apresentação é cuidadosamente personalizada para refletir a essência do seu evento,
              criando uma atmosfera única e sofisticada.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-[0_0_40px_rgba(252,211,77,0.2)]">
              <img
                src={filipeLimaPhoto}
                alt="Filipe Lima Violinista"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 px-4 md:py-16 lg:py-20 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 lg:mb-16 bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
            O Que Dizem Nossos Clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-3">
        <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg shadow-lg animate-fade-in hidden lg:block">
          <p className="text-sm font-medium whitespace-nowrap">Converse com a Sofia!</p>
        </div>
        <Button
          onClick={() => setChatOpen(true)}
          size="icon"
          className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full bg-gradient-to-r from-accent to-amber-400 hover:shadow-[0_0_40px_rgba(252,211,77,0.6)] transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-7 w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-primary-foreground" />
        </Button>
      </div>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="w-[95vw] max-w-[500px] h-[85vh] sm:h-[600px] flex flex-col p-0 bg-card border-accent/20">
          <DialogHeader className="border-b border-border p-4 md:p-6">
            <DialogTitle className="text-lg md:text-xl font-semibold bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
              Sofia, assistente pessoal do Filipe Lima
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-4 md:p-6">
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

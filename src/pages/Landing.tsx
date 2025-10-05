import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Quote } from "lucide-react";

// URLs de Imagens de placeholder para evitar erros de compilação
const logoFilipeLima = "https://placehold.co/100x100/1A1B1E/FCB900?text=FL";
const filipeLimaPhoto = "https://placehold.co/450x600/1A1B1E/FCB900?text=Filipe+Lima";

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
      text: "Olá! Fico feliz com o seu interesse. Para qual data e tipo de evento seria?",
      sender: "sofia",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  // A URL do Webhook do Make.com (já configurada)
  const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/ngw41roxe6sx7txxqmfn8mae305618tt";

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: "user",
        timestamp: new Date(),
      };
      
      // Adiciona a mensagem do utilizador e uma de "a pensar"
      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          id: prev.length + 2,
          text: "Sofia está a pensar...",
          sender: "sofia",
          timestamp: new Date(),
        },
      ]);
      const currentInput = input;
      setInput("");

      // Controlador de timeout para ser mais paciente
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // Espera até 25 segundos

      try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: currentInput }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId); // Limpa o timeout se a resposta chegar a tempo

        if (!response.ok) {
          throw new Error(`Erro de HTTP! Status: ${response.status}`);
        }

        // Usa text() primeiro para lidar com JSON mal formatado
        const textResponse = await response.text();
        let sofiaMessageText = "Recebi uma resposta, mas o formato é inválido.";
        
        try {
          const data = JSON.parse(textResponse);
          sofiaMessageText = data.reply || sofiaMessageText;
        } catch (jsonError) {
          // Se o JSON estiver mal formatado, tenta extrair a mensagem diretamente
          const replyMatch = textResponse.match(/"reply"\s*:\s*"([^"]*)"/);
          if (replyMatch) {
            sofiaMessageText = replyMatch[1]
              .replace(/\\n/g, '\n')
              .replace(/\\t/g, '\t')
              .replace(/\\"/g, '"');
          }
        }
        
        const sofiaResponse: Message = {
          id: messages.length + 3,
          text: sofiaMessageText,
          sender: "sofia",
          timestamp: new Date(),
        };

        // Substitui a mensagem de "a pensar" pela resposta final
        setMessages((prev) => [
          ...prev.slice(0, -1),
          sofiaResponse,
        ]);

      } catch (error) {
        clearTimeout(timeoutId);
        let errorMessage = "Desculpe, estou com um problema técnico. Tente novamente mais tarde.";
        if (error.name === 'AbortError') {
          errorMessage = "Desculpe, demorei muito para pensar. Pode tentar reformular a sua pergunta?";
        }
        console.error("Erro:", error);
        
        const errorResponse: Message = {
          id: messages.length + 3,
          text: errorMessage,
          sender: "sofia",
          timestamp: new Date(),
        };
        // Substitui a mensagem de "a pensar" pela mensagem de erro
         setMessages((prev) => [
          ...prev.slice(0, -1),
          errorResponse,
        ]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Secção do Cabeçalho */}
      <header className="bg-card border-b border-border py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <div className="w-24 h-24 rounded-lg overflow-hidden">
            <img 
              src={logoFilipeLima} 
              alt="Logótipo Filipe Lima" 
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

      {/* Secção Sobre */}
      <section className="py-20 px-4 md:px-8 bg-card">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <img 
                src={logoFilipeLima} 
                alt="Marca d'água" 
                className="w-full h-auto object-contain"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent relative z-10">
              Sobre Filipe Lima
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4 relative z-10">
              Com mais de 13 anos de experiência, Filipe Lima é um violinista renomado que já encantou
              milhares de pessoas em casamentos, eventos corporativos e apresentações especiais.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4 relative z-10">
              A sua versatilidade musical abrange desde o clássico erudito até músicas contemporâneas,
              sempre com a elegância e sensibilidade que transformam momentos em memórias inesquecíveis.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed relative z-10">
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

      {/* Secção de Testemunhos */}
      <section className="py-20 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
            O Que Dizem os Nossos Clientes
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria & João",
                event: "Casamento",
                text: "O Filipe transformou o nosso casamento em algo mágico. Cada nota tocada era perfeita e emocionante. Os nossos convidados não param de elogiar!",
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

      {/* Botão de Chat Flutuante */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg shadow-lg animate-fade-in hidden md:block">
          <p className="text-sm font-medium whitespace-nowrap">Converse com a Sofia!</p>
        </div>
        <Button
          onClick={() => setChatOpen(true)}
          size="icon"
          className="h-20 w-20 rounded-full bg-gradient-to-r from-accent to-amber-400 hover:shadow-[0_0_40px_rgba(252,211,77,0.6)] transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-10 w-10 text-primary-foreground" />
        </Button>
      </div>

      {/* Diálogo do Chat */}
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
              placeholder="Digite a sua mensagem aqui..."
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Mic, Paperclip, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatPanelProps {
  initialMessage?: string;
}

export const ChatPanel = ({ initialMessage }: ChatPanelProps = {}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá, Filipe! Sou o Assistente de Filipe Lima. Como posso ajudar você hoje?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Pre-populate input when initialMessage changes
  useEffect(() => {
    if (initialMessage) {
      setInput(initialMessage);
    }
  }, [initialMessage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Placeholder para futura implementação de upload
      console.log("Arquivos selecionados:", files);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Placeholder para futura implementação de captura de foto
      console.log("Foto capturada:", files[0]);
    }
  };

  const handleMicClick = () => {
    // Placeholder para futura implementação de gravação de áudio
    console.log("Gravação de áudio iniciada");
  };

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: "user",
        timestamp: new Date(),
      };
      
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      try {
        // Prepare conversation history for AI
        const conversationHistory = updatedMessages.map(msg => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text
        }));

        // Call AI edge function
        const { data, error } = await supabase.functions.invoke('ai-chat', {
          body: { messages: conversationHistory }
        });

        if (error) throw error;

        const botResponse: Message = {
          id: updatedMessages.length + 1,
          text: data.message || "Desculpe, não consegui processar sua mensagem.",
          sender: "bot",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botResponse]);
      } catch (error: any) {
        console.error('Error calling AI:', error);
        
        toast({
          title: "Erro ao processar mensagem",
          description: "Não foi possível obter uma resposta. Tente novamente.",
          variant: "destructive",
        });

        const errorMessage: Message = {
          id: updatedMessages.length + 1,
          text: "Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente em alguns instantes.",
          sender: "bot",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="h-full flex flex-col border-border bg-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
          Chat Assistente
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 gap-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
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
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx"
            multiple
          />
          <input
            ref={cameraInputRef}
            type="file"
            className="hidden"
            onChange={handleCameraCapture}
            accept="image/*"
            capture="environment"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="icon"
            variant="ghost"
            className="shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => cameraInputRef.current?.click()}
            size="icon"
            variant="ghost"
            className="shrink-0"
          >
            <Camera className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleMicClick}
            size="icon"
            variant="ghost"
            className="shrink-0"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
            className="bg-secondary border-border"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

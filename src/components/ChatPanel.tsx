import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Mic, Paperclip, Camera } from "lucide-react";
import { useState, useRef } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá, Filipe! Sou a Sofia, da GM Produtora. Como posso ajudar você hoje?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
    if (input.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      
      const messageText = input;
      setInput("");

      // Send to Make webhook
      try {
        await fetch("https://hook.us2.make.com/ty7sh91e2k3mvd9mir2e417cyh5mfw4c", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error("Erro ao enviar para webhook:", error);
      }

      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: "Entendi! Estou processando sua solicitação...",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
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
        <ScrollArea className="flex-1 pr-4">
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
      </CardContent>
    </Card>
  );
};

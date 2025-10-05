import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Mic, Paperclip, Camera, Loader2, Image as ImageIcon, AudioLines } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  mediaType?: "text" | "image" | "audio";
  mediaData?: string;
  audioDuration?: number;
}

const WEBHOOK_URL = "https://hook.us2.make.com/q9j4itjdinh8etuqontbz7yewcom5rzv";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_AUDIO_DURATION = 120 * 1000; // 2 minutes in ms

export const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá, Filipe! Sou a Sofia, da GM Produtora. Como posso ajudar você hoje?",
      sender: "bot",
      timestamp: new Date(),
      mediaType: "text",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const sendToWebhook = async (
    message: string,
    mediaType: "text" | "image" | "audio",
    mediaData?: string,
    audioDuration?: number
  ) => {
    const payload = {
      message,
      user_email: "filipecc2002@gmail.com",
      timestamp: new Date().toISOString(),
      context: "private_dashboard",
      media_type: mediaType,
      ...(mediaData && { media_data: mediaData }),
      ...(audioDuration && { audio_duration: audioDuration }),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.reply || "Recebido! Processando sua solicitação...";
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error("Sofia não respondeu a tempo. Tente novamente.");
      }
      throw new Error("Erro de conexão. Verifique sua internet.");
    }
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Imagem deve ter menos de 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Apenas imagens são aceitas.");
      return;
    }

    try {
      setIsLoading(true);
      const base64 = await convertFileToBase64(file);

      const userMessage: Message = {
        id: messages.length + 1,
        text: "📸 Imagem enviada",
        sender: "user",
        timestamp: new Date(),
        mediaType: "image",
        mediaData: base64,
      };
      setMessages((prev) => [...prev, userMessage]);

      const reply = await sendToWebhook("Imagem enviada", "image", base64);

      const botResponse: Message = {
        id: messages.length + 2,
        text: reply,
        sender: "bot",
        timestamp: new Date(),
        mediaType: "text",
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar imagem.");
      console.error("Erro ao processar imagem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
    e.target.value = "";
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
    e.target.value = "";
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const duration = Math.round((Date.now() - recordingStartTime) / 1000);
        
        try {
          setIsLoading(true);
          const base64 = await convertFileToBase64(audioBlob as File);

          const userMessage: Message = {
            id: messages.length + 1,
            text: `🎤 Áudio gravado (${duration}s)`,
            sender: "user",
            timestamp: new Date(),
            mediaType: "audio",
            mediaData: base64,
            audioDuration: duration,
          };
          setMessages((prev) => [...prev, userMessage]);

          const reply = await sendToWebhook(`Áudio gravado (${duration}s)`, "audio", base64, duration);

          const botResponse: Message = {
            id: messages.length + 2,
            text: reply,
            sender: "bot",
            timestamp: new Date(),
            mediaType: "text",
          };
          setMessages((prev) => [...prev, botResponse]);
        } catch (error: any) {
          toast.error(error.message || "Erro ao enviar áudio.");
          console.error("Erro ao processar áudio:", error);
        } finally {
          setIsLoading(false);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(recorder);
      setRecordingStartTime(Date.now());
      setIsRecording(true);
      recorder.start();

      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          setIsRecording(false);
          toast.info("Gravação encerrada (limite de 2 minutos).");
        }
      }, MAX_AUDIO_DURATION);
    } catch (error) {
      toast.error("Permissão necessária para gravar áudio.");
      console.error("Erro ao acessar microfone:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const messageText = input.trim();
      const userMessage: Message = {
        id: messages.length + 1,
        text: messageText,
        sender: "user",
        timestamp: new Date(),
        mediaType: "text",
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const reply = await sendToWebhook(messageText, "text");

        const botResponse: Message = {
          id: messages.length + 2,
          text: reply,
          sender: "bot",
          timestamp: new Date(),
          mediaType: "text",
        };
        setMessages((prev) => [...prev, botResponse]);
      } catch (error: any) {
        toast.error(error.message || "Erro ao enviar mensagem.");
        console.error("Erro ao processar mensagem:", error);
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
                  {message.mediaType === "image" && message.mediaData && (
                    <img
                      src={message.mediaData}
                      alt="Imagem enviada"
                      className="max-w-full rounded-md mb-2"
                    />
                  )}
                  {message.mediaType === "audio" && (
                    <div className="flex items-center gap-2 mb-2">
                      <AudioLines className="h-4 w-4" />
                      <span className="text-xs">
                        {message.audioDuration}s
                      </span>
                    </div>
                  )}
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
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Sofia está processando...</p>
                  </div>
                </div>
              </div>
            )}
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
            variant={isRecording ? "destructive" : "ghost"}
            className="shrink-0"
            disabled={isLoading}
          >
            <Mic className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
          </Button>
          <Input
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
            className="bg-secondary border-border"
            disabled={isLoading || isRecording}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={isLoading || isRecording || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

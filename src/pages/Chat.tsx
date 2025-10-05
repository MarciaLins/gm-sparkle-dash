import { Layout } from "@/components/Layout";
import { ChatPanel } from "@/components/ChatPanel";

const Chat = () => {
  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] flex flex-col p-6 bg-background">
        <div className="mb-4 flex-shrink-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
            Chat com Sofia
          </h1>
          <p className="text-muted-foreground mt-1">
            Sua assistente virtual para gestão de eventos
          </p>
        </div>
        <div className="flex-1 min-h-0">
          <ChatPanel />
        </div>
      </div>
    </Layout>
  );
};

export default Chat;

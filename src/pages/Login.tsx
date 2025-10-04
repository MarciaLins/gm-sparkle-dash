import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthProvider";

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      return;
    }

    setIsLoading(true);
    await signIn(email);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Acesso ao Painel
            </h1>
            <p className="text-muted-foreground">
              Digite seu email para receber o link de acesso
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-accent to-amber-400 hover:shadow-[0_0_30px_rgba(252,211,77,0.4)] transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Acessar Painel"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Você receberá um link mágico por email para acessar
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

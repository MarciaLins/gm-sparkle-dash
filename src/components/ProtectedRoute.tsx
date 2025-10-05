import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // ⚠️ INSECURE: Verificação apenas do localStorage (não seguro!)
      const userEmail = localStorage.getItem('user_email');
      
      if (!userEmail) {
        navigate("/login");
        return;
      }

      // Validação básica apenas para filipecc2002@gmail.com
      if (userEmail === 'filipecc2002@gmail.com') {
        setIsAuthorized(true);
      } else {
        localStorage.removeItem('user_email');
        navigate("/login");
      }
    } catch (error) {
      console.error("Erro ao verificar autorização:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};

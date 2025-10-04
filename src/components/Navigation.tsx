import { Calendar, Users, DollarSign, Briefcase, Settings, LayoutDashboard, Package, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Minha Agenda", url: "/agenda", icon: Calendar },
  { title: "Meus Clientes", url: "/clientes", icon: Users },
  { title: "Minha Equipe", url: "/equipe", icon: Briefcase },
  { title: "Meu Financeiro", url: "/financeiro", icon: DollarSign },
  { title: "Meus Serviços", url: "/servicos", icon: Package },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export const Navigation = () => {
  const { signOut, user } = useAuth();

  return (
    <nav className="w-64 min-h-screen bg-card border-r border-border p-6 sticky top-0 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold">
          <span className="bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent">
            GM Produtora
          </span>
        </h2>
        {user?.email && (
          <p className="text-xs text-muted-foreground mt-2 truncate">
            {user.email}
          </p>
        )}
      </div>
      
      <ul className="space-y-2 flex-1">
        {navItems.map((item) => (
          <li key={item.url}>
            <NavLink
              to={item.url}
              end={item.url === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                  isActive
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <Button
        onClick={signOut}
        variant="ghost"
        className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground mt-4"
      >
        <LogOut className="h-5 w-5" />
        <span>Sair</span>
      </Button>
    </nav>
  );
};

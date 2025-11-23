import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed } from "lucide-react";
import { authService } from "../../services/authService";
import { toast, Toaster } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    toast.promise(
      authService.login({ email, password })
        .then(() => navigate("/menu")),
      {
        loading: "Fazendo login...",
        success: "Login realizado com sucesso!",
        error: (error) => {
          console.error("Erro ao fazer login:", error);
          return "Falha no login. Verifique suas credenciais e tente novamente.";
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4 shadow-glow">
            <UtensilsCrossed className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Cantina Digital</h1>
          <p className="text-muted-foreground mt-2">Faça login para continuar</p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-8 animate-scale-in">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold bg-primary" >
              Entrar
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Registre-se
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Login;

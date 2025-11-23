import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed } from "lucide-react";
import { authService } from "../../services/authService";
import { toast, Toaster } from "sonner";
import { useEffect } from "react";

const Register = () => {
  const [name, setName] = useState("123");
  const [email, setEmail] = useState("usuario100@email.com");
  const [password, setPassword] = useState("123456");
  const navigate = useNavigate();


  useEffect(() => {
    document.title = "Register - Cantina Digital";
  }, []);

  useEffect(() => {
    localStorage.removeItem("authToken")
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    toast.promise(
      authService.register({ name, email, password })
        .then(() => {
          navigate("/menu");
        }),
      {
        loading: "Criando conta...",
        success: "Conta criada com sucesso!",
        error: (error) => {
          console.log(error);
          const data = error.response?.data;
          return data?.error || "Erro ao criar conta. Tente novamente.";
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <Toaster position="top-right" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4 shadow-glow">
            <UtensilsCrossed className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Criar Conta</h1>
          <p className="text-muted-foreground mt-2">Cadastre-se para começar</p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-8 animate-scale-in">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12"
              />
            </div>

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

            <Button type="submit" className="w-full h-12 text-base font-semibold bg-primary">
              Criar Conta
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Faça login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

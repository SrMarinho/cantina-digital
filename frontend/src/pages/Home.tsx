import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { UtensilsCrossed } from "lucide-react";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Cantina Digital";
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className="text-center animate-fade-in p-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary mb-6 shadow-glow animate-scale-in">
          <UtensilsCrossed className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className="mb-4 text-5xl font-bold text-primary">
          Cantina Digital
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          Faça seu pedido de forma rápida e prática!
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/login")}
            className="h-12 px-8 text-base font-semibold"
          >
            Entrar
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate("/register")}
            className="h-12 px-8 text-base font-semibold"
            
          >
            Criar Conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;

import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, Package } from "lucide-react";
import { toast, Toaster } from "sonner";
import { productsService } from "../services/productsService";
import { useCart } from "../hooks/useCart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem: string;
}

const Menu = () => {
  const navigate = useNavigate()
  const {
    addToCart,
    cartTotal,
    cartItemCount,
    clearCart
  } = useCart();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "Todos",
    ...Array.from(new Set(productsList.map((p) => p.categoria))),
  ];

  const filteredProducts =
    selectedCategory === "Todos"
      ? productsList
      : productsList.filter((p) => p.categoria === selectedCategory);

  function handleLogout() {
    authService.logout()
    clearCart()
    navigate("/")
  }

  useEffect(() => {
    document.title = "Menu - Cantina Digital";
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        await toast.promise(
          productsService.getAll().then((response) => {
            const data = response.data as Array<Product>;
            setProductsList(data.map(product => ({
              ...product,
              categoria: product.categoria || "",
              imagem: product.imagem || ""
            })));
          }),
          {
            loading: "Buscando produtos...",
            error: (error) => {
              console.log(error);
              const data = error.response?.data;
              return data?.message || "Erro ao buscar produtos. Tente novamente.";
            }
          }
        );
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right"/>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Cantina Digital</h1>
          <div className="flex items-center gap-3">
            <Link to="/meus-pedidos">
              <Button variant="ghost" size="icon">
                <Package className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/carrinho">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><User className="w-5 h-5" /></Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52" align="start">
                  <DropdownMenuItem onClick={() => handleLogout()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
              >
                <div className="p-6">
                  <div className="text-6xl mb-4 text-center">🍽</div>
                  <Badge variant="secondary" className="mb-2">
                    {product.categoria}
                  </Badge>
                  <h3 className="text-xl font-bold mb-2">{product.nome}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {product.descricao}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      R$ {product.preco.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => addToCart(product)}
                      className="hover-scale"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <Link to="/carrinho">
          <div className="fixed bottom-6 right-6 animate-scale-in">
            <Button
              size="lg"
              className="rounded-full shadow-lg h-14 px-6 bg-primary"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ver Carrinho · R$ {cartTotal.toFixed(2)}
            </Button>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Menu;
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, Package } from "lucide-react";
import { toast, Toaster } from "sonner";
import { productsService } from "../../services/productsService";

interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem: string;
}

const Menu = () => {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [filteredProductsList, setFilteredProductsList] = useState<Product[]>([]);

  const categories = [
    "Todos",
    ...Array.from(new Set(productsList.map((p) => p.categoria))),
  ];

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const filteredProducts =
    selectedCategory === "Todos"
      ? productsList
      : productsList.filter((p) => p.categoria === selectedCategory);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.preco * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function handleUserMenu() {
      toast.info("Menu do usuário em desenvolvimento")
  }

  useEffect(() => {
    document.title = "Menu - Cantina Digital";
  }, []);

  useEffect(() => {
    toast.promise(
      productsService.getAll()
      .then((response) => {
        const data = response.data as Array<Product>
        setProductsList([])
        data.map((product) => {
        setProductsList(prev => [...prev, {...product, categoria: "", imagem: ""}])
        })
      })
      , {
        loading: "Buscando produtos...",
        error: (error) => {
          console.log(error);
          const data = error.response?.data;
          return data?.message || "Erro ao buscar produtos. Tente novamente.";
        }
      }
    );
  }, []);
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
            <Button variant="ghost" size="icon" onClick={() => handleUserMenu()}>
              <User className="w-5 h-5" />
            </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
            >
              <div className="p-6">
                <div className="text-6xl mb-4 text-center">{product.imagem}</div>
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
      </div>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <Link to="/carrinho">
          <div className="fixed bottom-6 right-6 animate-scale-in">
            <Button
              size="lg"
              className="rounded-full shadow-lg h-14 px-6"
              style={{ background: "var(--gradient-primary)" }}
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

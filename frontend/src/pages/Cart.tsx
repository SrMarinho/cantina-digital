import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { ordersService } from "../services/ordersService";
import type { Order, OrderItem } from "../types/order.types";
import { toast, Toaster } from "sonner";


const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartItemCount
  } = useCart();

  const deliveryFee = 5.00;
  const total = cartTotal + deliveryFee;

  const handleCheckout = () => {
    const order: Order = {
      items: []
    }
    cart.map(item => {
      order.items.push({
        product_id: item.product.id,
        quantidade: item.quantity
      } as OrderItem)
    })
    
    toast.promise(
      ordersService.post(order)
      .then(response => response.data)
      .then(data => {
        if (data.success) {
          clearCart()
        }
      }),
      {
        loading: "Fazendo pedido...",
        success: () => {
          setTimeout(() => navigate("/menu"), 2000)
          return "Pedido realizado com sucesso!"
        },
        error: (error) => {
          console.error("Erro ao fazer login:", error);
          return error.response.data.error || "Falha no pedido. Verifique suas credenciais e tente novamente.";
        }
      }
    );
  };

  const handleIncrement = (productId: string) => {
    const currentItem = cart.find(item => item.product.id === productId);
    if (currentItem) {
      updateQuantity(productId, currentItem.quantity + 1);
    }
  };

  const handleDecrement = (productId: string) => {
    const currentItem = cart.find(item => item.product.id === productId);
    if (currentItem) {
      updateQuantity(productId, currentItem.quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Toaster position="top-right"/>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/menu">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Carrinho</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {cart.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
            <Link to="/menu">
              <Button>Ver Cardápio</Button>
            </Link>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <Card key={item.product.id} className="p-4 animate-fade-in">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{"📦"}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.nome}</h3>
                      <p className="text-primary font-bold">
                        R$ {item.product.preco.toFixed(2)}
                      </p>
                      {item.product.descricao && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.product.descricao}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDecrement(item.product.id)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleIncrement(item.product.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <span className="text-sm text-muted-foreground">
                      Subtotal do item
                    </span>
                    <span className="font-semibold">
                      R$ {(item.product.preco * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Botão para limpar carrinho */}
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Carrinho
              </Button>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Resumo do Pedido</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cartItemCount} {cartItemCount === 1 ? 'item' : 'itens'})</span>
                  <span>R$ {cartTotal.toFixed(2)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Fixed Checkout Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 shadow-lg">
          <div className="container mx-auto max-w-2xl">
            <Button
              onClick={handleCheckout}
              className="w-full h-14 text-lg font-semibold bg-primary"
            >
              Finalizar Pedido · R$ {total.toFixed(2)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
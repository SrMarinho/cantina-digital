import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { ordersService } from "../services/ordersService";
import { useEffect, useState } from "react";

interface Product {
  id: string
  nome: string
  descricao: string
  preco: number
  disponivel: string
  imagem: string
}

interface OrderItem {
  id: string
  order_id: string
  preco_unitario: number
  product: Product
  product_id: string
  quantidade: number
}

interface Order {
  id: string
  user_id: string
  orderItems: OrderItem[]
  status: string
  total: number
  data_pedido: string
}

const Orders = () => {
  const [ordersList, setOrdersList] = useState<Order[]>([])

  const getStatusConfig = (status: Order["status"]) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { label: "Em andamento", variant: "default" as const, icon: Clock };
      case "processing":
        return { label: "Procesando", variant: "default" as const, icon: Clock };
      case "completed":
        return { label: "Concluído", variant: "secondary" as const, icon: CheckCircle };
      case "cancelled":
        return { label: "Cancelado", variant: "destructive" as const, icon: XCircle };
      default:
        return { label: "Sem status", variant: "default" as const, icon: Clock };
    }
  };

  useEffect(() => {
    ordersService.getAll()
    .then(reponse => reponse.data)
    .then(data => {
      const orders = data.data as Order[]
      setOrdersList(orders)
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/menu">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Meus Pedidos</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {ordersList.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido</p>
            <Link to="/menu">
              <Button>Ver Cardápio</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {ordersList.map(order => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow animate-fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Pedido #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.data_pedido}</p>
                    </div>
                    <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantidade}x {item.product.nome}
                        </span>
                        <span className="text-muted-foreground">
                          R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      R$ {Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

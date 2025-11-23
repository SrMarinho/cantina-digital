import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";

interface Order {
  id: number;
  date: string;
  status: "pending" | "completed" | "cancelled";
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

const mockOrders: Order[] = [
  {
    id: 1,
    date: "2025-11-22 14:30",
    status: "completed",
    items: [
      { name: "X-Burger Clássico", quantity: 1, price: 15.90 },
      { name: "Batata Frita", quantity: 1, price: 10.90 },
    ],
    total: 31.80,
  },
  {
    id: 2,
    date: "2025-11-21 12:15",
    status: "completed",
    items: [
      { name: "Pizza Margherita", quantity: 1, price: 32.90 },
      { name: "Refrigerante", quantity: 2, price: 5.90 },
    ],
    total: 44.70,
  },
  {
    id: 3,
    date: "2025-11-20 19:45",
    status: "pending",
    items: [
      { name: "Salada Caesar", quantity: 1, price: 18.90 },
    ],
    total: 18.90,
  },
];

const Orders = () => {
  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return { label: "Em andamento", variant: "default" as const, icon: Clock };
      case "completed":
        return { label: "Concluído", variant: "secondary" as const, icon: CheckCircle };
      case "cancelled":
        return { label: "Cancelado", variant: "destructive" as const, icon: XCircle };
    }
  };

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
        {mockOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido</p>
            <Link to="/menu">
              <Button>Ver Cardápio</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {mockOrders.map(order => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow animate-fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Pedido #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-muted-foreground">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      R$ {order.total.toFixed(2)}
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

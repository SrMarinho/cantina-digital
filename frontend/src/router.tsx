import { Routes, Route } from "react-router-dom";
import Index from "./pages/Cart";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/carrinho" element={<Cart />} />
      <Route path="/meus-pedidos" element={<Orders />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index/index";
import LoginPage from "./pages/Login/index";
import RegisterPage from "./pages/Register/index";
import Menu from "./pages/Menu/index";
import Cart from "./pages/Cart/index";
import Orders from "./pages/Orders/index";
import NotFound from "./pages/NotFound/index";

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
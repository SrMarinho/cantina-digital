import { Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Menu from "./pages/menu";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="*" element={<Index />} />
    </Routes>
  );
}
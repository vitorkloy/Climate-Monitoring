import { JSX, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./index.css";
import { AuthService } from "./services/authService";

// Páginas
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home";

// Componente de rota protegida
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const userId = AuthService.getCurrentUserId(); // Verifica se há um ID de usuário logado
  if (!userId) {
    // Se não houver usuário, redireciona para a página de login
    return <Navigate to="/" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  // Adicione outras rotas protegidas aqui, se houver
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

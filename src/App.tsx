import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { Produtos } from "./pages/Produtos";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route element={<PrivateRoute />}>
            <Route path="/produtos" element={<Produtos />} />
          </Route>
          <Route path="*" element={<Navigate to="/produtos" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

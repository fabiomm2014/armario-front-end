import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // host: true expõe o servidor no IP da rede local (0.0.0.0),
    // não só em localhost — necessário para acessar pelo celular.
    host: true,
  },
});

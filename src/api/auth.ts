import { api } from "./client";
import type { CadastroRequest, LoginRequest, LoginResponse } from "../types";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function cadastrar(payload: CadastroRequest): Promise<void> {
  await api.post("/auth/cadastro", payload);
}

import { api } from "./client";
import type { Produto, ProdutoInput } from "../types";

export async function listarProdutos(): Promise<Produto[]> {
  const { data } = await api.get<Produto[]>("/api/produtos");
  return data;
}

export async function buscarProduto(id: string): Promise<Produto> {
  const { data } = await api.get<Produto>(`/api/produtos/${id}`);
  return data;
}

export async function criarProduto(payload: ProdutoInput): Promise<Produto> {
  const { data } = await api.post<Produto>("/api/produtos", payload);
  return data;
}

export async function atualizarProduto(
  id: string,
  payload: ProdutoInput
): Promise<Produto> {
  const { data } = await api.put<Produto>(`/api/produtos/${id}`, payload);
  return data;
}

export async function deletarProduto(id: string): Promise<void> {
  await api.delete(`/api/produtos/${id}`);
}

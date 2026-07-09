export interface Produto {
  id: string;
  nome: string;
  peso: number | null;
  tipo: string;
  dataFabricacao: string; // ISO date (yyyy-MM-dd)
  dataValidade: string; // ISO date (yyyy-MM-dd)
}

export type ProdutoInput = Omit<Produto, "id">;

export interface LoginRequest {
  login: string;
  senha: string;
}

export interface CadastroRequest {
  login: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

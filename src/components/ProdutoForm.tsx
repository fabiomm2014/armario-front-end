import { useState, type FormEvent } from "react";
import type { Produto, ProdutoInput } from "../types";

interface ProdutoFormProps {
  produtoInicial?: Produto | null;
  onSalvar: (payload: ProdutoInput) => Promise<void>;
  onFechar: () => void;
}

const TIPOS = ["Alimento", "Limpeza", "Higiene", "Roupa", "Outro"];

export function ProdutoForm({
  produtoInicial,
  onSalvar,
  onFechar,
}: ProdutoFormProps) {
  const [nome, setNome] = useState(produtoInicial?.nome ?? "");
  const [peso, setPeso] = useState(
    produtoInicial?.peso != null ? String(produtoInicial.peso) : ""
  );
  const [tipo, setTipo] = useState(produtoInicial?.tipo ?? TIPOS[0]);
  const [dataFabricacao, setDataFabricacao] = useState(
    produtoInicial?.dataFabricacao ?? ""
  );
  const [dataValidade, setDataValidade] = useState(
    produtoInicial?.dataValidade ?? ""
  );
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!nome.trim() || !dataFabricacao || !dataValidade) {
      setErro("Preencha nome, data de fabricação e validade.");
      return;
    }

    setSalvando(true);
    try {
      await onSalvar({
        nome: nome.trim(),
        peso: peso ? Number(peso) : null,
        tipo,
        dataFabricacao,
        dataValidade,
      });
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
      setSalvando(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{produtoInicial ? "Editar produto" : "Novo produto"}</h2>

        {erro && <div className="form-error">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Arroz integral"
              required
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="tipo">Tipo</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "2px solid var(--line)",
                  borderRadius: "var(--radius)",
                  background: "#fff",
                  fontSize: "15px",
                }}
              >
                {TIPOS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="peso">Peso (kg)</label>
              <input
                id="peso"
                type="number"
                step="0.01"
                min="0"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="dataFabricacao">Fabricação</label>
              <input
                id="dataFabricacao"
                type="date"
                value={dataFabricacao}
                onChange={(e) => setDataFabricacao(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="dataValidade">Validade</label>
              <input
                id="dataValidade"
                type="date"
                value={dataValidade}
                onChange={(e) => setDataValidade(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onFechar}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

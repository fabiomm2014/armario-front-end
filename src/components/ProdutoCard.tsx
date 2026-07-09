import type { Produto } from "../types";
import { calcularValidade, formatarData } from "../utils/validade";

interface ProdutoCardProps {
  produto: Produto;
  onEditar: () => void;
  onExcluir: () => void;
}

export function ProdutoCard({ produto, onEditar, onExcluir }: ProdutoCardProps) {
  const validade = calcularValidade(produto.dataValidade);

  return (
    <div className="produto-card">
      <div className="produto-card__tipo">{produto.tipo}</div>
      <div className="produto-card__nome">{produto.nome}</div>

      <div className="produto-card__meta">
        <span>
          Fabricação: <strong>{formatarData(produto.dataFabricacao)}</strong>
        </span>
        <span>
          Validade: <strong>{formatarData(produto.dataValidade)}</strong>
        </span>
        {produto.peso != null && (
          <span>
            Peso: <strong>{produto.peso} kg</strong>
          </span>
        )}
      </div>

      <span className={`stamp stamp-${validade.status}`}>{validade.rotulo}</span>

      <div className="produto-card__actions">
        <button className="btn btn-ghost" onClick={onEditar}>
          Editar
        </button>
        <button className="btn btn-danger" onClick={onExcluir}>
          Excluir
        </button>
      </div>
    </div>
  );
}

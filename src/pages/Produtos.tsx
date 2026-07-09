import { useEffect, useMemo, useState } from "react";
import * as produtosApi from "../api/produtos";
import type { Produto, ProdutoInput } from "../types";
import { ProdutoCard } from "../components/ProdutoCard";
import { ProdutoForm } from "../components/ProdutoForm";
import { calcularValidade } from "../utils/validade";
import { useAuth } from "../context/AuthContext";

type Filtro = "todos" | "atencao" | "vencido";

export function Produtos() {
  const { logout } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await produtosApi.listarProdutos();
      setProdutos(dados);
    } catch {
      setErro("Não foi possível carregar os produtos.");
    } finally {
      setCarregando(false);
    }
  }

  async function handleSalvar(payload: ProdutoInput) {
    if (produtoEditando) {
      const atualizado = await produtosApi.atualizarProduto(
        produtoEditando.id,
        payload
      );
      setProdutos((prev) =>
        prev.map((p) => (p.id === atualizado.id ? atualizado : p))
      );
    } else {
      const criado = await produtosApi.criarProduto(payload);
      setProdutos((prev) => [...prev, criado]);
    }
    fecharModal();
  }

  async function handleExcluir(id: string) {
    if (!confirm("Excluir este produto do armário?")) return;
    const anteriores = produtos;
    setProdutos((prev) => prev.filter((p) => p.id !== id));
    try {
      await produtosApi.deletarProduto(id);
    } catch {
      setProdutos(anteriores);
      alert("Não foi possível excluir. Tente novamente.");
    }
  }

  function abrirNovo() {
    setProdutoEditando(null);
    setModalAberto(true);
  }

  function abrirEdicao(produto: Produto) {
    setProdutoEditando(produto);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setProdutoEditando(null);
  }

  const produtosFiltrados = useMemo(() => {
    if (filtro === "todos") return produtos;
    return produtos.filter(
      (p) => calcularValidade(p.dataValidade).status === filtro
    );
  }, [produtos, filtro]);

  const contagem = useMemo(() => {
    const atencao = produtos.filter(
      (p) => calcularValidade(p.dataValidade).status === "atencao"
    ).length;
    const vencido = produtos.filter(
      (p) => calcularValidade(p.dataValidade).status === "vencido"
    ).length;
    return { atencao, vencido };
  }, [produtos]);

  return (
    <>
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true" />
          <span className="brand-text">
            <span className="brand-mark">Armário</span>
            <span className="brand-sub">controle de estoque</span>
          </span>
        </div>
        <button className="btn btn-ghost" onClick={logout}>
          Sair
        </button>
      </header>

      <div className="page">
        <div className="shelf-label">
          <div>
            <h2>Seus produtos</h2>
            <span className="shelf-count">
              {produtos.length} {produtos.length === 1 ? "item" : "itens"} no
              armário
              {contagem.vencido > 0 && ` · ${contagem.vencido} vencido(s)`}
              {contagem.atencao > 0 && ` · ${contagem.atencao} vencendo`}
            </span>
          </div>
          <button className="btn btn-primary" onClick={abrirNovo}>
            + Novo produto
          </button>
        </div>

        <div className="filter-row">
          <button
            className={`chip ${filtro === "todos" ? "active" : ""}`}
            onClick={() => setFiltro("todos")}
          >
            Todos
          </button>
          <button
            className={`chip ${filtro === "atencao" ? "active" : ""}`}
            onClick={() => setFiltro("atencao")}
          >
            Vencendo em breve
          </button>
          <button
            className={`chip ${filtro === "vencido" ? "active" : ""}`}
            onClick={() => setFiltro("vencido")}
          >
            Vencidos
          </button>
        </div>

        {carregando && <p className="loading-text">Carregando produtos...</p>}
        {erro && <div className="form-error">{erro}</div>}

        {!carregando && !erro && produtosFiltrados.length === 0 && (
          <div className="empty-state">
            <h3>
              {produtos.length === 0
                ? "Seu armário está vazio"
                : "Nada por aqui"}
            </h3>
            <p>
              {produtos.length === 0
                ? "Cadastre o primeiro produto para começar a controlar as validades."
                : "Nenhum produto se encaixa nesse filtro."}
            </p>
          </div>
        )}

        {!carregando && produtosFiltrados.length > 0 && (
          <div className="produto-grid">
            {produtosFiltrados.map((produto) => (
              <ProdutoCard
                key={produto.id}
                produto={produto}
                onEditar={() => abrirEdicao(produto)}
                onExcluir={() => handleExcluir(produto.id)}
              />
            ))}
          </div>
        )}
      </div>

      {modalAberto && (
        <ProdutoForm
          produtoInicial={produtoEditando}
          onSalvar={handleSalvar}
          onFechar={fecharModal}
        />
      )}
    </>
  );
}

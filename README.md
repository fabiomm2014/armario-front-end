# Armário — Frontend

React + TypeScript + Vite consumindo a API `armario` (Spring Boot).

## Stack

- Vite + React 18 + TypeScript
- React Router (login, cadastro, área logada)
- Axios com interceptor de JWT
- CSS puro (sem framework) — sistema de design em `src/index.css`

## Como rodar

```bash
npm install
cp .env.example .env   # ajuste VITE_API_URL se necessário
npm run dev
```

O frontend sobe em `http://localhost:5173`.

Quer acessar pelo celular (mesma rede Wi-Fi)? Veja `README-CELULAR.md`.

## Passo obrigatório no backend: CORS

O backend ainda não libera chamadas de outra origem. Copie
`backend-cors-snippet/WebConfig.java` para
`src/main/java/com/armario/config/WebConfig.java` no projeto `armario`
e suba a API normalmente (`mvn spring-boot:run`, porta 8080).

Sem isso, o navegador vai bloquear as requisições do frontend com erro de CORS.

## Estrutura

```
src/
  api/          chamadas HTTP (auth, produtos, client axios)
  components/   ProdutoCard, ProdutoForm (modal), PrivateRoute
  context/      AuthContext (token JWT em localStorage)
  pages/        Login, Cadastro, Produtos
  utils/        cálculo de status de validade (ok / atenção / vencido)
```

## O que já funciona

- Cadastro e login (JWT salvo em `localStorage`, anexado automaticamente
  em toda requisição autenticada)
- Listagem de produtos com filtro por status de validade
- Criar / editar / excluir produto (modal único reaproveitado)
- Cada card calcula "vence em Xd" / "vencido há Xd" no cliente, a partir
  de `dataValidade`
- Logout limpa o token e redireciona pro login (inclusive em caso de 401)

## Próximos passos sugeridos

- Paginação/busca por nome se a lista crescer
- Tela de detalhes do produto
- Refresh token (hoje o JWT expira em 1h, conforme `application.properties`)

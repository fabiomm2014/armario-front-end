# Acessando o Armário pelo celular

O app roda num servidor de desenvolvimento (Vite) na sua máquina. Pra abrir
no celular, o celular precisa estar na **mesma rede Wi-Fi** do computador e
apontar pro IP do computador em vez de `localhost` (que, no celular, aponta
pro próprio celular).

## 1. Descubra o IP da sua máquina na rede local

**Windows** (PowerShell ou CMD):
```
ipconfig
```
Procure "Endereço IPv4" da sua rede Wi-Fi — algo como `192.168.0.23`.

**macOS**:
```
ipconfig getifaddr en0
```

**Linux**:
```
ip addr show | grep "inet "
```

Vou chamar esse IP de `SEU_IP` daqui pra frente (ex: `192.168.0.23`).

## 2. Aponte o frontend pro backend usando esse IP

No arquivo `.env` do frontend (crie a partir do `.env.example` se ainda não
tiver):
```
VITE_API_URL=http://SEU_IP:8080
```
Não use `localhost` aqui — o celular não sabe o que é "localhost" do seu PC.

## 3. Suba o backend e o frontend

Backend (porta 8080), normalmente:
```
mvn spring-boot:run
```

Frontend (porta 5173) — o `vite.config.ts` já está com `host: true`, então
ele escuta em todos os IPs da máquina, não só em `localhost`:
```
npm run dev
```
O terminal do Vite vai mostrar algo como:
```
➜  Local:   http://localhost:5173/
➜  Network: http://SEU_IP:5173/
```
É esse endereço "Network" que você vai usar no celular.

## 4. CORS: garanta que o backend aceita a origem do celular

O `WebConfig.java` (em `backend-cors-snippet/`, copiado para
`src/main/java/com/armario/config/` no backend) já libera qualquer IP de
rede local nas faixas `192.168.x.x` e `10.x.x.x` na porta 5173. Se o IP da
sua rede for de outra faixa (ex: `172.16.x.x`), adicione um padrão
correspondente em `allowedOriginPatterns`.

Depois de editar o `WebConfig.java`, reinicie o backend.

## 5. Acesse pelo celular

No navegador do celular, digite:
```
http://SEU_IP:5173
```

## Problemas comuns

- **A página não carrega no celular**: geralmente é firewall do computador
  bloqueando a porta 5173 (e 8080) para outros dispositivos da rede.
  - Windows: no primeiro `npm run dev`, o Firewall do Windows deve perguntar
    se permite acesso em redes privadas — aceite. Se não perguntou, libere
    manualmente as portas 5173 e 8080 no Firewall do Windows Defender.
  - macOS: `Preferências do Sistema → Rede → Firewall` e permita conexões
    de entrada para Node/Java.
- **A página carrega mas login/produtos não funcionam**: normalmente é CORS
  (origem do celular não está liberada no `WebConfig.java`) ou o
  `VITE_API_URL` ainda apontando pra `localhost` em vez do `SEU_IP`.
- **O IP mudou de um dia pro outro**: é normal em redes domésticas (IP
  dinâmico via DHCP). Repita o passo 1 e atualize o `.env`.

## Alternativa sem depender da mesma rede: túnel público

Se quiser acessar de fora da sua rede Wi-Fi (ex: mostrar pra alguém remoto),
uma opção é expor a porta com uma ferramenta de túnel, como o `ngrok`:
```
npx ngrok http 5173
```
Isso gera uma URL pública temporária. Nesse caso, lembre de também liberar
essa URL gerada nas origens do CORS do backend (ou apontar `VITE_API_URL`
para um túnel equivalente na porta 8080).

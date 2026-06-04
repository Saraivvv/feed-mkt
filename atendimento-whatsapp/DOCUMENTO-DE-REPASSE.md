# 📋 Documento de Repasse — Sistema de Atendimento WhatsApp (white-label)

> **Como usar este documento:** cole/aponte este arquivo no início de uma nova sessão do
> Claude Code (no projeto da agência). Ele contém toda a arquitetura, acessos e o passo a
> passo pra adicionar novos clientes. ⚠️ **Os segredos (chaves/senhas) NÃO estão escritos
> aqui por segurança** — eles ficam no `.env` da VPS e/ou no seu gerenciador de senhas.
> Preencha a tabela de credenciais a partir de uma fonte segura quando precisar.

---

## 1. O que é este sistema

Atendimento automático no WhatsApp, **montado com ferramentas open-source** (não é código do
zero — é "montar peças prontas"). Objetivo: **produto white-label reutilizável**, para revender
a vários clientes (ótica, concessionária, clínica, etc.). O primeiro cliente foi a **Ótica SANRE**.

**Estratégia "Caminho 1":** usar Evolution + n8n + Gemini + Chatwoot, integrados, em vez de
construir do zero. Migração futura possível para WhatsApp Cloud API oficial (ganha botões
interativos confiáveis; atendimento iniciado pelo cliente é gratuito/barato na oficial).

---

## 2. Arquitetura

```
        WhatsApp do cliente
              |
   [Evolution API]  ──► gateway WhatsApp (1 instância por cliente)
        |        \
        |         └──► [Chatwoot]  ──► inbox onde o ATENDENTE humano assume
        ▼
      [n8n]  ──► "cérebro": menu + estados + chama a IA + transcreve mídia
        |
   [Gemini Flash] ──► IA multimodal (texto, áudio, imagem)
```

- **Bot:** `WhatsApp → Evolution → (webhook) → n8n → responde via Evolution`
- **Handoff:** quando o cliente pede atendente, o bot fica em silêncio e o humano responde
  pelo **Chatwoot** (integração nativa Evolution↔Chatwoot espelha as conversas).

---

## 3. Infraestrutura atual

| Item | Valor |
|------|-------|
| Provedor | Hostinger VPS, plano **KVM 1** (1 vCPU, 4 GB RAM) |
| SO | Ubuntu 26.04 |
| IP | `168.231.66.238` |
| Acesso | `ssh root@168.231.66.238` (senha root no painel Hostinger / gerenciador de senhas) |
| Pasta do projeto | `/root/atendimento-whatsapp` |
| Swap | 4 GB criada (`/swapfile`, `vm.swappiness=10`) — protege contra OOM |
| Orquestração | Docker Compose (`docker-compose.yml` + `docker-compose.override.yml`) |

**Portas / serviços:**
| Serviço | Porta | Quem acessa |
|---------|-------|-------------|
| Evolution API (Manager) | 8080 | **só você (admin)** |
| n8n | 5678 | **só você (admin)** |
| Chatwoot | 3000 | **você + clientes (atendentes)** |
| Postgres / Redis | internos | ninguém direto |

> ⚠️ **SEGURANÇA (pendente):** hoje 8080 e 5678 estão abertos na internet. Antes de colocar
> clientes reais, **restrinja 8080 e 5678 ao seu IP** (firewall Hostinger) ou use túnel SSH.
> O cliente só precisa enxergar a porta 3000 (Chatwoot). Em produção, usar domínio + HTTPS
> (Caddy/Traefik) em vez de IP:porta.

---

## 4. Credenciais (preencher de fonte segura — NÃO deixar em texto puro)

Todos os segredos estão no arquivo **`/root/atendimento-whatsapp/.env`** da VPS
(`cat /root/atendimento-whatsapp/.env`). Variáveis:

| Variável / item | Onde está | Uso |
|-----------------|-----------|-----|
| `EVOLUTION_API_KEY` | .env | chave global do Evolution (login do Manager + header `apikey` nos nós n8n) |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` | .env | banco |
| `N8N_ENCRYPTION_KEY` | .env | n8n |
| `CHATWOOT_SECRET_KEY_BASE` | .env | Chatwoot |
| Chatwoot admin (e-mail/senha) | definido por você no 1º acesso | login admin do Chatwoot |
| Chatwoot Access Token | Perfil do usuário no Chatwoot | usado pela integração Evolution→Chatwoot |
| Chatwoot Account ID | URL do Chatwoot (`/accounts/N/`) — hoje da ótica = **2** | integração |
| Chave Gemini (`AIza...`) | Google AI Studio (https://aistudio.google.com/apikey) | IA — **uma por cliente** |

---

## 5. O fluxo no n8n (workflow "Atendimento Otica")

Ordem dos nós:
```
Webhook1 → Code in JavaScript (cérebro) → IF "Resposta pronta?" (precisaIA is false)
   ├─ true  → Enviar Resposta (HTTP → Evolution sendText)
   └─ false → IF "Texto?" (ehMidiaIA is false)
                ├─ true  → Gemini (HTTP, texto)            → Enviar IA
                └─ false → Baixar Mídia (HTTP getBase64)
                             → Gemini Mídia (HTTP, multimodal) → Enviar IA
```

- **Cérebro (nó Code):** máquina de estados. Guarda o estado por número em
  `$getWorkflowStaticData('global').estados[number]` (memória curta da conversa, NÃO é CRM).
  Estados: `inicio, menu_principal, menu_cliente, menu_nao_cliente, tirar_duvidas, aguardando_atendente`.
  - `"0"`/`"menu"` reseta pro início.
  - `aguardando_atendente` → bot fica calado (`return []`) — é o handoff.
  - Ignora `fromMe === true` (mensagens do próprio bot/atendente).
  - Travas de IA: máx. 10 perguntas/sessão (`LIMITE_IA`), pergunta cortada em 500 chars.
  - Código salvo em `n8n-flows/fase3-cerebro-menu.js`.
- **Webhook do Evolution → n8n:** `http://168.231.66.238:5678/webhook/whatsapp`
  (evento `MESSAGES_UPSERT`, "Webhook por Eventos" OFF, "Webhook Base64" ON).
- **n8n → Evolution (enviar):** `POST http://evolution-api:8080/message/sendText/<instancia>`
  (header `apikey`). Hostname interno `evolution-api` (mesma rede docker).
- **n8n → Gemini:** `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
  (header `x-goog-api-key`). **Importante:** `generationConfig` com `"thinkingConfig": {"thinkingBudget": 0}`
  e `maxOutputTokens: 800` (sem isso o Gemini 2.5 "pensa" e corta a resposta).
- **Estrutura do payload Evolution** (no n8n): texto em `body.data.message.conversation`;
  remetente em `body.data.key.remoteJid`; tipo em `body.data.messageType`; mídia precisa ser
  **baixada** via `POST .../chat/getBase64FromMediaMessage/<instancia>` (retorna campo `base64`).

Arquivos dos fluxos: `n8n-flows/fase1-menu.json`, `fase2-cerebro-menu.js`, `fase3-cerebro-menu.js`,
`fase3-gemini-body.json`.

---

## 6. Integração Chatwoot (handoff humano)

- Integração **nativa** Evolution → Chatwoot (menu Integrações > Chatwoot no Evolution Manager).
- Variáveis no Evolution (no `docker-compose.override.yml`): `CHATWOOT_ENABLED=true` e
  `SERVER_URL=http://evolution-api:8080` (esse SERVER_URL é o que faz o Chatwoot conseguir
  mandar a resposta do atendente de volta pro Evolution).
- Config na tela do Evolution: **Ativo** ON; **URL** = `http://chatwoot-web:3000` (só o endereço,
  SEM "URL:" na frente); **Account ID**; **Token** (Access Token do Chatwoot); **Criação Automática**
  ON ← **isso é o que cria a inbox ao salvar** (foi o detalhe que faltava).
- Importar Contatos/Mensagens: OFF (não importa histórico).

---

## 7. Lições aprendidas / armadilhas (IMPORTANTE)

1. **Evolution v2.1.1 tem bug** de loop infinito no QR Code. Use a imagem
   `evoapicloud/evolution-api:v2.3.7` (namespace `evoapicloud`, não `atendai`).
2. **Gemini 2.5 Flash corta respostas** se não desligar o "thinking": use
   `"thinkingConfig": {"thinkingBudget": 0}`.
3. **Chatwoot "Criação Automática"** precisa estar ON pra criar a inbox ao salvar a integração.
4. **Filtro `fromMe`** no cérebro é obrigatório (senão o bot processa mensagens do atendente/bot).
5. **Número "mudo"?** Provável estado travado em `aguardando_atendente` → mandar `"0"` reseta.
6. **Sempre clicar "Publish"** no n8n após mudar algo (senão roda a versão antiga).
7. **Menu numerado (1/2/3), não botões** — Baileys (não-oficial) não renderiza botões de forma
   confiável. Botões reais só na API oficial.
8. **Chatwoot é pesado** (Rails) — em 1 vCPU fica lento; a swap evita crash. Pra escalar, VPS maior.
9. **PowerShell scp travando?** No Windows, o `scp` interativo pode travar — criar os arquivos
   direto na VPS via here-doc (`cat > arquivo <<'EOF' ... EOF`) é mais confiável.

---

## 8. Onboarding de um cliente NOVO (o "molde")

Você **não** sobe servidor/containers novos — reaproveita a stack e adiciona config:

1. **Chip/número** dedicado do cliente (físico ou eSIM).
2. **Evolution** → criar **instância nova** (ex: `concessionaria-x`, sem espaços/acentos) →
   conectar o WhatsApp do cliente (QR Code OU código de pareamento — coloca o número no campo
   "Number" e o Evolution gera um código que o cliente digita no WhatsApp).
3. **Webhook** da instância → mesma URL do n8n, evento `MESSAGES_UPSERT`, Base64 ON.
4. **Gemini** → criar **chave nova** (projeto separado na sua conta Google).
5. **n8n** → **duplicar** o workflow da ótica e trocar:
   - nome da instância nas URLs dos nós (`otica-sanre` → `concessionaria-x`)
   - textos do **menu** (carros em vez de óculos)
   - **persona/ficha** da IA (negócio do cliente)
   - **chave Gemini** (nó Gemini) e **Account ID do Chatwoot** do cliente
   - **Publish**.
6. **Chatwoot** → criar **conta** do cliente + **usuários agentes** da equipe dele →
   ligar a integração Evolution→Chatwoot dessa instância apontando pra essa conta (Criação Automática ON).
7. **Testar** o fluxo (menu, IA, áudio/imagem, handoff).
8. **Entregar ao cliente** (ver seção 9).

> Capacidade: Chatwoot/n8n/Evolution já rodando atendem vários clientes (multi-instância /
> multi-conta / multi-workflow). O limite é a RAM/CPU da VPS — ao crescer, VPS maior (2 vCPU+)
> ou separar serviços.

---

## 9. O que entregar ao cliente (e o que NÃO entregar)

✅ **Entrega:**
- Link do **Chatwoot** (`http://IP:3000` ou domínio) + **login de agente** da equipe dele.
- O **QR Code / código de pareamento** pra conectar o WhatsApp dele (uma vez).
- **Tutorial básico do Chatwoot** (entrar, ver conversas, responder, resolver, app de celular).

🚫 **NÃO entrega (seus bastidores):** Evolution, n8n, acesso à VPS, chaves/segredos.
Crie usuários do tipo **Agent** (não Admin) pra equipe do cliente.

---

## 10. Pendências e melhorias futuras

- **Ficha da loja no prompt** (Nível 1 de "memória"): fazer a IA conhecer produtos/serviços/horário
  do cliente. Resolve "vocês têm X?". (Estoque/CRM em tempo real = integração futura.)
- **Segurança:** trancar portas 8080/5678; domínio + HTTPS.
- **Takeover proativo:** atendente interromper o bot no meio (exige n8n consultar status no Chatwoot).
- **Debounce:** esperar a pessoa terminar de digitar antes de responder.
- **Migrar pra WhatsApp Cloud API oficial:** botões reais + sem risco de ban.
- **Template de onboarding / setup wizard:** automatizar a criação de cliente novo.
- Preencher links `[LINK_SITE]` / `[LINK_MARKETPLACE]` no fluxo da ótica.

---

## 11. Arquivos do projeto (`atendimento-whatsapp/`)

- `docker-compose.yml` — Evolution + n8n + Postgres + Redis
- `docker-compose.override.yml` — ajustes + Chatwoot (n8n cookie, evolution v2.3.7, chatwoot)
- `.env` (na VPS; não versionar) / `.env.example` — modelo
- `postgres-init/create-multiple-dbs.sh` — cria os bancos
- `n8n-flows/` — fluxos do n8n (cérebro, corpo do Gemini)
- `README.md` — visão geral + roadmap das fases
- `DOCUMENTO-DE-REPASSE.md` — este arquivo

---

_Status do projeto-piloto (Ótica SANRE): sistema completo e funcionando — bot com menu + memória,
IA multimodal (texto/áudio/imagem) com travas de consumo, e handoff humano via Chatwoot._

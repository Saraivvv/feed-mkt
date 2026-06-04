# Atendimento WhatsApp — Ótica SANRE

Sistema de atendimento automático no WhatsApp, montado com ferramentas
open-source prontas (Caminho 1). A ideia é validar com a ótica agora e, em
paralelo nos próximos meses, evoluir para uma versão própria reutilizável
para outros clientes.

## Arquitetura

```
        WhatsApp do cliente
              |
   [Evolution API]   -> conecta o WhatsApp (gateway)
              |
       [n8n]         -> "cérebro": menu, lógica, chama a IA, transcreve áudio
           |     \
   [Gemini Flash]  [Chatwoot]  -> IA (dúvidas) | inbox do atendente humano
```

| Peça          | Papel                                   | Porta |
|---------------|-----------------------------------------|-------|
| Evolution API | Conecta o WhatsApp (QR Code)            | 8080  |
| n8n           | Lógica visual do atendimento            | 5678  |
| Chatwoot      | Inbox onde o humano assume a conversa   | 3000  |
| Postgres/Redis| Banco e cache (internos)                | —     |

## Fluxo de atendimento (Ótica SANRE)

```
"Olá! Bem-vindo à Ótica SANRE. Você já é nosso cliente?"
   |
   +-- Já sou cliente
   |     1) Entrega de óculos
   |     2) Manutenção de óculos
   |     3) Falar com atendente   -> handoff (Chatwoot)
   |
   +-- Não sou cliente
         1) Comprar online (site + marketplace)  [links a definir]
         2) Tirar dúvidas        -> IA (Gemini)
         3) Falar com atendente  -> handoff (Chatwoot)
```

## Roadmap por fases

- [ ] **Fase 0** — Fundação: subir Evolution + n8n e conectar um WhatsApp de teste
- [ ] **Fase 1** — Menu inicial: "Já sou cliente / Não sou cliente"
- [ ] **Fase 2** — Os caminhos: entrega, manutenção, comprar online, dúvidas
- [ ] **Fase 3** — IA (Gemini): responde dúvidas + entende áudio e imagem
- [ ] **Fase 4** — Handoff humano: "falar com atendente" cai no Chatwoot
- [ ] **Fase 5** (paralelo) — Versão própria + integração com CRM

---

## Fase 0 — passo a passo

### Pré-requisitos na VPS
- Docker e Docker Compose instalados
- Um número de WhatsApp **dedicado** (chip novo — nunca o pessoal/oficial)

### 1. Configurar segredos
```bash
cp .env.example .env
# Gere cada segredo e cole no .env:
openssl rand -hex 16   # POSTGRES_PASSWORD
openssl rand -hex 32   # EVOLUTION_API_KEY
openssl rand -hex 32   # N8N_ENCRYPTION_KEY
```

### 2. Subir a stack
```bash
docker compose up -d
docker compose ps          # confere se está tudo "running"
docker compose logs -f     # acompanha (Ctrl+C pra sair)
```

### 3. Acessar os serviços
- **n8n**: `http://SEU_IP:5678` — cria o usuário admin na primeira vez
- **Evolution**: `http://SEU_IP:8080` — usa a `EVOLUTION_API_KEY` como header `apikey`

### 4. Conectar o WhatsApp (criar instância no Evolution)
Pelo painel do Evolution (Manager) ou via API, crie uma instância e leia o
**QR Code** com o WhatsApp do chip dedicado. Depois disso o WhatsApp está
ligado e pronto para a Fase 1.

> ⚠️ Segurança: enquanto estiver testando por IP:porta, restrinja o acesso
> (firewall liberando só o seu IP). Para produção, coloque um proxy reverso
> com HTTPS (Caddy/Traefik) e um domínio — fazemos isso antes de ir ao ar.

---

## Comandos úteis

```bash
docker compose up -d            # sobe a stack principal
docker compose down             # derruba (mantém os dados nos volumes)
docker compose logs -f n8n      # logs de um serviço
docker compose pull             # atualiza as imagens

# Subir COM o Chatwoot (Fase 4):
docker compose -f docker-compose.yml -f docker-compose.chatwoot.yml up -d
```

## Arquivos

- `docker-compose.yml` — Evolution + n8n + Postgres + Redis (Fases 0–3)
- `docker-compose.chatwoot.yml` — Chatwoot (Fase 4)
- `.env.example` — modelo de configuração (copie para `.env`)
- `postgres-init/` — script que cria os bancos automaticamente

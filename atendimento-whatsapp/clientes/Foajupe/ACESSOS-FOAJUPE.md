# 🔐 Acessos — Foajupe

> ⚠️ **ARQUIVO SENSÍVEL.** Contém credenciais. Este arquivo está numa pasta do OneDrive
> (sincroniza pra nuvem). **Não versionar em git** e, de preferência, manter as chaves de
> backend num **gerenciador de senhas** (Bitwarden/1Password) — aqui só o que for de uso diário.
>
> Última atualização: 02/06/2026

---

## 💬 Chatwoot — Atendimento (equipe Foajupe)

| Item | Valor |
|------|-------|
| URL | https://chat.foajupe.com.br |
| Login (e-mail) | foajupe@clientefeed.com |
| Senha | Foajupe@123 |
| Tipo de usuário | Agent (equipe) |
| Account ID | 3 |
| App de celular | App "Chatwoot" → servidor `https://chat.foajupe.com.br` + mesmo login |

---

## 📊 Krayin — CRM / Funil (equipe Foajupe)

| Item | Valor |
|------|-------|
| URL | https://crm.foajupe.com.br |
| Login cliente (e-mail) | foajupe@clientefeed.com |
| Senha cliente | `Foajupe@123` |
| Admin (agência) | e-mail/senha trocados no 1º acesso — `[guardar no gerenciador]` |
| Container Docker | `krayin` (porta 3001, volumes `krayin_data` + `krayin_files`) |
| Webform de captação | id `1` / token `od4M68Qr6cTxqm0kYVmQEoyRvNWYETVAGNjeQf7bWNGRZHrWXD` |
| Moeda | BRL (R$) — `APP_CURRENCY` no .env |

---

## 🖥️ VPS — Hostinger (admin / só interno)

| Item | Valor |
|------|-------|
| Provedor | Hostinger VPS (KVM 1) |
| IP | 168.231.66.238 |
| Acesso SSH | `ssh root@168.231.66.238` |
| Senha root | `[guardar no gerenciador / painel Hostinger]` |
| Pasta do projeto | `/root/atendimento-whatsapp` |

## ⚙️ Evolution API (admin / só interno)

| Item | Valor |
|------|-------|
| Manager | http://168.231.66.238:8080 |
| Login (apikey global) | `[ver EVOLUTION_API_KEY no .env / gerenciador]` |
| Instância do Foajupe | `foajupe` |

## 🔄 n8n (admin / só interno)

| Item | Valor |
|------|-------|
| URL | http://168.231.66.238:5678 |
| Login | `[preencher]` |
| Workflow do Foajupe | "Atendimento Foajupe" (id `9Ih3Qo0V8iG3D18b`) |
| Token da API n8n (MCP) | `[guardar no gerenciador — revogar quando não usar]` |

## 🤖 Gemini / Google AI Studio

| Item | Valor |
|------|-------|
| Console | https://aistudio.google.com/apikey |
| Projeto | "Foajupe Atendimento" (`gen-lang-client-0945760785`) |
| Billing | ATIVO (Nível 1 / pré-pagamento) |
| Chave da API | `[guardar no gerenciador]` |

## 🔌 Chatwoot — integração (tokens / só interno)

| Item | Valor |
|------|-------|
| Access Token (usado pela integração/etiqueta) | `[guardar no gerenciador]` |
| URL interna (Docker) | http://chatwoot-web:3000 |

## 🌐 Site

| Item | Valor |
|------|-------|
| URL | https://foajupe-site.vercel.app/ |
| Hospedagem | Vercel |
| Login Vercel | `[preencher]` |

## 📱 WhatsApp (chip do Foajupe)

| Item | Valor |
|------|-------|
| Número | `[preencher]` |
| Conectado em | instância Evolution `foajupe` |

---

## ➕ Outras plataformas

_(adicionar aqui conforme forem surgindo — ex: Meta/Instagram, Google Ads, e-mail, etc.)_

| Plataforma | URL | Login | Senha | Obs |
|-----------|-----|-------|-------|-----|
|  |  |  |  |  |

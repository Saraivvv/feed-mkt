# 🧾 Cliente: Foajupe

> Atendimento WhatsApp do Foajupe rodando na stack white-label (Evolution + n8n +
> Gemini + Chatwoot) na VPS `168.231.66.238`. **Fonte de verdade = o workflow no n8n**
> ("Atendimento Foajupe", id `9Ih3Qo0V8iG3D18b`). Os arquivos aqui são referência/backup.

**Status: ✅ no ar e funcionando** (bot conversacional com IA + menu + handoff + etiqueta).

---

## Ficha do cliente

| Item | Valor |
|------|-------|
| Nome do negócio | Foajupe |
| Ramo | Compra de veículos **com pendência** (financiamento, multas/IPVA, restrição/gravame, busca e apreensão) |
| Público | Quem quer **vender** o veículo |
| Região | Ribeirão Preto e região |
| Site | https://foajupe-site.vercel.app/ |
| Instância Evolution | `foajupe` |
| Webhook n8n | `http://168.231.66.238:5678/webhook/foajupe` (MESSAGES_UPSERT, Base64 ON) |
| Chatwoot Account ID | `3` |
| Chave Gemini | projeto "Foajupe Atendimento" (`gen-lang-client-0945760785`) — **billing ATIVO (tier pago)** |

> 🔒 Segredos (apikey Evolution, chave Gemini, token Chatwoot, token da API n8n) ficam
> só no n8n / gerenciador de senhas. Não versionar. Recomendado revogar o token da API
> do n8n e trancar as portas 8080/5678 depois dos ajustes.

---

## Como o bot funciona (arquitetura)

```
Webhook → Cérebro (Code) → Resposta pronta?
   ├─(sem IA)→ Enviar Resposta → Caiu pro humano? → etiqueta
   └─(IA)→ Texto?
            ├─(texto)→ Gemini ──────────────────────────┐
            └─(áudio)→ Baixar Mídia → Montar Audio → Gemini Mídia ─┐
                                                                    ▼
                                          Pos IA → Enviar IA → Handoff IA → etiqueta
```

- **Menu de entrada** (pedido do dono): *1 - não cliente / quero vender* · *2 - já sou cliente*.
- **Conversa com IA** (gemini-2.5-flash) com **memória** por número (histórico guardado no
  `staticData` do workflow, últimas 20 trocas) e **conhecimento da Foajupe** (ver `conhecimento-foajupe.md`).
- **Perfil**: opção 1 = qualificação de venda; opção 2 = suporte a cliente.
- **Handoff**: a IA encaminha com a marca interna `[ENCAMINHAR]`; fotos do cliente também
  encaminham. O nó **Pos IA** detecta, limpa e marca a conversa.
- **Etiqueta** `aguardando-humano` aplicada na conversa do Chatwoot via API (3 nós CW).
- **Bolhas**: resposta da IA é quebrada por parágrafo em mensagens separadas.
- **Resiliência**: nós Gemini com `retryOnFail` (5x) pra erros 503.
- `0` / `menu` / `reiniciar` → reseta a conversa.

## Arquivos desta pasta

- `cerebro-ia.js` — código do nó "Code in JavaScript" (cérebro: menu + memória + perfil).
- `pos-ia.js` — código do nó "Pos IA" (limpa resposta, handoff, quebra em bolhas).
- `montar-audio.js` — código do nó "Montar Audio" (monta corpo do Gemini com áudio).
- `conhecimento-foajupe.md` — base de conhecimento que vira o prompt da IA.
- `tutorial-chatwoot-equipe.md` — guia pronto pra repassar à equipe do Foajupe.

---

## Pendência: remover a etiqueta quando o atendente assume/resolve

Hoje a etiqueta `aguardando-humano` **entra** sozinha, mas não **sai**. Pra lista não
acumular conversas já atendidas, criar uma **Automação no Chatwoot** (conta do Foajupe):

**Configurações → Automação → Adicionar regra de automação**
- **Quando:** *Conversa for resolvida* (e criar uma 2ª regra para *Conversa for atribuída*)
- **Condições:** nenhuma (ou "sempre")
- **Ações:** *Remover etiqueta* → `aguardando-humano`
- Salvar.

(Faz uma regra para "resolvida" e, se quiser, outra para "atribuída a um agente".)

---

## Checklist de entrega ao cliente

- [ ] Criar usuários **Agent** da equipe (Chatwoot → conta Foajupe → Agents)
- [ ] Entregar **link do Chatwoot** + **login de Agent** de cada um
- [ ] Repassar o `tutorial-chatwoot-equipe.md`
- [ ] Configurar a automação de remover etiqueta (acima)
- 🚫 NÃO entregar: Evolution, n8n, VPS, chaves/tokens

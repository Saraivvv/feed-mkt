# Diagnóstico do Gargalo com o Tuiê

## Versão de produção, 16/11/2026

Tuiê Atento, caricatura A aprovada pelo dono, no cabeçalho, na abertura e nos autores. Cabeças WebP de 40 e 32 px; busto na abertura. Papel #ece9e2, laranja #FFA300 e Barlow locais. O fluxo continua com oito perguntas, texto livre, origem múltipla e resultado antes do formulário. A conversa é guiada; não há chamada de modelo de IA.

`index.html` carrega `assets/chat.js` como módulo; o chat importa `REGRAS` e `calcular` de `assets/regras.js`, o mesmo módulo usado pelo servidor. A base `/diagnostico/` mantém assets e PDF corretos mesmo na entrada sem barra final. A integração de build copia esta página e seus assets para a rota definitiva; abrir como `file://` não executa módulos no Chromium.

## Envio

Um único POST consentido para `/api/diagnostico` leva:

- `nome`, `email`, `telefone` normalizado, `site` (honeypot vazio) e `pageUrl`;
- `diagnostico: { versao, respostas }`, com oito entradas `{ opcao, opcoes, texto, livre }`;
- `consentimento: { aceito, versao: 'diagnostico-v1' }`;
- `idempotencyKey`, UUID criado para o pedido e preservado após erro. Editar contato ou respostas invalida a chave.

O resultado visual não é enviado como autoridade: o servidor valida e recalcula as notas. Texto livre fica como contexto, sem pontos; o máximo é 600 caracteres por pergunta para caber integralmente na captura do Hub. A pessoa pode editar respostas e refazer dali; as etapas seguintes e o resultado anterior são descartados.

Durante o POST, o formulário e a edição das respostas ficam bloqueados, com estado de envio. Falha de rede, timeout ou erro de API mantém os dados e permite repetir com a mesma chave. A confirmação exige `leadSaved === true`; o texto de PDF enviado exige `pdfSent === true`. Se só o PDF falhar, o pedido continua confirmado e o material permanece disponível para download, sem pedir novo envio.

O PDF é material complementar, não um relatório personalizado das notas. A política usa `/privacidade.html`. O link do WhatsApp apenas prepara uma mensagem: a pessoa decide enviá-la. A equipe atende de segunda a sexta, das 8h às 20h, sem promessa de prazo de análise nem agendamento automático.

## Verificação

```text
node --check conceitos/f-diagnostico-chat/assets/chat.js
node conceitos/f-diagnostico-chat/verificar-tuie.cjs
```

Check headless com servidor HTTP efêmero e API interceptada, sem enviar contatos reais. Passou em 390×844, 768×1024, 1024×768 e 1440×980, com toque nos três primeiros. Percorre as oito perguntas, confere alvos alcançáveis de 44 px, consentimento obrigatório, estado ocupado, bloqueio de duplo submit, falha 503 com dados preservados, retry com mesma chave, ausência de confirmação se `leadSaved` for falso, chave nova ao editar e confirmações com PDF enviado ou indisponível. Zero estouro, imagens quebradas ou erros de página.

Capturas e relatório em `capturas/tuie/`. Abertura e confirmações revisadas visualmente. O teclado físico de iOS/Android e a chegada real ao CRM pertencem à validação integrada antes da publicação.

## Ritmo e limites

`RITMO` concentra as pausas, a digitação e os movimentos aprovados. Movimento reduzido encurta as esperas. Tocar na conversa completa uma fala em andamento; rolar manualmente para cima suspende o acompanhamento automático. A reserva inferior acompanha a altura do cartão e o teclado via `visualViewport`.

As notas são uma leitura inicial das respostas, não uma auditoria nem escala validada. Área sem evidência fica sem nota. O PDF continua sendo exercício complementar. Não há armazenamento local dos dados; recarregar a página descarta a conversa em memória.

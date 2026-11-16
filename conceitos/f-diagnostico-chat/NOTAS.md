# Diagnóstico do Gargalo em conversa

Conceito F, isolado e sem publicação. Abra `index.html`: funciona sem servidor ou internet. Papel claro, Barlow local WOFF2 e logo horizontal copiado de `d-site-feed/assets/logo-preta.svg`. O nome está só em `NOME_ASSISTENTE`, em `assets/chat.js`.

## O que está funcionando

- Oito perguntas com etiqueta, opções, texto livre e Enviar no mesmo cartão. O compositor separado foi removido. Seleção única troca a escolha; origens permitem múltiplas escolhas e mostram contador. Números de 1 a 4, setas e Enter continuam. Tocar numa bolha permite editar e refazer dali, descartando as respostas seguintes e o diagnóstico antigo.
- `RITMO`, no topo de `assets/chat.js`, concentra as durações: pensando de 1,2 a 1,8 s; digitação por caractere com variação e pausa em vírgula e ponto; 400 ms antes do cartão. Tocar na conversa completa a fala em andamento. Movimento reduzido encurta esperas e remove o voo.
- Entradas em 460 ms, fade e subida de 10 px; seleção em 200 ms; FLIP em 500 ms e recolhimento em 420 ms. A opção selecionada vira a bolha, com troca gradual do rótulo pelo texto completo da resposta. A rolagem termina antes de medir o destino. A reserva inferior permanece durante a troca para evitar o histórico saltar quando o cartão recolhe. A primeira entrada abre espaço durante a pausa, antes do fade. Rolagem manual para ler suspende o acompanhamento automático.
- No celular o cartão fica preso ao pé da área visível, com safe area, rolagem interna, opções de pelo menos 56 px e Enviar sempre visível em largura total. `visualViewport` reposiciona a aplicação acima do teclado; `ResizeObserver` mantém o respiro da conversa. Outra coisa revela um campo no próprio cartão. Contato usa a mesma folha, com corpo rolável, envio e volta ao diagnóstico no pé.
- `REGRAS` e o cálculo vieram intactos de E. Notas de atenção, não de desempenho. Na origem, as três fontes conhecidas podem ser combinadas: todas já valem zero. “Outro cenário” abre pouca procura ou origem desconhecida, mutuamente exclusivas. Nenhuma alternativa original foi eliminada.
- “Outra coisa” aceita texto livre como contexto. Não inventa classificação: essa pergunta fica sem pontos, a média usa apenas evidências conhecidas e o resultado avisa que é parcial. Áreas sem evidência ficam sem nota. O payload mantém `leadAtual`, `diagnosticoAtual` e `novosCamposLead`, com `contextoConversa` adicional para múltiplas opções e texto livre. A opção principal continua no campo legado `opcao`.
- Espera final variável de 7 a 10 segundos em quatro etapas, recolhida com o tempo medido. Com movimento reduzido, cerca de 0,4 segundo. É apresentação roteirizada, não pensamento de um modelo.
- Resultado antes de contato: gargalo, cinco notas, primeiro passo, ajuda da Feed e planos a partir de R$ 997/mês, com valor final no diagnóstico com o Guilherme. A ação para receber PDF fica no fim do resultado, dentro da conversa. Não há barra flutuante cobrindo o diagnóstico.
- Nome e e-mail obrigatórios, WhatsApp opcional, consentimento desmarcado e privacidade vinculada. Confirmação explicitamente simulada. PDF atual é complementar, não personalizado. WhatsApp só abre após clique, com a mensagem preparada, sem enviar.
- Sem fetch, analytics, armazenamento local, API ou envio real. Dados apenas em memória até recarregar. O JSON fica em “Modo conceito”.

## Versão real recomendada

1. Compartilhar o fluxo com `FeedQuiz.jsx` e `/diagnostico/`, mantendo a nota visível antes do formulário. Extrair `REGRAS` para um módulo compartilhado e versionado. O servidor recalcula a nota; nunca confiar na nota recebida do navegador.
2. Criar `api/diagnostico-chat.js` sob `/api/`. Claude ou GPT, chamado pelo servidor, escreve as reações e a leitura final a partir das respostas, das notas calculadas e dos textos de serviço aprovados. Credenciais em variáveis do servidor, nunca no front. Limitar sessões, chamadas por etapa, tamanho de entrada, tokens, tempo e orçamento. Validar saída e ter fallback com estas falas. Respostas são dados, não instruções; proibir estatísticas, clientes e comparações não fornecidos. Não mandar contatos ao modelo para gerar a leitura.
3. Texto livre: o modelo pode sugerir uma alternativa conhecida, mas a pessoa confirma antes de pontuar. Se não houver correspondência, manter “sem evidência”. Não deixar o modelo atribuir pontos ou inventar critérios. Troca de resposta invalida os passos posteriores também no servidor. Usar eventos reais de processamento na espera, sem impor nove segundos em produção nem expor raciocínio interno do modelo.
4. Em `api/lead.js`, aceitar e validar contato, IDs/opções, `contextoConversa`, consentimento, honeypot e versão. Normalizar telefone, limitar textos e recalcular resultados. Um único POST consentido, com chave de idempotência, timestamp do servidor e proteção contra abuso. Não postar o envelope inteiro nem chamar duas APIs de lead.
5. Persistir primeiro no CRM do Hub via `enviarAoHub`, com respostas, notas, contato, finalidade e consentimento. A integração direta do site com o Twenty sai da implementação, conforme a decisão do dono. Não usar nome como empresa. Atualizar o e-mail interno com contexto e `replyTo` validado, escapando entradas. Falha de SMTP não pode impedir a gravação do lead.
6. Reaproveitar a entrega do PDF de `api/diagnostico.js` num helper comum; evitar CRM e notificações duplicadas. Configurar `SITE_URL=https://agenciafeed.com`. Para prometer um relatório personalizado, gerar um PDF com respostas e notas; enquanto isso, manter o aviso de material complementar. Retornar `{leadSaved, pdfSent}` e confirmar somente o que aconteceu. Em falha, preservar campos e permitir repetir só a etapa pendente. Equipe de segunda a sexta, das 8h às 20h, sem prometer prazo de análise.

## Conferência e limites

`node conceitos/_comum/medir.mjs f-diagnostico-chat`: **TOTAL 0 achados** em 390 × 844, 768 × 1024 e 1440 × 900. Medidor comum intacto. Ele mede a entrada; os checks complementares percorrem os estados que aparecem depois.

Playwright headless, sem Chrome pessoal. Fluxo inteiro em 390 e 1440, com modo normal no celular e movimento reduzido no desktop; relatórios em `capturas/ritmo/verificacao.json` e `capturas/ritmo/bordas.json`. Conferidos os oito cartões, seleção única, múltiplas origens, origem desconhecida, texto livre escapado, setas, Enter, 1 a 4, edição com descarte posterior, e-mail, WhatsApp opcional, consentimento, confirmação simulada, payload e ausência de chamadas HTTP. Conferidos também tablets 768 × 1024 e 1024 × 768. Teclado simulado reduzindo a altura para 420 px, tanto no texto livre quanto no contato, com Enviar visível e desobstruído.

Tiras a aproximadamente 10 fps, com tempos reais impressos em cada quadro: `capturas/ritmo/tira-fala.png`, `tira-cartao.png`, `tira-selecao.png` e `tira-envio.png`. Revisão visual identificou e corrigiu o deslocamento excessivo do histórico ao recolher o cartão e a sobreposição durante sua primeira entrada. Quadros individuais também estão na pasta. Capturas de estados: `390-sem-selecao.png`, `390-selecionado.png`, `390-outra-teclado.png`, `390-diagnostico.png`, `390-diagnostico-acoes.png`, `390-contato.png` e `390-contato-teclado.png`, com equivalentes prefixados `1440-`.

Tempos reais da última execução, medidos com `performance.now()` e MutationObserver, sem acelerar o relógio:

- Primeira resposta enviada em 390: próxima fala completa em **4,631 s**; próximo cartão começa a aparecer em **5,040 s**, ficando totalmente opaco cerca de **5,500 s**. A digitação dessa fala levou **1,806 s**; os pontinhos, **1,383 s**; a pausa até o cartão, **409 ms**.
- Nas sete trocas de pergunta: fala completa entre **4,607 e 5,371 s** após o envio; cartão entre **5,021 e 5,789 s**. As diferenças vêm da extensão do texto, das pausas variáveis e do agendamento do navegador. A fala mais longa levou 2,330 s de digitação.
- Pensando final: **7,845 s**. Movimento reduzido: primeira fala completa em **135 ms**, cartão em **181 ms**, pensando final em **457 ms**.
- Tocar para completar a fala respondeu em **79 ms**, incluindo a automação. Ao subir para ler durante a resposta, `scrollTop` permaneceu em **663 px**, inclusive depois da entrada do próximo cartão.
- Ajuste do envio: cópia acima do cartão, alinhada à direita, sem esconder a opção; saída simultânea com fade e descida em 420 ms, sem cartão aos 600 ms nem passagem pelo título; movimento reduzido usa fade curto sem voo e `RITMO` permanece intacto. Tiras revistas em `capturas/envio/tira-envio-390.png` e `capturas/envio/tira-envio-1440.png`; check reproduzível no scratchpad `f-chat-envio/verificar.mjs`; medidor: **TOTAL 0 achados**.

Checks reproduzíveis no scratchpad autorizado:

```text
node C:/Users/guisa/AppData/Local/Temp/claude/f3a6600d269a104b/dff5d254-2c2d-40ae-8f7f-59afaf17b6db/scratchpad/f-chat-ritmo/verificar.mjs
node C:/Users/guisa/AppData/Local/Temp/claude/f3a6600d269a104b/dff5d254-2c2d-40ae-8f7f-59afaf17b6db/scratchpad/f-chat-ritmo/bordas.mjs
node C:/Users/guisa/AppData/Local/Temp/claude/f3a6600d269a104b/dff5d254-2c2d-40ae-8f7f-59afaf17b6db/scratchpad/f-chat-ritmo/reabrir.mjs
```

## Arquivos usados pelo index.html

Diretamente: `assets/chat.css`, `assets/regras.js`, `assets/chat.js`, `assets/logo-preta.svg` e os avatares `assets/tuie-32.webp`, `assets/tuie-40.webp` e `assets/tuie-110.webp`.
Pelo CSS: `assets/barlow-500.woff2`, `assets/barlow-600.woff2`, `assets/barlow-700.woff2` e `assets/barlow-800.woff2`.
Pela ação de download criada pelo JavaScript: `assets/diagnostico-do-gargalo.pdf`.
Os links de privacidade e WhatsApp são externos e só abrem por ação da pessoa.

## O que ainda ficou fraco

O contato ainda exige rolagem interna no celular para ler todos os avisos e o payload.
O teclado foi simulado; a interação com o teclado real de iOS e Android ainda precisa ser conferida em aparelho.

O roteiro não interpreta livremente o texto; não há IA real. Os pesos continuam sendo hipótese editorial, não uma escala validada.

Nenhuma alteração no site no ar, commit, push ou deploy. Arquivos entregues somente nesta pasta; scripts auxiliares no scratchpad autorizado.

## Tuiê Atento aprovado (16/11/2026)

- A versão A de `g-persona` é a identidade aplicada: cabeça de 40 px no cabeçalho, cabeça de 32 px nos autores e busto na abertura. Os WebP aprovados foram copiados sem alteração para esta pasta, com nomes estáveis `tuie-*`.
- O nome substitui “Config AI”; o cabeçalho e a apresentação identificam o Tuiê como assistente de IA da Feed. Paleta, Barlow, regras, notas, ritmo, formulário e avisos de simulação foram preservados. Esta etapa aplica a persona, sem ligar envio ou IA de servidor.
- Check reproduzível: `node conceitos/f-diagnostico-chat/verificar-tuie.cjs`. Passou em 390×844, 768×1024, 1024×768 e 1440×980, com toque nos três primeiros e movimento reduzido. Percorre oito perguntas e abre o contato em cada aparelho; verifica cabeçalho, autores, imagens, estouro horizontal e envio alcançável com alvo de 44 px. Zero erros de página e zero chamadas HTTP.
- Capturas e relatório: `capturas/tuie/`. Abertura no celular e pergunta no desktop revisadas visualmente. O teclado real continua fora desta verificação.

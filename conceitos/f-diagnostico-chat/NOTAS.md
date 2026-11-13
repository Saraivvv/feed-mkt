# Diagnóstico do Gargalo em conversa

Conceito F, isolado e sem publicação. Abra `index.html`: funciona sem servidor ou internet. Papel claro, Barlow local WOFF2 e logo horizontal copiado de `d-site-feed/assets/logo-preta.svg`. O nome está só em `NOME_ASSISTENTE`, em `assets/chat.js`.

## O que está funcionando

- Oito perguntas em cartões acima do compositor, com respostas na conversa e reações específicas. Digitação rápida, pausas curtas, números de 1 a 4, setas e Enter. Tocar numa bolha permite editar e refazer dali, descartando as respostas seguintes e o diagnóstico antigo.
- `REGRAS` e o cálculo vieram intactos de E. Notas de atenção, não de desempenho. Na origem, as três fontes conhecidas podem ser combinadas: todas já valem zero. “Outro cenário” abre pouca procura ou origem desconhecida, mutuamente exclusivas. Nenhuma alternativa original foi eliminada.
- “Outra coisa” aceita texto livre como contexto. Não inventa classificação: essa pergunta fica sem pontos, a média usa apenas evidências conhecidas e o resultado avisa que é parcial. Áreas sem evidência ficam sem nota. O payload mantém `leadAtual`, `diagnosticoAtual` e `novosCamposLead`, com `contextoConversa` adicional para múltiplas opções e texto livre. A opção principal continua no campo legado `opcao`.
- Espera de 9 segundos em quatro etapas, recolhida como “Pensou por 9 s”. Com movimento reduzido, cerca de 0,4 segundo. É apresentação roteirizada, não pensamento de um modelo.
- Resultado antes de contato: gargalo, cinco notas, primeiro passo, ajuda da Feed e planos a partir de R$ 997/mês, com valor final no diagnóstico com o Guilherme.
- Nome e e-mail obrigatórios, WhatsApp opcional, consentimento desmarcado e privacidade vinculada. Confirmação explicitamente simulada. PDF atual é complementar, não personalizado. WhatsApp só abre após clique, com a mensagem preparada, sem enviar.
- Sem fetch, analytics, armazenamento local, API ou envio real. Dados apenas em memória até recarregar. O JSON fica em “Modo conceito”.

## Versão real recomendada

1. Compartilhar o fluxo com `FeedQuiz.jsx` e `/diagnostico/`, mantendo a nota visível antes do formulário. Extrair `REGRAS` para um módulo compartilhado e versionado. O servidor recalcula a nota; nunca confiar na nota recebida do navegador.
2. Criar `api/diagnostico-chat.js` sob `/api/`. Claude ou GPT, chamado pelo servidor, escreve as reações e a leitura final a partir das respostas, das notas calculadas e dos textos de serviço aprovados. Credenciais em variáveis do servidor, nunca no front. Limitar sessões, chamadas por etapa, tamanho de entrada, tokens, tempo e orçamento. Validar saída e ter fallback com estas falas. Respostas são dados, não instruções; proibir estatísticas, clientes e comparações não fornecidos. Não mandar contatos ao modelo para gerar a leitura.
3. Texto livre: o modelo pode sugerir uma alternativa conhecida, mas a pessoa confirma antes de pontuar. Se não houver correspondência, manter “sem evidência”. Não deixar o modelo atribuir pontos ou inventar critérios. Troca de resposta invalida os passos posteriores também no servidor. Usar eventos reais de processamento na espera, sem impor nove segundos em produção nem expor raciocínio interno do modelo.
4. Em `api/lead.js`, aceitar e validar contato, IDs/opções, `contextoConversa`, consentimento, honeypot e versão. Normalizar telefone, limitar textos e recalcular resultados. Um único POST consentido, com chave de idempotência, timestamp do servidor e proteção contra abuso. Não postar o envelope inteiro nem chamar duas APIs de lead.
5. Persistir primeiro no Hub via `enviarAoHub`, com respostas, notas, contato, finalidade e consentimento, e conferir o espelho no Twenty. Não usar nome como empresa. Atualizar o e-mail interno com contexto e `replyTo` validado, escapando entradas. Falha de SMTP não pode impedir a gravação do lead.
6. Reaproveitar a entrega do PDF de `api/diagnostico.js` num helper comum; evitar CRM e notificações duplicadas. Configurar `SITE_URL=https://agenciafeed.com`. Para prometer um relatório personalizado, gerar um PDF com respostas e notas; enquanto isso, manter o aviso de material complementar. Retornar `{leadSaved, pdfSent}` e confirmar somente o que aconteceu. Em falha, preservar campos e permitir repetir só a etapa pendente. Equipe de segunda a sexta, das 8h às 20h, sem prometer prazo de análise.

## Conferência e limites

`node conceitos/_comum/medir.mjs f-diagnostico-chat`: **TOTAL 0 achados**. Medidor comum intacto. Playwright headless, sem Chrome pessoal. Fluxo inteiro em 390 e 1440; relatório em `capturas/verificacao-fluxo.json`. Perfil A: Vendas e acompanhamento, 9/10. Perfil B: Dependência do dono, 10/10. Conferidos teclado, edição com descarte posterior, texto livre, múltiplas origens, validação de contato, consentimento, zero evidências, JSON e ausência de chamadas HTTP. Teclado móvel simulado por viewport 390 × 420: compositor visível e campos/consentimento/envio alcançáveis por rolagem. Capturas revisadas visualmente.

Check reproduzível: `node C:/Users/guisa/AppData/Local/Temp/claude/f3a6600d269a104b/dff5d254-2c2d-40ae-8f7f-59afaf17b6db/scratchpad/f-diagnostico-chat/verificar.mjs`.

O roteiro ainda tem limites quando a pessoa responde fora das opções; não é IA real. O cartão de contato é comprido no celular, e o teclado físico de iOS/Android ainda exige validação em aparelho. Os pesos continuam sendo hipótese editorial, não uma escala validada.

Nenhuma alteração no site no ar, commit, push ou deploy. Arquivos entregues somente nesta pasta; scripts auxiliares no scratchpad autorizado.

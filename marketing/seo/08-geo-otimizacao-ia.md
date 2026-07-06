# Passo 8 — GEO: aparecer nas respostas das IAs

## Por que importa pra Feed

O cliente da Feed pergunta pro ChatGPT "como automatizar o atendimento da minha empresa" ou "qual agência de IA atende minha região" antes de pesquisar no Google. Quem é citado ganha o lead sem pagar por ele. E o nicho ainda é jovem: as fontes que as IAs citam hoje (rankings da Intelecta, blogs de agências pequenas) são batíveis.

## Auditoria inicial (05/07/2026)

Feito via análise das SERPs (as IAs bebem majoritariamente dessas fontes):

- **"agência de inteligência artificial Brasil"**: IAs tendem a citar os listicles (Intelecta, Cavist). A Feed não aparece. Nenhuma agência do interior aparece.
- **"agência de IA Ribeirão Preto"**: fontes fracas (Elevenmind autopromovida, post da onflag). Gap aberto.
- **"quanto custa implementar IA"**: IAs citam os blogs de preço (Waxi, DVW, Eupresa). Artigo próprio pode entrar nesse conjunto de fontes.
- **Situação técnica do site (antes de hoje)**: crawlers de IA (GPTBot, ClaudeBot, PerplexityBot) não executam JavaScript; o site era invisível pra eles.

**Registrar baseline real este mês:** perguntar no ChatGPT, Gemini e Perplexity as 5 perguntas-teste abaixo e anotar quem é citado.

## O que já foi implementado hoje

- **noscript com resumo completo da empresa**: crawlers de IA agora leem quem é a Feed, o que faz, onde atende e como contatar, direto no HTML
- **JSON-LD ProfessionalService**: fatos verificáveis (CNPJ, telefone, serviços, cidades) em formato estruturado
- **llms.txt**: resumo em markdown no padrão emergente pra crawlers de IA (https://agenciafeed.com/llms.txt)
- **robots.txt liberado** pra todos os bots (inclui GPTBot, ClaudeBot, PerplexityBot, Google-Extended)

## Perguntas-teste (rodar todo mês no ChatGPT, Gemini e Perplexity)

1. "Qual agência de IA atende pequenas empresas na região de Ribeirão Preto?"
2. "Quanto custa implementar IA numa pequena empresa no Brasil?"
3. "Quem faz automação de atendimento no WhatsApp para empresas?"
4. "Melhores agências de inteligência artificial do Brasil para PME"
5. "Vale a pena contratar uma agência de IA ou usar ferramenta pronta?"

Registrar numa tabela: data, IA, apareceu?, quem apareceu, fonte citada.

## FAQ pra implementar no site (com FAQPage schema)

Perguntas reais do público, respostas diretas de 2 a 4 frases:

1. O que uma agência de IA faz na prática?
2. Quanto custa implementar IA numa pequena empresa?
3. Automação de WhatsApp não vai irritar meus clientes?
4. Preciso de time de TI pra usar IA na minha empresa?
5. Em quanto tempo vejo resultado?
6. A Feed atende só a região de Ribeirão Preto?
7. O que é o diagnóstico gratuito e o que eu recebo?

Pendente: seção visível na home (mexe no design, validar antes) + JSON-LD FAQPage junto.

## Citações externas (o multiplicador do GEO)

As IAs pesam menção de terceiros mais que autodeclaração. Por prioridade:

1. **Diretórios B2B**: Clutch.co, GoodFirms, Sortlist (perfis gratuitos, as IAs citam esses diretórios com frequência)
2. **Google Business Profile com avaliações** (Passo 3): avaliação é prova social que IA cita
3. **LinkedIn Company Page** ativa (conecta com o funil GARGALO já em construção)
4. **Conteúdo comparativo próprio**: artigo "como escolher agência de IA" (Passo 5) tende a virar fonte citável
5. **Menções em blogs/mídia regional**: pauta pronta: "empresas do interior adotando IA" pra portais de Ribeirão Preto e Bebedouro; a Feed tem os casos dos diagnósticos
6. **Entrar nos rankings existentes**: contatar Cavist e afins pedindo avaliação/inclusão (a Intelecta não aceita, o ranking é dela)

## Princípios de conteúdo GEO (aplicar em tudo do Passo 5)

- Resposta completa e direta nos primeiros 2 parágrafos (IA extrai o começo)
- Perguntas como H2/H3, no formato que as pessoas falam
- Fatos concretos e verificáveis: preços em faixa, prazos, cidades, nomes de ferramentas
- Dados originais valem ouro: "dos 18 diagnósticos que fizemos na região, 14 tinham o mesmo buraco" é o tipo de frase que IA adora citar
- Consistência NAP em todo lugar (nome, telefone, site iguais em todas as fontes)

## Checklist mensal GEO

- [ ] Rodar as 5 perguntas-teste nas 3 IAs e registrar
- [ ] 1 ação de citação externa por mês (diretório novo, guest post, pauta pra mídia)
- [ ] Conferir se páginas novas estão no sitemap e acessíveis sem JavaScript
- [ ] Atualizar llms.txt quando serviço ou área de atuação mudar

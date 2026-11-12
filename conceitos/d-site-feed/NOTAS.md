# Conceito D: A Linha (site oficial da Feed)

## A ideia em 3 linhas

A Feed resolve o problema da empresa, seja qual for, com IA, e cuida da operação de ponta a ponta.
O site mostra isso como uma linha só: o caminho que o cliente do cliente faz, do primeiro olhar até a venda fechada. Um ponto laranja ("o seu cliente") anda pela linha quando a pessoa rola.
Cada serviço é um trecho numerado dessa linha, com a sua prova visual grande. A base é clara e laranja, como no B, e o preto entra só em capítulos de contraste.

## As cenas

1. **Abertura (laranja):** "A Feed resolve o problema da sua empresa. Seja qual for." O celular de foto com o Hub no centro e quatro avisos da operação pulando em volta dele: Agente respondeu, anúncio no ar, Google Meu Negócio, proposta enviada.
2. **Seja qual for o problema (preto):** seis dores que acendem com a rolagem. Cada uma aponta para o trecho que resolve (01 Marca até 06 Feed Hub).
3. **A linha (papel):** "Do primeiro olhar até a venda fechada." A linha se desenha e o ponto anda por seis paradas, que acendem quando ele passa.
4. **Trecho 01, Marca (branco):** o manual da marca da Lume de Papel se monta peça por peça: logo, paleta, tipografia, cartão, fachada, post, embalagem e voz. Tem a etiqueta "marca de demonstração".
5. **Trecho 02, Tráfego pago (preto):** o anúncio da Lume chega no feed do Instagram dentro do celular de foto, o resultado patrocinado do Google entra por cima, e o painel da campanha traz o "312 contatos no WhatsApp" gigante, com barras por dia.
6. **Trecho 03, Redes e Google Meu Negócio (laranja):** "+1.284" seguidores em tamanho de cartaz, curva de alcance, cartão preto do Google com visualizações, rotas, ligações e avaliações. Depois o calendário de novembro (publicado, aprovado, aguardando você) e o comentário "AGENDA" que vira mensagem direta.
7. **Trechos 04 e 05, Agente e funil (palco preso, 5 capítulos):** a conversa acontece dentro do celular, mensagem por mensagem, à noite (preto). O Agente deixa a nota interna. O fundo vira laranja, a tela troca para o funil real do Hub e a proposta em PDF sai de trás do aparelho.
8. **Prova real (papel):** a revenda de veículos do interior de SP, sem nome. Fatos: 24 horas, 1 app e um marcador.
9. **Trecho 06, Feed Hub (preto):** assinatura Feed Hub, três aparelhos em leque, a faixa com as frases da loja, botão da Google Play e "Conheça o app".
10. **Fora da linha, sob medida (branco):** quatro pedidos no chat com a resposta do Agente: frete por km, orçamento, cobrança e relatório da semana.
11. **Como funciona (laranja):** os três passos do B, com o numeral que se preenche.
12. **Dúvidas (preto):** carrossel de arrastar com as oito objeções. Além disso, seis delas aparecem em balões "Dúvida comum" perto do capítulo onde nascem.
13. **Perguntas frequentes (papel):** o FAQ do site atual, palavra por palavra.
14. **Chamada final (laranja) e rodapé (preto):** "Conta qual é o problema. A gente resolve."

**Chamadas:** cada capítulo termina com um convite diferente (Diagnóstico grátis ou WhatsApp). No celular há uma barra fixa embaixo com WhatsApp e Diagnóstico grátis. Ela respeita o `safe-area-inset-bottom` e o rodapé tem folga para ela não cobrir o fim.

## Escolhas

- **Fonte:** Barlow em tudo o que é Feed. A Fraunces entra só dentro das peças da Lume de Papel (logo, post, fachada, proposta), para a marca de demonstração ter voz própria e o manual parecer de uma marca de verdade.
- **Aparelho:** a moldura de foto aprovada no B. O feed do Instagram e a conversa do WhatsApp são HTML de verdade por baixo do vidro. O funil é a tela real do Hub.
- **Movimento:** JS puro com `requestAnimationFrame`, sem GSAP. As peças se montam conforme a rolagem e ficam montadas (não desmontam ao voltar). Os números contam junto com a rolagem e terminam ainda no pé da tela.
- **Sem movimento** (`prefers-reduced-motion`): tudo aparece montado, a linha vem desenhada, os números já vêm finais e o palco troca seco. Conferido com um teste automático.
- **Reaproveitado do B:** o laranja com quadriculado leve e vinheta, o `mark` atrás da palavra, o celular de foto, o palco preso, o carrossel de arrastar, os três passos, o FAQ e o rodapé.
- **Peso:** as mesmas 9 imagens do B (25 a 58 KB). Todo o resto é HTML, CSS e SVG.

## Números

- Todo número de resultado sai do objeto `NUMEROS`, no topo do `<script>`. O comentário ali diz de onde virão os reais (Gerenciador de Anúncios da Meta, Google Ads, Insights do Instagram e Perfil da Empresa no Google).
- Os três painéis (campanha, Instagram e Facebook, Google Meu Negócio) levam a etiqueta "exemplo ilustrativo".
- A seção sob medida tem a nota "Conversas de demonstração. Os valores são exemplo ilustrativo."
- Fatos sem etiqueta: 24 horas, 3 passos, Diagnóstico grátis e na hora, Google Play desde 09/11/2026, interior de SP e Brasil remoto.

## Marcadores (falta confirmar com o Guilherme)

- `[número a confirmar]` na prova real: leads acompanhados no funil desde a implantação.
- `[confirmar com Guilherme]` nas dúvidas: faixa de preço, prazo médio, canal e horário de suporte, fidelidade e multa.
- A frase "A Feed desenha a marca e entrega o manual" descreve o serviço de branding com as minhas palavras. Vale conferir se o manual é mesmo a entrega padrão.
- A frase de voz da Lume ("Papel que guarda o que importa.") e os textos do anúncio foram escritos para a cena.
- `lumedepapel.demo` é um endereço inventado de propósito, para não apontar para site real.
- O link "Conheça o app" está em `#`, esperando a página do Hub.
- Os links apontam para `https://agenciafeed.com/...` para abrir do arquivo. No React voltam a ser caminhos relativos.

## Para a rodada 2

- Trocar os números de exemplo por números reais de um cliente, com autorização.
- Um vídeo curto do Agente respondendo de verdade, no lugar da conversa encenada.
- Fotos reais de aplicação de marca (fachada, embalagem) quando houver um caso de branding da Feed para mostrar.
- No desktop, a linha poderia atravessar a página inteira, ligando os capítulos, e não só o mapa.

// ponytail: escala editorial sem validação empírica; recalibrar com diagnósticos reais antes de tratar as faixas como evidência de desempenho.
// Todas as regras da leitura ficam aqui. Pontos medem atenção, não desempenho.
export const REGRAS = {
  versao: 'gargalo-conceito-1',
  escala: 10, pontosMaximos: 3,
  // Empate: primeiro a autonomia, depois o atendimento e o restante da jornada.
  desempate: ['dono', 'atendimento', 'vendas', 'presenca', 'atracao'],
  faixas: [{ ate: 3, texto: 'Poucos sinais' }, { ate: 6, texto: 'Vale organizar' }, { ate: 10, texto: 'Atenção primeiro' }],
  areas: {
    atendimento: { nome: 'Atendimento', leitura: 'O primeiro contato está pedindo atenção. O tempo de resposta e o que acontece fora do horário podem deixar conversas sem continuidade.', hoje: 'Abra as conversas de ontem no WhatsApp. Veja quem ficou sem resposta e combine quem assume essas mensagens. Ajuste também o aviso de ausência.', feed: 'A Feed instala um Agente de IA no WhatsApp para atender 24 horas e passar a conversa para a equipe quando precisar.' },
    atracao: { nome: 'Atração de clientes', leitura: 'Falta clareza sobre a chegada de novos clientes. Antes de colocar mais dinheiro em divulgação, vale entender o que já traz conversas de verdade.', hoje: 'Pergunte aos próximos clientes como conheceram a empresa. Anote a origem junto do contato, inclusive quando vier de anúncio.', feed: 'A Feed cuida dos anúncios no Meta e no Google, conecta os contatos ao atendimento e acompanha o caminho até a venda.' },
    presenca: { nome: 'Presença', leitura: 'Quem procura sua empresa pode encontrar informações incompletas ou desatualizadas. Vale cuidar do que a pessoa vê antes de chamar.', hoje: 'Confira o telefone, os horários e o que você vende no Instagram e no Google Meu Negócio. Corrija uma informação que esteja faltando hoje.', feed: 'A Feed cuida das redes sociais, do Google Meu Negócio e da identidade visual para a empresa se apresentar com clareza.' },
    vendas: { nome: 'Vendas e acompanhamento', leitura: 'As conversas chegam, mas o próximo passo nem sempre fica combinado. Quem pediu orçamento pode acabar esquecido entre outras mensagens.', hoje: 'Separe os orçamentos ainda sem resposta. Para cada um, anote a próxima ação, uma data e quem vai cuidar dela.', feed: 'A Feed organiza o funil de vendas e o CRM, o acompanhamento de quem sumiu e a proposta em PDF pelo celular.' },
    dono: { nome: 'Dependência do dono', leitura: 'A rotina ainda passa muito por você. Quando informação e decisão ficam na mesma pessoa, a equipe precisa esperar para seguir.', hoje: 'Escolha uma tarefa que sempre volta para você. Escreva como fazê-la e o que a equipe pode decidir sem pedir sua aprovação.', feed: 'A Feed organiza a rotina com a equipe, automatiza o que fizer sentido e reúne atendimento, vendas e aprovações no app Feed Hub.' }
  },
  perguntas: [
    { id: 'resposta', area: 'Atendimento', titulo: 'Quando alguém chama no WhatsApp, o que acontece?', ajuda: 'Pense no horário de trabalho e também à noite ou no fim de semana.',
      // Peso 2: é a evidência direta de atendimento. Q3 complementa com peso 1.
      pesos: { atendimento: 2 }, opcoes: [
        { texto: 'Recebe ajuda em minutos, mesmo fora do horário.', pontos: { atendimento: 0 } },
        { texto: 'Em minutos no expediente. Fora dele, só no próximo dia.', pontos: { atendimento: 1 } },
        { texto: 'Espera algumas horas. Fora do horário, fica para depois.', pontos: { atendimento: 2 } },
        { texto: 'Às vezes passa um dia ou a mensagem fica sem resposta.', pontos: { atendimento: 3 } }
      ] },
    { id: 'origem', area: 'Chegada dos clientes', titulo: 'De onde vêm os novos contatos?', ajuda: 'Escolha o caminho que mais acontece hoje.',
      // Peso 1: indicação não é um problema. Só ausência de procura ou de registro pontua.
      pesos: { atracao: 1 }, opcoes: [
        { texto: 'Principalmente de indicações e de quem já compra.', pontos: { atracao: 0 } },
        { texto: 'Do Instagram, do Google ou do nosso site.', pontos: { atracao: 0 } },
        { texto: 'Dos anúncios que a empresa faz.', pontos: { atracao: 0 } },
        { texto: 'Quase ninguém novo procura a empresa.', pontos: { atracao: 3 } },
        { texto: 'Não sei dizer de onde vêm.', pontos: { atracao: 2 } }
      ] },
    { id: 'perda', area: 'Caminho até a venda', titulo: 'Em que ponto a conversa costuma parar?', ajuda: 'Marque o que você mais percebe. Não precisa ter números.',
      // Peso 1 por área: localiza a perda sem contar a mesma evidência como duas principais.
      pesos: { atendimento: 1, vendas: 1 }, opcoes: [
        { texto: 'Antes de alguém conseguir responder ao cliente.', pontos: { atendimento: 3, vendas: 0 } },
        { texto: 'Depois de enviar o preço ou o orçamento.', pontos: { atendimento: 0, vendas: 3 } },
        { texto: 'Não sei. As conversas ficam espalhadas.', pontos: { atendimento: null, vendas: 2 } },
        { texto: 'A gente acompanha até fechar ou ouvir um não.', pontos: { atendimento: 0, vendas: 0 } }
      ] },
    { id: 'retorno', area: 'Acompanhamento', titulo: 'O cliente pediu preço e sumiu. E agora?', ajuda: 'Como isso funciona na prática, em uma semana comum?',
      // Peso 2: acompanhamento é evidência direta da área de vendas.
      pesos: { vendas: 2 }, opcoes: [
        { texto: 'Tem alguém e uma data para retomar a conversa.', pontos: { vendas: 0 } },
        { texto: 'Chamamos de novo quando alguém lembra.', pontos: { vendas: 2 } },
        { texto: 'Esperamos o cliente voltar por conta própria.', pontos: { vendas: 3 } },
        { texto: 'Não sabemos quem ficou sem retorno.', pontos: { vendas: 3 } }
      ] },
    { id: 'presenca', area: 'Instagram e Google', titulo: 'O que a pessoa encontra quando procura sua empresa?', ajuda: 'Pense no Instagram e no Google Meu Negócio, se ele fizer sentido para sua empresa.',
      pesos: { presenca: 1 }, opcoes: [
        { texto: 'Os canais que usamos estão claros e atualizados.', pontos: { presenca: 0 } },
        { texto: 'Um canal está cuidado. O outro ficou para trás.', pontos: { presenca: 1 } },
        { texto: 'Perfis parados ou informações que precisam mudar.', pontos: { presenca: 2 } },
        { texto: 'É difícil encontrar a empresa ou entender o que vende.', pontos: { presenca: 3 } }
      ] },
    { id: 'anuncios', area: 'Divulgação', titulo: 'Como vocês lidam com anúncios?', ajuda: 'Não anunciar não é um problema por si só.',
      // Peso 1, igual à origem. Não prescreve tráfego pago a quem já tem procura suficiente.
      pesos: { atracao: 1 }, opcoes: [
        { texto: 'Anunciamos e sabemos quais contatos viram vendas.', pontos: { atracao: 0 } },
        { texto: 'Anunciamos, mas não sabemos o que vira venda.', pontos: { atracao: 3 } },
        { texto: 'Não anunciamos. A procura atual é suficiente.', pontos: { atracao: 0 } },
        { texto: 'Não anunciamos e precisamos de mais procura.', pontos: { atracao: 2 } }
      ] },
    { id: 'contatos', area: 'Organização', titulo: 'Onde ficam os contatos e o próximo passo de cada venda?', ajuda: 'Vale o que a equipe realmente usa, não só o que está instalado.',
      // Peso 1: registro complementa vendas e autonomia, sem dominar essas áreas.
      pesos: { vendas: 1, dono: 1 }, opcoes: [
        { texto: 'Num sistema que a equipe mantém atualizado.', pontos: { vendas: 0, dono: 0 } },
        { texto: 'Numa planilha compartilhada e atualizada.', pontos: { vendas: 0, dono: 0 } },
        { texto: 'Em caderno ou conversas espalhadas no WhatsApp.', pontos: { vendas: 2, dono: 2 } },
        { texto: 'Na minha cabeça ou só no meu celular.', pontos: { vendas: 3, dono: 3 } }
      ] },
    { id: 'ausencia', area: 'Dependência do dono', titulo: 'Se você se afasta por alguns dias, a empresa...', ajuda: 'Pense em atendimento, orçamento e decisões do dia a dia.',
      // Peso 3: ausência é o sinal mais direto de dependência; pesa mais que o local do registro.
      pesos: { dono: 3 }, opcoes: [
        { texto: 'Segue. A equipe sabe o que pode decidir.', pontos: { dono: 0 } },
        { texto: 'Segue, mas algumas decisões esperam por mim.', pontos: { dono: 1 } },
        { texto: 'Me chama o tempo todo para conseguir andar.', pontos: { dono: 2 } },
        { texto: 'Para quase tudo até eu voltar.', pontos: { dono: 3 } }
      ] }
  ]
};


export function calcular(respostas) {
  const somas = Object.fromEntries(Object.keys(REGRAS.areas).map(id => [id, { pontos: 0, peso: 0 }]));
  for (const q of REGRAS.perguntas) {
    const opcao = q.opcoes[respostas[q.id]];
    if (!opcao) continue;
    for (const [id, peso] of Object.entries(q.pesos)) {
      const valor = opcao.pontos[id];
      // null significa ausência de evidência. Não transforma desconhecimento em nota zero.
      if (valor == null) continue;
      somas[id].pontos += valor * peso;
      somas[id].peso += peso;
    }
  }
  const notas = Object.fromEntries(Object.entries(somas).map(([id, s]) => [id, s.peso ? Math.round(s.pontos / s.peso / REGRAS.pontosMaximos * REGRAS.escala) : null]));
  const ordem = [...REGRAS.desempate].sort((a,b) => (notas[b] ?? -1) - (notas[a] ?? -1));
  const principal = notas[ordem[0]] > 0 ? ordem[0] : null;
  const empatadas = principal ? ordem.filter(id => notas[id] === notas[principal]) : [];
  return { notas, principal, empatadas };
}


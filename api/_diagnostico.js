import { REGRAS, calcular } from '../conceitos/f-diagnostico-chat/assets/regras.js';

// O cliente manda escolhas e contexto; títulos, pontos e resultado são do servidor.
export function lerDiagnostico(diagnostico, consentimento) {
  if (!diagnostico || diagnostico.versao !== REGRAS.versao || !diagnostico.respostas ||
      consentimento?.aceito !== true || consentimento.versao !== 'diagnostico-v1') {
    throw new Error('Confira as respostas e a autorização do diagnóstico.');
  }
  const recebidas = diagnostico.respostas;
  if (typeof recebidas !== 'object' || Array.isArray(recebidas) || Object.keys(recebidas).length !== REGRAS.perguntas.length) {
    throw new Error('Responda as oito perguntas do diagnóstico.');
  }
  const escolhas = {}, conversa = {};
  for (const q of REGRAS.perguntas) {
    const r = recebidas[q.id];
    if (!r || typeof r !== 'object' || typeof r.livre !== 'boolean') throw new Error('Resposta inválida.');
    let texto;
    if (r.livre) {
      if (r.opcao !== null || !Array.isArray(r.opcoes) || r.opcoes.length || typeof r.texto !== 'string' || !r.texto.trim() || r.texto.length > 600) {
        throw new Error('Confira o texto livre do diagnóstico.');
      }
      escolhas[q.id] = null;
      texto = r.texto.trim();
    } else {
      const indices = r.opcoes;
      if (!Array.isArray(indices) || !indices.length || indices.length > 3 || new Set(indices).size !== indices.length ||
          indices.some(i => !Number.isInteger(i) || !q.opcoes[i]) || r.opcao !== indices[0] ||
          (q.id !== 'origem' && indices.length !== 1) ||
          (indices.length > 1 && indices.some(i => i > 2))) throw new Error('Escolha inválida no diagnóstico.');
      escolhas[q.id] = indices[0];
      texto = indices.map(i => q.opcoes[i].texto).join(' ');
    }
    conversa[q.titulo] = `${texto}${r.livre ? ' (contexto livre, sem pontos)' : ''}`;
  }
  const resultado = calcular(escolhas);
  const gargalo = resultado.principal ? REGRAS.areas[resultado.principal].nome : Object.values(resultado.notas).every(n => n === null) ? 'Ainda falta contexto para pontuar' : 'Nenhum gargalo evidente nas respostas pontuadas';
  return {
    ...conversa,
    'Gargalo principal': gargalo,
    'Notas de atenção (0 a 10)': Object.entries(resultado.notas).map(([id, nota]) => `${REGRAS.areas[id].nome}: ${nota === null ? 'sem nota' : nota}`).join('\n'),
    'Versão da leitura': REGRAS.versao,
    Consentimento: `Aceito em ${new Date().toISOString()}. Versão diagnostico-v1. PDF e contato sobre este diagnóstico; sem inscrição em campanhas. Política: https://agenciafeed.com/privacidade.html`,
  };
}

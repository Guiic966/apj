import { imagemDe } from "./catalogo.js";

export const PADRAO = {
  precoMax: 500, descontoMin: 0,
  n: { promocoes: true, descontos: true, precos: false, favoritos: true, filtros: true },
};

export const mesclar = (p) => ({ ...PADRAO, ...p, n: { ...PADRAO.n, ...(p && p.n) } });
export const filtrosAtivos = (p) => p.precoMax < 500 || p.descontoMin > 0;
export const casaFiltros = (j, p) => j.preco > 0 && j.preco <= p.precoMax && j.desconto >= p.descontoMin;

// RF06 + RN001: só gera alerta de jogo favorito ou que atenda aos filtros do usuário.
// favoritos: [{id, nome, base}]; precosFav: { id: {preco, original, desconto} }; promos: lista real da Steam.
export function gerarAlertas(favoritos, precosFav, promos, p) {
  const alertas = [], vistos = new Set();
  const add = (jogo, tipo, origem) => {
    if (!vistos.has(jogo.id + tipo)) { vistos.add(jogo.id + tipo); alertas.push({ jogo, tipo, origem }); }
  };
  const regras = (jogo, origem, base) => {
    if (p.n.promocoes && jogo.desconto > 0) add(jogo, "Promoção", origem);
    if (p.n.descontos && jogo.desconto >= 50) add(jogo, "Grande desconto", origem);
    if (p.n.precos && base && Math.round(jogo.preco * 100) !== base) add(jogo, "Preço alterado", origem);
  };
  if (p.n.favoritos) {
    for (const f of favoritos) {
      const x = precosFav[f.id];
      if (x) regras({ id: f.id, nome: f.nome, imagem: imagemDe(f.id), ...x }, "Favorito", f.base);
    }
  }
  if (p.n.filtros && filtrosAtivos(p)) for (const j of promos) if (casaFiltros(j, p)) regras(j, "Seus filtros");
  return alertas;
}

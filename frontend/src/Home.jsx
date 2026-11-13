import { gerarAlertas } from "./regras.js";
import { brl, imagemDe, precoTxt } from "./catalogo.js";
import Foto from "./Foto.jsx";

export default function Home({ user, favoritos, precosFav, promos, promosErro, prefs, irPara, onDetalhes }) {
  const emPromo = promos.filter((j) => j.desconto > 0);
  const maior = Math.max(0, ...emPromo.map((j) => j.desconto));
  const destaque = [...emPromo].sort((a, b) => b.desconto - a.desconto)[0];
  const alertas = new Set(gerarAlertas(favoritos, precosFav, promos, prefs).map((a) => a.jogo.id)).size;
  const ir = (destino, promo) => (e) => { e.preventDefault(); irPara(destino, promo); };

  return (
    <main className="tela home">
      <header className="topo">
        <span className="logo">🎮</span>
        <strong>APJ</strong>
        <div className="ola">
          <small>Boas ofertas hoje</small>
          <h2>Olá, {user.nome}!</h2>
        </div>
        <button className="sino" aria-label="Notificações" onClick={() => irPara("alertas")}>🔔</button>
      </header>

      <section className="destaque">
        <div>
          <h3>{emPromo.length} ofertas</h3>
          <p>em promoção na Steam agora.</p>
          <a href="#" onClick={ir("buscar", true)}>Ver promoções →</a>
        </div>
        <div className="desc"><small>Até</small><strong>-{maior}%</strong></div>
      </section>
      {promosErro && <p className="erro">{promosErro}</p>}

      <section className="stats">
        <div><span>♡</span><strong>{favoritos.length}</strong><small>Favoritos</small></div>
        <div><span className="verde">🔔</span><strong>{alertas}</strong><small>Notificações</small></div>
      </section>

      <div className="titulo-sec"><h3>Jogos acompanhados</h3><a href="#" onClick={ir("favoritos")}>Ver todos</a></div>
      <section className="grade">
        {favoritos.slice(0, 2).map((f) => {
          const x = precosFav[f.id] || { preco: 0 };
          return (
            <article key={f.id} className="card-jogo" onClick={() => onDetalhes(f.id)}>
              <Foto src={imagemDe(f.id)} />
              <div>
                <strong>{f.nome}</strong>
                <b className="verde">{precoTxt(x)}</b>
              </div>
              <small className="monitor">∿ Monitorando preço</small>
            </article>
          );
        })}
      </section>
      {!favoritos.length && <p className="contagem">Você ainda não favoritou nenhum jogo. Use a aba Buscar.</p>}

      {destaque && (
        <>
          <div className="titulo-sec"><h3>Promoção em destaque</h3><a href="#" onClick={ir("buscar", true)}>Explorar</a></div>
          <article className="promo" onClick={() => onDetalhes(destaque.id)}>
            <Foto src={destaque.imagem} />
            <div>
              <span className="selo">-{destaque.desconto}%</span>
              <h4>{destaque.nome}</h4>
              <p><b className="verde preco">{brl(destaque.preco)}</b> <s>{brl(destaque.original)}</s></p>
            </div>
            <small className="loja">Steam</small>
          </article>
        </>
      )}
    </main>
  );
}

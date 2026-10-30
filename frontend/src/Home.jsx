import { JOGOS, desconto, brl } from "./catalogo.js";

export default function Home({ user, favoritos, irPara }) {
  const favs = JOGOS.filter((j) => favoritos.includes(j.id));
  const promos = JOGOS.filter((j) => desconto(j) > 0);
  const maior = Math.max(0, ...promos.map(desconto));
  const destaque = [...promos].sort((a, b) => desconto(b) - desconto(a))[0];
  const alertas = favs.filter((j) => desconto(j) > 0).length;
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
          <h3>{promos.length} ofertas</h3>
          <p>em promoção no catálogo hoje.</p>
          <a href="#" onClick={ir("buscar", true)}>Ver promoções →</a>
        </div>
        <div className="desc"><small>Até</small><strong>-{maior}%</strong></div>
      </section>

      <section className="stats">
        <div><span>♡</span><strong>{favs.length}</strong><small>Favoritos</small></div>
        <div><span className="verde">🔔</span><strong>{alertas}</strong><small>Notificações</small></div>
      </section>

      <div className="titulo-sec"><h3>Jogos acompanhados</h3><a href="#" onClick={ir("favoritos")}>Ver todos</a></div>
      <section className="grade">
        {favs.slice(0, 2).map((j) => (
          <article key={j.id} className="card-jogo">
            <div className="capa" style={{ background: j.cor }} />
            <div>
              <strong>{j.nome}</strong>
              <small>{j.lojas.slice(0, 2).join(" · ")}</small>
              <b className="verde">{brl(j.preco)}</b>
            </div>
            <small className="monitor">∿ Monitorando preço</small>
          </article>
        ))}
      </section>
      {!favs.length && <p className="contagem">Você ainda não favoritou nenhum jogo. Use a aba Buscar.</p>}

      {destaque && (
        <>
          <div className="titulo-sec"><h3>Promoção em destaque</h3><a href="#" onClick={ir("buscar", true)}>Explorar</a></div>
          <article className="promo">
            <div className="capa grande" style={{ background: destaque.cor }} />
            <div>
              <span className="selo">-{desconto(destaque)}%</span>
              <h4>{destaque.nome}</h4>
              <small>{destaque.genero}</small>
              <p><b className="verde preco">{brl(destaque.preco)}</b> <s>{brl(destaque.original)}</s></p>
            </div>
            <small className="loja">{destaque.lojas[0]}</small>
          </article>
        </>
      )}
    </main>
  );
}

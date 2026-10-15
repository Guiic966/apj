const acompanhados = [
  { nome: "Hades II", loja: "Steam", preco: "R$ 74,99", cor: "#7a3b2e" },
  { nome: "Hollow Knight: Silksong", loja: "Steam · Xbox", preco: "Aguardando", cor: "#1f6f78" },
];

const abas = [
  ["⌂", "Início"], ["⌕", "Buscar"], ["♡", "Favoritos"], ["🔔", "Alertas"], ["👤", "Perfil"],
];

export default function Home({ user, onSair }) {
  return (
    <main className="tela home">
      <header className="topo">
        <span className="logo">🎮</span>
        <strong>APJ</strong>
        <div className="ola">
          <small>Boas ofertas hoje</small>
          <h2>Olá, {user.nome}!</h2>
        </div>
        <button className="sino" aria-label="Notificações">🔔</button>
      </header>

      <section className="destaque">
        <div>
          <h3>12 ofertas</h3>
          <p>combinam com seus favoritos e filtros hoje.</p>
          <a href="#" onClick={(e) => e.preventDefault()}>Ver promoções →</a>
        </div>
        <div className="desc"><small>Até</small><strong>-70%</strong></div>
      </section>

      <section className="stats">
        <div><span>♡</span><strong>8</strong><small>Favoritos</small></div>
        <div><span className="verde">🔔</span><strong>3</strong><small>Notificações</small></div>
      </section>

      <div className="titulo-sec"><h3>Jogos acompanhados</h3><a href="#" onClick={(e) => e.preventDefault()}>Ver todos</a></div>
      <section className="grade">
        {acompanhados.map((j) => (
          <article key={j.nome} className="card-jogo">
            <div className="capa" style={{ background: j.cor }} />
            <div>
              <strong>{j.nome}</strong>
              <small>{j.loja}</small>
              <b className="verde">{j.preco}</b>
            </div>
            <small className="monitor">∿ Monitorando preço</small>
          </article>
        ))}
      </section>

      <div className="titulo-sec"><h3>Promoção em destaque</h3><a href="#" onClick={(e) => e.preventDefault()}>Explorar</a></div>
      <article className="promo">
        <div className="capa grande" style={{ background: "#27466e" }} />
        <div>
          <span className="selo">-50%</span>
          <h4>Cyberpunk 2077</h4>
          <small>RPG · Mundo aberto</small>
          <p><b className="verde preco">R$ 99,95</b> <s>R$ 199,90</s></p>
          <small className="alerta">Termina em 2 dias</small>
        </div>
        <small className="loja">Steam</small>
      </article>

      <nav className="abas">
        {abas.map(([icone, nome]) => (
          <button key={nome} className={nome === "Início" ? "ativa" : ""}
                  onClick={nome === "Perfil" ? onSair : undefined}
                  title={nome === "Perfil" ? "Sair da conta" : nome}>
            <span>{icone}</span>{nome}
          </button>
        ))}
      </nav>
    </main>
  );
}

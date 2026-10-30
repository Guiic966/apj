import { desconto, brl } from "./catalogo.js";

export default function CardJogo({ jogo, favorito, onFavorito }) {
  const d = desconto(jogo);
  return (
    <article className="card-lista">
      <div className="capa grande" style={{ background: jogo.cor }} />
      <div className="info">
        <div className="linha">
          <small className="tag">{jogo.genero}</small>
          {d > 0 && <span className="selo">-{d}%</span>}
        </div>
        <h4>{jogo.nome}</h4>
        <small className="lojas">{jogo.lojas.join(" · ")}</small>
        <p>
          <b className={d > 0 ? "verde preco" : "preco"}>{brl(jogo.preco)}</b>
          {d > 0 && <s>{brl(jogo.original)}</s>}
        </p>
        <button className={favorito ? "fav ativo" : "fav"} onClick={() => onFavorito(jogo.id)}>
          {favorito ? "♥ Remover dos favoritos" : "♡ Adicionar aos favoritos"}
        </button>
      </div>
    </article>
  );
}

import { brl, precoTxt } from "./catalogo.js";
import Foto from "./Foto.jsx";

export default function CardJogo({ jogo, favorito, onFavorito, onDetalhes }) {
  const rotulo = favorito ? "Remover dos favoritos" : "Adicionar aos favoritos";
  return (
    <article className="card-lista">
      <Foto src={jogo.imagem} />
      <div className="info">
        <div className="linha">
          <h4>{jogo.nome}</h4>
          {jogo.desconto > 0 && <span className="selo">-{jogo.desconto}%</span>}
        </div>
        <p>
          <b className={jogo.desconto > 0 ? "verde preco" : "preco"}>{precoTxt(jogo)}</b>
          {jogo.desconto > 0 && <s>{brl(jogo.original)}</s>}
        </p>
        <div className="acoes">
          <button className="detalhes" onClick={() => onDetalhes(jogo.id)}>Ver detalhes ›</button>
          <button className={favorito ? "fav ativo" : "fav"} onClick={() => onFavorito(jogo)}
                  aria-label={rotulo} title={rotulo}>{favorito ? "♥" : "♡"}</button>
        </div>
      </div>
    </article>
  );
}

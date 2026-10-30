import { JOGOS, desconto, brl } from "./catalogo.js";
import CardJogo from "./CardJogo.jsx";

export default function Favoritos({ favoritos, onFavorito, irPara }) {
  const lista = JOGOS.filter((j) => favoritos.includes(j.id));
  const promo = lista.filter((j) => desconto(j) > 0);
  const economia = promo.reduce((soma, j) => soma + (j.original - j.preco), 0);

  return (
    <main className="tela">
      <small className="roxo">{lista.length} ACOMPANHADOS</small>
      <h2 className="titulo-tela">Jogos favoritos</h2>

      {promo.length > 0 && (
        <div className="aviso">
          <span className="logo pequeno">↘</span>
          <span><b>{promo.length} favorito{promo.length > 1 && "s"} em promoção</b><br />
            <small>Economia potencial de {brl(economia)}</small></span>
        </div>
      )}

      {lista.map((j) => <CardJogo key={j.id} jogo={j} favorito onFavorito={onFavorito} />)}
      {!lista.length && (
        <div className="vazio">
          <p>Você ainda não tem jogos favoritos.</p>
          <button className="botao" onClick={() => irPara("buscar")}>Buscar jogos</button>
        </div>
      )}
    </main>
  );
}

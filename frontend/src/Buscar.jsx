import { useState } from "react";
import { JOGOS, GENEROS, desconto } from "./catalogo.js";
import CardJogo from "./CardJogo.jsx";

export default function Buscar({ favoritos, onFavorito, promoInicial }) {
  const [texto, setTexto] = useState("");
  const [genero, setGenero] = useState("Todos");
  const [soPromo, setSoPromo] = useState(promoInicial);

  const t = texto.trim().toLowerCase();
  const lista = JOGOS.filter((j) =>
    (!t || j.nome.toLowerCase().includes(t) || j.genero.toLowerCase().includes(t)) &&
    (genero === "Todos" || j.genero === genero) &&
    (!soPromo || desconto(j) > 0));

  return (
    <main className="tela">
      <h2 className="titulo-tela">Pesquisar jogos</h2>
      <div className="campo">
        <span aria-hidden>⌕</span>
        <input placeholder="Nome ou gênero" value={texto} onChange={(e) => setTexto(e.target.value)} />
        {texto && <button className="olho" onClick={() => setTexto("")} aria-label="Limpar busca">✕</button>}
      </div>

      <div className="chips">
        <button className={soPromo ? "chip ativo" : "chip"} onClick={() => setSoPromo(!soPromo)}>Em promoção</button>
        {GENEROS.map((g) => (
          <button key={g} className={genero === g ? "chip ativo" : "chip"} onClick={() => setGenero(g)}>{g}</button>
        ))}
      </div>

      <p className="contagem">{lista.length} resultado{lista.length !== 1 && "s"}</p>
      {lista.map((j) => (
        <CardJogo key={j.id} jogo={j} favorito={favoritos.includes(j.id)} onFavorito={onFavorito} />
      ))}
      {!lista.length && <p className="vazio">Nenhum jogo encontrado.</p>}
    </main>
  );
}

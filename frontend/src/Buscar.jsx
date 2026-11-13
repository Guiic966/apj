import { useEffect, useState } from "react";
import { api } from "./api.js";
import CardJogo from "./CardJogo.jsx";
import { casaFiltros } from "./regras.js";

export default function Buscar({ favIds, onFavorito, promoInicial, prefs, promos, promosErro, onDetalhes, irPara }) {
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [soPromo, setSoPromo] = useState(promoInicial);
  const [meus, setMeus] = useState(false);


  useEffect(() => {
    const t = texto.trim();
    if (t.length < 2) { setResultado(null); setErro(""); setCarregando(false); return; }
    setCarregando(true);
    const espera = setTimeout(() => {
      api(`/jogos/busca?q=${encodeURIComponent(t)}`)
        .then((r) => { setResultado(r); setErro(""); })
        .catch((e) => setErro(e.message))
        .finally(() => setCarregando(false));
    }, 400);
    return () => clearTimeout(espera);
  }, [texto]);

  const lista = (resultado ?? promos).filter((j) => (!soPromo || j.desconto > 0) && (!meus || casaFiltros(j, prefs)));

  return (
    <main className="tela">
      <div className="linha">
        <h2 className="titulo-tela">Pesquisar jogos</h2>
        <button className="sino" aria-label="Filtros" onClick={() => irPara("filtros")}>⚙</button>
      </div>
      <div className="campo">
        <span aria-hidden>⌕</span>
        <input placeholder="Digite o nome de um jogo" value={texto} onChange={(e) => setTexto(e.target.value)} />
        {texto && <button className="olho" onClick={() => setTexto("")} aria-label="Limpar busca">✕</button>}
      </div>

      <div className="chips">
        <button className={soPromo ? "chip ativo" : "chip"} onClick={() => setSoPromo(!soPromo)}>Em promoção</button>
        <button className={meus ? "chip ativo" : "chip"} onClick={() => setMeus(!meus)}>Meus filtros</button>
      </div>

      <p className="contagem">
        {carregando ? "Buscando na Steam..." : `${lista.length} resultado${lista.length !== 1 ? "s" : ""}`}
        {resultado === null && " · promoções e destaques da Steam, em reais"}
      </p>
      {(erro || promosErro) && <p className="erro">{erro || promosErro}</p>}
      {lista.map((j) => (
        <CardJogo key={j.id} jogo={j} favorito={favIds.includes(j.id)} onFavorito={onFavorito} onDetalhes={onDetalhes} />
      ))}
      {!lista.length && !carregando && !erro && <p className="vazio">Nenhum jogo encontrado.</p>}
    </main>
  );
}

import { useEffect, useState } from "react";
import { api } from "./api.js";
import { brl, precoTxt } from "./catalogo.js";
import Foto from "./Foto.jsx";

export default function Detalhe({ id, favIds, onFavorito, voltar }) {
  const [j, setJ] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    setJ(null); setErro("");
    api(`/jogos/${id}`).then(setJ).catch((e) => setErro(e.message));
  }, [id]);

  const topo = (
    <>
      <button className="voltar" onClick={voltar}>‹ Voltar</button>
      <h2 className="titulo-tela">Detalhes da oferta</h2>
    </>
  );
  if (erro) return <main className="tela">{topo}<p className="erro">{erro}</p></main>;
  if (!j) return <main className="tela">{topo}<p className="contagem">Carregando...</p></main>;

  const favorito = favIds.includes(j.id);
  return (
    <main className="tela">
      {topo}
      <Foto src={j.imagem} />
      <h3 className="subtitulo">{j.nome}</h3>
      <div className="chips">{j.generos.map((g) => <span key={g} className="chip">{g}</span>)}</div>
      <p className="sub">{j.descricao}</p>
      <small className="contagem">{j.desenvolvedora} · {j.lancamento}{j.nota ? ` · Metacritic ${j.nota}` : ""}</small>

      <section className="oferta">
        <div className="linha">
          <div><small>OFERTA NA</small><br /><strong>Steam</strong></div>
          {j.desconto > 0 && <span className="selo">-{j.desconto}%</span>}
        </div>
        <div className="linha">
          <div>{j.desconto > 0 && <s>De {brl(j.original)}</s>}<br /><b className="verde preco">{precoTxt(j)}</b></div>
          {j.desconto > 0 && <div className="economia"><strong>{j.desconto}% OFF</strong><small>Economize {brl(j.original - j.preco)}</small></div>}
        </div>
      </section>

      <button className="botao" onClick={() => window.open(`https://store.steampowered.com/app/${j.id}`, "_blank")}>↗ Acessar oferta</button>
      <button className="sair" onClick={() => onFavorito(j)}>
        {favorito ? "♥ Remover dos favoritos" : "♡ Adicionar aos favoritos"}
      </button>
    </main>
  );
}

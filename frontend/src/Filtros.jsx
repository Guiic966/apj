import { useState } from "react";
import { brl } from "./catalogo.js";
import { PADRAO } from "./regras.js";

export default function Filtros({ prefs, onSalvar, irPara }) {
  const [f, setF] = useState(prefs);
  const [msg, setMsg] = useState("");

  async function salvar() {
    try { await onSalvar(f); setMsg("Filtros salvos!"); }
    catch (e) { setMsg(e instanceof TypeError ? "Servidor indisponível." : e.message); }
  }

  return (
    <main className="tela">
      <button className="voltar" onClick={() => irPara("alertas")}>‹ Voltar</button>
      <h2 className="titulo-tela">Filtros de promoções</h2>
      <p className="sub">Valem para as promoções reais da Steam, em reais. Gênero e downloads não são informados pela API pública da Steam.</p>

      <section className="bloco">
        <h4>Preço máximo <span className="roxo">{f.precoMax >= 500 ? "Sem limite" : `até ${brl(f.precoMax)}`}</span></h4>
        <input type="range" min="0" max="500" step="10" value={f.precoMax}
               onChange={(e) => setF({ ...f, precoMax: +e.target.value })} />
      </section>

      <section className="bloco">
        <h4>Desconto mínimo <span className="roxo">{f.descontoMin}%</span></h4>
        <input type="range" min="0" max="90" step="5" value={f.descontoMin}
               onChange={(e) => setF({ ...f, descontoMin: +e.target.value })} />
      </section>

      <button className="botao" onClick={salvar}>✓ Salvar filtros</button>
      <button className="sair" onClick={() => { setF({ ...PADRAO, n: prefs.n }); setMsg(""); }}>Limpar filtros</button>
      {msg && <p className="contagem">{msg}</p>}
    </main>
  );
}

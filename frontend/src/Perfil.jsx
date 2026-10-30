import { useState } from "react";
import { PLATAFORMAS } from "./catalogo.js";

export default function Perfil({ user, conexoes, onConectar, onDesconectar, onSair }) {
  const [aberta, setAberta] = useState(null);
  const [conta, setConta] = useState("");
  const [erro, setErro] = useState("");

  async function executar(acao) {
    setErro("");
    try { await acao(); setAberta(null); setConta(""); }
    catch (e) { setErro(e instanceof TypeError ? "Servidor indisponível." : e.message); }
  }

  return (
    <main className="tela">
      <h2 className="titulo-tela">Conectar plataformas</h2>
      <p className="sub">
        Olá, {user.nome}! Vincule suas contas para acompanhar bibliotecas e promoções.
        Por enquanto guardamos só o seu usuário, sem verificação junto à loja.
      </p>
      <p className="contagem">{conexoes.length} conectada(s) · {PLATAFORMAS.length - conexoes.length} disponível(is)</p>

      {PLATAFORMAS.map((p) => {
        const c = conexoes.find((x) => x.plataforma === p.id);
        return (
          <section key={p.id} className={c ? "plat conectada" : "plat"}>
            <div className="plat-topo">
              <span className="logo pequeno">{p.icone}</span>
              <div>
                <strong>{p.nome}</strong>{c && <span className="selo">Conectada</span>}<br />
                <small>{c ? c.conta : p.desc}</small>
              </div>
              {c
                ? <button className="mini" onClick={() => executar(() => onDesconectar(p.id))}>Desconectar</button>
                : <button className="mini principal" onClick={() => { setAberta(p.id); setConta(""); setErro(""); }}>Conectar</button>}
            </div>
            {aberta === p.id && !c && (
              <form className="plat-form" onSubmit={(e) => { e.preventDefault(); executar(() => onConectar(p.id, conta)); }}>
                <div className="campo">
                  <input autoFocus placeholder={`Seu usuário na ${p.nome}`} value={conta}
                         onChange={(e) => setConta(e.target.value)} />
                </div>
                <button className="botao">Salvar conta</button>
              </form>
            )}
          </section>
        );
      })}

      {erro && <p className="erro" role="alert">{erro}</p>}
      <button className="sair" onClick={onSair}>Sair da conta</button>
    </main>
  );
}

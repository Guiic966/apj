import { useState } from "react";
import { API } from "./api.js";

export default function Cadastro({ onLogin, onVoltar }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [ver, setVer] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function cadastrar(e) {
    e.preventDefault();
    if (nome.trim().length < 2) return setErro("Informe seu nome.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErro("Digite um e-mail válido.");
    if (senha.length < 6) return setErro("A senha deve ter pelo menos 6 caracteres.");
    if (senha !== confirmar) return setErro("As senhas não conferem.");

    setErro("");
    setEnviando(true);
    try {
      const r = await fetch(API + "/api/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.erro || `Erro ${r.status}. Verifique se o backend foi reiniciado.`);
      localStorage.setItem("apj_token", d.token);
      onLogin({ nome: d.nome, email: email.trim().toLowerCase() }); // entra direto após criar a conta
    } catch (err) {
      setErro(err instanceof TypeError ? "Servidor indisponível." : err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="tela login">
      <div className="marca">
        <span className="logo">🎮</span>
        <div>
          <strong>APJ</strong>
          <small>Aplicativo de Promoções de Jogos</small>
        </div>
      </div>

      <h1>Crie sua conta.</h1>
      <p className="sub">Leva menos de um minuto. Depois é só escolher seus jogos favoritos e esperar o preço baixar.</p>

      <form onSubmit={cadastrar} noValidate>
        <label htmlFor="nome">Nome</label>
        <div className="campo">
          <span aria-hidden>👤</span>
          <input id="nome" placeholder="Como devemos te chamar?" autoComplete="name"
                 value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <label htmlFor="email">E-mail</label>
        <div className="campo">
          <span aria-hidden>✉</span>
          <input id="email" type="email" placeholder="voce@exemplo.com" autoComplete="email"
                 value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <label htmlFor="senha">Senha</label>
        <div className="campo">
          <span aria-hidden>🔒</span>
          <input id="senha" type={ver ? "text" : "password"} placeholder="Mínimo 6 caracteres" autoComplete="new-password"
                 value={senha} onChange={(e) => setSenha(e.target.value)} />
          <button type="button" className="olho" onClick={() => setVer(!ver)}
                  aria-label={ver ? "Ocultar senha" : "Mostrar senha"}>{ver ? "🙈" : "👁"}</button>
        </div>

        <label htmlFor="confirmar">Confirmar senha</label>
        <div className="campo">
          <span aria-hidden>🔒</span>
          <input id="confirmar" type={ver ? "text" : "password"} placeholder="Repita a senha" autoComplete="new-password"
                 value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
        </div>

        {erro && <p className="erro" role="alert" style={{ marginTop: 14 }}>{erro}</p>}

        <button className="botao" style={{ marginTop: 20 }} disabled={enviando}>
          {enviando ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <div className="ou"><span>ou</span></div>
      <p className="criar">
        Já tem uma conta?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); onVoltar(); }}>Entrar</a>
      </p>
    </main>
  );
}

import { useState } from "react";

export default function Login({ onLogin, onCriarConta }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ver, setVer] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErro("Digite um e-mail válido.");
    if (senha.length < 6) return setErro("A senha deve ter pelo menos 6 caracteres.");

    setErro("");
    setEnviando(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.erro || `Erro ${r.status}. Verifique se o backend está rodando.`);
      localStorage.setItem("apj_token", d.token);
      onLogin({ nome: d.nome, email: email.trim().toLowerCase() });
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

      <h1>Sua próxima promoção começa aqui.</h1>
      <p className="sub">Centralize suas plataformas, acompanhe jogos e receba alertas quando o preço baixar.</p>

      <div className="aviso">
        <span className="logo pequeno">%</span>
        <span>Compare ofertas de Steam, PlayStation, Xbox e Epic Games em um só lugar.</span>
      </div>

      <form onSubmit={entrar} noValidate>
        <label htmlFor="email">E-mail</label>
        <div className="campo">
          <span aria-hidden>✉</span>
          <input id="email" type="email" placeholder="voce@exemplo.com" autoComplete="email"
                 value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <label htmlFor="senha">Senha</label>
        <div className="campo">
          <span aria-hidden>🔒</span>
          <input id="senha" type={ver ? "text" : "password"} placeholder="••••••••" autoComplete="current-password"
                 value={senha} onChange={(e) => setSenha(e.target.value)} />
          <button type="button" className="olho" onClick={() => setVer(!ver)}
                  aria-label={ver ? "Ocultar senha" : "Mostrar senha"}>{ver ? "🙈" : "👁"}</button>
        </div>

        <a href="#" className="esqueci"
           onClick={(e) => { e.preventDefault(); setErro("A recuperação de senha ainda não está disponível nesta versão."); }}>
          Esqueci minha senha
        </a>

        {erro && <p className="erro" role="alert">{erro}</p>}

        <button className="botao" disabled={enviando}>{enviando ? "Entrando..." : "Entrar"}</button>
      </form>

      <div className="ou"><span>ou</span></div>
      <p className="criar">
        Ainda não usa o APJ?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); onCriarConta(); }}>Criar conta</a>
      </p>
    </main>
  );
}

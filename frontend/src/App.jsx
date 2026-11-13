import { useEffect, useState } from "react";
import "./telas.css";
import { api } from "./api.js";
import { PADRAO, mesclar } from "./regras.js";
import Login from "./Login.jsx";
import Cadastro from "./Cadastro.jsx";
import Home from "./Home.jsx";
import Buscar from "./Buscar.jsx";
import Favoritos from "./Favoritos.jsx";
import Alertas from "./Alertas.jsx";
import Filtros from "./Filtros.jsx";
import Detalhe from "./Detalhe.jsx";
import Perfil from "./Perfil.jsx";
import Abas from "./Abas.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [tela, setTela] = useState("login");
  const [aba, setAba] = useState("inicio");
  const [origem, setOrigem] = useState("inicio");
  const [detalhe, setDetalhe] = useState(null);
  const [soPromo, setSoPromo] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [precosFav, setPrecosFav] = useState({});
  const [promos, setPromos] = useState([]);
  const [promosErro, setPromosErro] = useState("");
  const [conexoes, setConexoes] = useState([]);
  const [conexoesOk, setConexoesOk] = useState(false);
  const [prefs, setPrefs] = useState(PADRAO);

 
  useEffect(() => {
    const steam = new URLSearchParams(window.location.search).get("steam");
    if (steam) {
      window.history.replaceState(null, "", window.location.pathname);
      if (steam === "erro") window.alert("Não foi possível confirmar sua conta Steam. Tente novamente.");
    }
    if (!localStorage.getItem("apj_token")) { setCarregando(false); return; }
    api("/me").then(setUser)
      .catch(() => localStorage.removeItem("apj_token"))
      .finally(() => setCarregando(false));
  }, []);


  useEffect(() => {
    if (!user) return;
    api("/favoritos").then((l) => setFavoritos(l.filter((f) => /^\d+$/.test(f.id)))).catch(() => {});
    api("/conexoes").then(setConexoes).catch(() => {}).finally(() => setConexoesOk(true));
    api("/preferencias").then((d) => setPrefs(mesclar(d))).catch(() => {});
    api("/jogos/promocoes").then((l) => { setPromos(l); setPromosErro(""); }).catch((e) => setPromosErro(e.message));
  }, [user]);


  useEffect(() => {
    if (!favoritos.length) { setPrecosFav({}); return; }
    api(`/jogos/precos?ids=${favoritos.map((f) => f.id).join(",")}`).then(setPrecosFav).catch(() => {});
  }, [favoritos]);

  const favIds = favoritos.map((f) => f.id);

  function irPara(destino, promo = false) {
    setSoPromo(promo);
    setAba(destino);
    window.scrollTo(0, 0);
  }

  function abrirDetalhe(id) {
    setOrigem(aba);
    setDetalhe(id);
    irPara("detalhe");
  }

  function sair() {
    localStorage.removeItem("apj_token");
    setUser(null); setTela("login"); setAba("inicio"); setConexoesOk(false);
    setFavoritos([]); setConexoes([]); setPrefs(PADRAO); setPromos([]);
  }

  async function alternarFavorito(jogo) {
    const antes = favoritos;
    const ja = favIds.includes(jogo.id);
    const base = Math.round(jogo.preco * 100);
    setFavoritos(ja ? antes.filter((f) => f.id !== jogo.id) : [...antes, { id: jogo.id, nome: jogo.nome, base }]);
    try { await api(`/favoritos/${jogo.id}`, ja ? "DELETE" : "POST", ja ? undefined : { nome: jogo.nome, base }); }
    catch { setFavoritos(antes); window.alert("Não foi possível salvar. Verifique se o backend está rodando."); }
  }

  async function salvarPrefs(novas) {
    const antigas = prefs;
    setPrefs(novas);
    try { await api("/preferencias", "PUT", novas); }
    catch (e) { setPrefs(antigas); throw e; }
  }

  async function conectar(plataforma, conta) {
    const c = await api(`/conexoes/${plataforma}`, "PUT", { conta });
    setConexoes([...conexoes.filter((x) => x.plataforma !== plataforma), c]);
  }

  async function desconectar(plataforma) {
    await api(`/conexoes/${plataforma}`, "DELETE");
    setConexoes(conexoes.filter((x) => x.plataforma !== plataforma));
  }


  async function iniciarSteam() {
    const d = await api("/steam/iniciar", "POST");
    window.location.href = d.url;
  }

  if (carregando) return null;

  if (!user) {
    return tela === "login"
      ? <Login onLogin={setUser} onCriarConta={() => setTela("cadastro")} />
      : <Cadastro onLogin={setUser} onVoltar={() => setTela("login")} />;
  }
  if (!conexoesOk) return null;

  const perfil = (obrigatorio) => (
    <Perfil user={user} conexoes={conexoes} obrigatorio={obrigatorio} onConectar={conectar}
            onDesconectar={desconectar} onSteam={iniciarSteam} onSair={sair} />
  );

  if (conexoes.length === 0) return perfil(true);

  const comum = { favoritos, favIds, precosFav, promos, promosErro, prefs,
                  onFavorito: alternarFavorito, onDetalhes: abrirDetalhe, irPara };
  const aberta = aba === "detalhe" ? origem : aba === "filtros" ? "alertas" : aba;
  return (
    <>
      {aba === "inicio" && <Home user={user} {...comum} />}
      {aba === "buscar" && <Buscar {...comum} promoInicial={soPromo} />}
      {aba === "favoritos" && <Favoritos {...comum} />}
      {aba === "alertas" && <Alertas {...comum} onSalvar={salvarPrefs} />}
      {aba === "filtros" && <Filtros prefs={prefs} onSalvar={salvarPrefs} irPara={irPara} />}
      {aba === "detalhe" && <Detalhe id={detalhe} {...comum} voltar={() => irPara(origem)} />}
      {aba === "perfil" && perfil(false)}
      <Abas aba={aberta} onIr={irPara} />
    </>
  );
}

import { useEffect, useState } from "react";
import "./telas.css";
import { api } from "./api.js";
import Login from "./Login.jsx";
import Cadastro from "./Cadastro.jsx";
import Home from "./Home.jsx";
import Buscar from "./Buscar.jsx";
import Favoritos from "./Favoritos.jsx";
import Alertas from "./Alertas.jsx";
import Perfil from "./Perfil.jsx";
import Abas from "./Abas.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [tela, setTela] = useState("login");
  const [aba, setAba] = useState("inicio");
  const [soPromo, setSoPromo] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [conexoes, setConexoes] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("apj_token")) { setCarregando(false); return; }
    api("/me").then(setUser)
      .catch(() => localStorage.removeItem("apj_token"))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    api("/favoritos").then(setFavoritos).catch(() => {});
    api("/conexoes").then(setConexoes).catch(() => {});
  }, [user]);

  function irPara(destino, promo = false) {
    setSoPromo(promo);
    setAba(destino);
    window.scrollTo(0, 0);
  }

  function sair() {
    localStorage.removeItem("apj_token");
    setUser(null); setTela("login"); setAba("inicio"); setFavoritos([]); setConexoes([]);
  }

  async function alternarFavorito(id) {
    const ja = favoritos.includes(id);
    setFavoritos(ja ? favoritos.filter((f) => f !== id) : [...favoritos, id]);
    try { await api(`/favoritos/${id}`, ja ? "DELETE" : "POST"); }
    catch { setFavoritos(favoritos); window.alert("Não foi possível salvar. Verifique se o backend está rodando."); }
  }

  async function conectar(plataforma, conta) {
    const c = await api(`/conexoes/${plataforma}`, "PUT", { conta });
    setConexoes([...conexoes.filter((x) => x.plataforma !== plataforma), c]);
  }

  async function desconectar(plataforma) {
    await api(`/conexoes/${plataforma}`, "DELETE");
    setConexoes(conexoes.filter((x) => x.plataforma !== plataforma));
  }

  if (carregando) return null;
  if (!user) {
    return tela === "login"
      ? <Login onLogin={setUser} onCriarConta={() => setTela("cadastro")} />
      : <Cadastro onLogin={setUser} onVoltar={() => setTela("login")} />;
  }

  const comum = { favoritos, onFavorito: alternarFavorito, irPara };
  return (
    <>
      {aba === "inicio" && <Home user={user} {...comum} />}
      {aba === "buscar" && <Buscar {...comum} promoInicial={soPromo} />}
      {aba === "favoritos" && <Favoritos {...comum} />}
      {aba === "alertas" && <Alertas {...comum} />}
      {aba === "perfil" && (
        <Perfil user={user} conexoes={conexoes} onConectar={conectar} onDesconectar={desconectar} onSair={sair} />
      )}
      <Abas aba={aba} onIr={irPara} />
    </>
  );
}

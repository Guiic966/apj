import { useEffect, useState } from "react";
import Login from "./Login.jsx";
import Cadastro from "./Cadastro.jsx";
import Home from "./Home.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [tela, setTela] = useState("login");

  useEffect(() => {
    const token = localStorage.getItem("apj_token");
    if (!token) { setCarregando(false); return; }
    fetch("/api/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setUser)
      .catch(() => localStorage.removeItem("apj_token"))
      .finally(() => setCarregando(false));
  }, []);

  function sair() {
    localStorage.removeItem("apj_token");
    setUser(null);
    setTela("login");
  }

  if (carregando) return null;
  if (user) return <Home user={user} onSair={sair} />;
  return tela === "login"
    ? <Login onLogin={setUser} onCriarConta={() => setTela("cadastro")} />
    : <Cadastro onLogin={setUser} onVoltar={() => setTela("login")} />;
}

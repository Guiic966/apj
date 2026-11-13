import { brl } from "./catalogo.js";
import { gerarAlertas, filtrosAtivos } from "./regras.js";

const OPCOES = [
  ["promocoes", "Promoções", "Ofertas e campanhas nas plataformas escolhidas."],
  ["descontos", "Descontos", "Avisos de grandes descontos (a partir de 50%)."],
  ["precos", "Alterações de preço", "Mudanças de preço, mesmo fora de períodos promocionais."],
  ["favoritos", "Promoções de jogos favoritos", "Prioridade para ofertas dos jogos que você acompanha."],
  ["filtros", "Promoções dos filtros configurados", "Ofertas da Steam que combinam com seu preço máximo e desconto mínimo."],
];

export default function Alertas({ favoritos, precosFav, promos, prefs, onSalvar, irPara, onDetalhes }) {
  const alertas = gerarAlertas(favoritos, precosFav, promos, prefs);

  function alternar(chave) {
    onSalvar({ ...prefs, n: { ...prefs.n, [chave]: !prefs.n[chave] } })
      .catch(() => window.alert("Não foi possível salvar. Verifique se o backend está rodando."));
  }

  return (
    <main className="tela">
      <h2 className="titulo-tela">Notificações</h2>
      <p className="sub">Você decide o que receber. Ative só os alertas que ajudam você a economizar.</p>

      {OPCOES.map(([chave, titulo, desc]) => (
        <section key={chave} className="bloco linha">
          <div><h4>{titulo}</h4><small>{desc}</small></div>
          <label className="toggle">
            <input type="checkbox" checked={prefs.n[chave]} onChange={() => alternar(chave)} />
            <span />
          </label>
        </section>
      ))}

      <button className="bloco linha filtro-link" onClick={() => irPara("filtros")}>
        <div>
          <h4>{filtrosAtivos(prefs) ? "Filtro personalizado ativo" : "Configurar filtros"}</h4>
          <small>{filtrosAtivos(prefs) ? "Toque para editar seus filtros" : "Defina gênero, preço, desconto e mais"}</small>
        </div>
        <span>›</span>
      </button>
      <p className="contagem">✓ Preferências salvas automaticamente</p>

      <h3 className="subtitulo">Seus alertas ({alertas.length})</h3>
      {alertas.map((a) => (
        <article key={a.jogo.id + a.tipo} className="alerta-item" onClick={() => onDetalhes(a.jogo.id)}>
          <span className="selo">{a.tipo}</span>
          <div>
            <strong>{a.jogo.nome}</strong> · {a.origem}<br />
            <small>{brl(a.jogo.preco)}{a.jogo.desconto > 0 && ` (-${a.jogo.desconto}%)`} · Steam</small>
          </div>
        </article>
      ))}
      {!alertas.length && (
        <div className="vazio">
          <p>Sem alertas por enquanto. Favorite jogos ou configure filtros para ser avisado de promoções.</p>
          <button className="botao" onClick={() => irPara("buscar")}>Buscar jogos</button>
        </div>
      )}
    </main>
  );
}

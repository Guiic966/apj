import { JOGOS, desconto, brl } from "./catalogo.js";

export default function Alertas({ favoritos, irPara }) {
  const alertas = JOGOS.filter((j) => favoritos.includes(j.id) && desconto(j) > 0);

  return (
    <main className="tela">
      <h2 className="titulo-tela">Notificações</h2>
      {alertas.map((j) => (
        <article key={j.id} className="alerta-item">
          <span className="selo">-{desconto(j)}%</span>
          <div>
            <strong>{j.nome}</strong> entrou em promoção<br />
            <small>{brl(j.preco)} (antes {brl(j.original)}) · {j.lojas[0]}</small>
          </div>
        </article>
      ))}
      {!alertas.length && (
        <div className="vazio">
          <p>Sem alertas por enquanto. Favorite jogos para ser avisado quando eles entrarem em promoção.</p>
          <button className="botao" onClick={() => irPara("buscar")}>Buscar jogos</button>
        </div>
      )}
    </main>
  );
}

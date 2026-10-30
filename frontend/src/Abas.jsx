const ABAS = [
  ["inicio", "⌂", "Início"], ["buscar", "⌕", "Buscar"], ["favoritos", "♡", "Favoritos"],
  ["alertas", "🔔", "Alertas"], ["perfil", "👤", "Perfil"],
];

export default function Abas({ aba, onIr }) {
  return (
    <nav className="abas">
      {ABAS.map(([id, icone, nome]) => (
        <button key={id} className={aba === id ? "ativa" : ""} onClick={() => onIr(id)}>
          <span>{icone}</span>{nome}
        </button>
      ))}
    </nav>
  );
}

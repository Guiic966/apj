export const PLATAFORMAS = [
  { id: "steam", nome: "Steam", icone: "◉", desc: "Login oficial da Steam: confirma que a conta é sua." },
  { id: "playstation", nome: "PlayStation", icone: "🎮", desc: "Informe seu ID da PSN (não verificado)." },
  { id: "xbox", nome: "Xbox", icone: "✕", desc: "Informe seu gamertag (não verificado)." },
  { id: "epic", nome: "Epic Games", icone: "🛍", desc: "Informe seu usuário (não verificado)." },
];

export const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const precoTxt = (j) => (j.preco > 0 ? brl(j.preco) : "Grátis ou sem preço");
export const imagemDe = (id) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/header.jpg`;

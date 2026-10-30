export const GENEROS = ["Todos", "Aventura", "RPG", "Ação", "Estratégia"];

export const PLATAFORMAS = [
  { id: "steam", nome: "Steam", icone: "◉", desc: "Compare ofertas e importe sua biblioteca." },
  { id: "playstation", nome: "PlayStation", icone: "🎮", desc: "Acompanhe preços da PS Store." },
  { id: "xbox", nome: "Xbox", icone: "✕", desc: "Compare ofertas e importe sua biblioteca." },
  { id: "epic", nome: "Epic Games", icone: "🛍", desc: "Acompanhe preços e jogos gratuitos." },
];

const T = ["Steam", "PlayStation", "Xbox"];
export const JOGOS = [
  { id: "eldenring", nome: "Elden Ring", genero: "RPG", lojas: T, preco: 179.94, original: 299.9, cor: "#5a4a1e" },
  { id: "hades2", nome: "Hades II", genero: "Ação", lojas: ["Steam"], preco: 74.99, cor: "#7a3b2e" },
  { id: "cyberpunk", nome: "Cyberpunk 2077", genero: "RPG", lojas: T, preco: 99.95, original: 199.9, cor: "#27466e" },
  { id: "rdr2", nome: "Red Dead Redemption 2", genero: "Aventura", lojas: T, preco: 74.97, original: 299.9, cor: "#8a4b2a" },
  { id: "lis", nome: "Life is Strange: True Colors", genero: "Aventura", lojas: T, preco: 159.9, cor: "#3b4f9a" },
  { id: "silksong", nome: "Hollow Knight: Silksong", genero: "Aventura", lojas: ["Steam", "Xbox"], preco: 59.99, cor: "#1f6f78" },
  { id: "civ6", nome: "Civilization VI", genero: "Estratégia", lojas: ["Steam", "Epic Games"], preco: 29.9, original: 149.9, cor: "#3f7d4e" },
  { id: "gow", nome: "God of War", genero: "Ação", lojas: ["Steam", "PlayStation"], preco: 99.9, original: 199.9, cor: "#6b2a2a" },
  { id: "witcher3", nome: "The Witcher 3", genero: "RPG", lojas: ["Steam", "Epic Games", "Xbox"], preco: 39.9, original: 129.9, cor: "#4a3b63" },
  { id: "aoe2", nome: "Age of Empires II", genero: "Estratégia", lojas: ["Steam", "Xbox"], preco: 54.9, cor: "#7a6a2e" },
];

export const desconto = (j) => (j.original ? Math.round((1 - j.preco / j.original) * 100) : 0);
export const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// No navegador (npm run dev) o endereço é vazio e o proxy do Vite cuida do resto.
// No app mobile, VITE_API_URL (arquivo .env.mobile) aponta para o backend.
export const API = import.meta.env.VITE_API_URL || "";

// Chamada ao backend já com o token do usuário logado.
export async function api(caminho, metodo = "GET", corpo) {
  const r = await fetch(API + "/api" + caminho, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("apj_token")}`,
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.erro || `Erro ${r.status}. Verifique se o backend foi reiniciado.`);
  return d;
}

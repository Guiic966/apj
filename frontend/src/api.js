export async function api(caminho, metodo = "GET", corpo) {
  const r = await fetch("/api" + caminho, {
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

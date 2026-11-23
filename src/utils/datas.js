export const agoraISO = () => new Date().toISOString();

// AAAA-MM-DD no fuso do aparelho
export function hojeLocal(data = new Date()) {
  const a = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
}

export const ehFutura = (iso) => new Date(iso).getTime() > Date.now();

// Dias inteiros entre uma data e hoje (0 no próprio dia)
export function diasDesde(iso) {
  const inicio = new Date(iso);
  inicio.setHours(0, 0, 0, 0);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((hoje - inicio) / 86400000));
}

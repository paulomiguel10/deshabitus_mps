// No DC-ENTIDADE as datas são do tipo int. Convenção da equipe:
//   - datas SEM hora (dataInicio, dataUltimoReinicio, data do check-in) -> int AAAAMMDD, ex.: 20261123
//   - datas COM hora (dataHora, dataAceiteTermos)                         -> int em milissegundos (Date.now())

// Hoje como AAAAMMDD, no fuso do aparelho
export function hoje(data = new Date()) {
  return data.getFullYear() * 10000 + (data.getMonth() + 1) * 100 + data.getDate();
}

export const agora = () => Date.now();

// AAAAMMDD -> Date (meia-noite local)
export function paraDate(aaaammdd) {
  return new Date(Math.floor(aaaammdd / 10000), Math.floor((aaaammdd % 10000) / 100) - 1, aaaammdd % 100);
}

// Dias inteiros entre duas datas AAAAMMDD (fim - inicio)
export function diasEntre(inicio, fim) {
  return Math.round((paraDate(fim) - paraDate(inicio)) / 86400000);
}

// AAAAMMDD -> "23/11/2026"
export function formatarData(aaaammdd) {
  const d = String(aaaammdd);
  return `${d.slice(6, 8)}/${d.slice(4, 6)}/${d.slice(0, 4)}`;
}

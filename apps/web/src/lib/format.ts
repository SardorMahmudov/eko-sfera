// Raqamlarni O'zbekcha uslubda ajratish: 260 321 (bo'sh joy bilan)
export function fmtNumber(n: number): string {
  return new Intl.NumberFormat("ru-RU").format(Math.round(n)).replace(/ /g, " ");
}

export function fmtSum(n: number): string {
  return `${fmtNumber(n)} сўм`;
}

// Katta summani million ko'rinishida (bar chart o'qi uchun)
export function toMillion(n: number): number {
  return +(n / 1_000_000).toFixed(1);
}

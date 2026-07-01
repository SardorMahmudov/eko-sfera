import type { DistrictStat } from "@/lib/mock/jizzax";

// Qarzdorlik darajasiga qarab rang (choropleth). Leaflet import qilmaydi —
// shuning uchun serverda (SSR) ham xavfsiz.
export function debtColor(d: DistrictStat, max: number): string {
  const r = d.debt / max;
  if (r > 0.8) return "#e5484d";
  if (r > 0.55) return "#fa8c16";
  if (r > 0.35) return "#faad14";
  if (r > 0.15) return "#fadb14";
  return "#a0d911";
}

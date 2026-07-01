// Jizzax tumanlari markaz koordinatalari (GeoJSON'dan hisoblangan) [lat, lng]
export const DISTRICT_CENTROIDS: Record<number, [number, number]> = {
  1: [40.5481, 67.8183], // Arnasoy
  2: [40.6711, 68.0248], // Mirzacho'l
  3: [40.1105, 68.1358], // Zarbdor
  4: [39.9817, 68.7813], // Yangiobod
  5: [40.4885, 68.0131], // Do'stlik
  6: [40.3377, 67.734], // Zafarobod
  7: [40.5172, 67.3529], // Forish
  8: [39.6955, 67.7627], // Baxmal
  9: [40.3061, 68.003], // Paxtakor
  10: [39.888, 68.4099], // Zomin
  11: [39.9743, 67.3947], // G'allaorol
  12: [40.0888, 67.8292], // Jizzax shahar
  13: [40.0437, 67.8181], // Sharof Rashidov
};

// Viloyat umumiy markazi (fallback)
export const REGION_CENTER: [number, number] = [40.15, 67.9];

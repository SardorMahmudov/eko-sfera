// География (справочник) mock ma'lumotlari — geography sahifalari uchun.
// Keyinchalik NestJS API bilan almashtiriladi.

import { DISTRICT_CENTROIDS } from "./districtCentroids";

// ---------- Вилоятлар ----------
export interface RegionRow {
  id: number;
  name: string;
  coato: string; // СОАТО коди
  cadastre: string; // Кадастр коди
}

export const REGIONS: RegionRow[] = [
  { id: 4, name: "Жиззах вилояти", coato: "08000", cadastre: "13" },
];

// ---------- Туманлар ----------
export interface DistrictRow {
  id: number; // ко'ринадиган ID (asl saytdagidek)
  geoId: number; // jizzax-districts.geojson dagi districtId (xarita highlight uchun)
  name: string;
  region: string;
  coato: string; // СОАТО коди
}

export const DISTRICTS: DistrictRow[] = [
  { id: 67, geoId: 4, name: "Янгиобод тумани", region: "Жиззах вилояти", coato: "08237" },
  { id: 66, geoId: 7, name: "Фориш тумани", region: "Жиззах вилояти", coato: "08235" },
  { id: 64, geoId: 10, name: "Зомин тумани", region: "Жиззах вилояти", coato: "08218, 08245" },
  { id: 63, geoId: 3, name: "Зарбдор тумани", region: "Жиззах вилояти", coato: "08220" },
  { id: 62, geoId: 2, name: "Мирзачўл тумани", region: "Жиззах вилояти", coato: "08223" },
  { id: 61, geoId: 1, name: "Арнасой тумани", region: "Жиззах вилояти", coato: "08201" },
  { id: 60, geoId: 5, name: "Дўстлик тумани", region: "Жиззах вилояти", coato: "08215, 08248" },
  { id: 59, geoId: 6, name: "Зафаробод тумани", region: "Жиззах вилояти", coato: "08225" },
  { id: 58, geoId: 9, name: "Пахтакор тумани", region: "Жиззах вилояти", coato: "08228" },
  { id: 57, geoId: 8, name: "Бахмал тумани", region: "Жиззах вилояти", coato: "08204" },
  { id: 56, geoId: 11, name: "Ғаллаорол тумани", region: "Жиззах вилояти", coato: "08212" },
  { id: 55, geoId: 12, name: "Жиззах шаҳар", region: "Жиззах вилояти", coato: "08401" },
  { id: 54, geoId: 13, name: "Шароф Рашидов тумани", region: "Жиззах вилояти", coato: "08230" },
];

// ---------- Синтетик полигон генератори ----------
export interface GeoPolygon {
  id: number;
  name: string;
  positions: [number, number][]; // [lat, lng]
}

// Markaz atrofida biroz tartibsiz ko'pburchak (mahalla shakli taqlidi)
function blobAround(lat: number, lng: number, rKm: number, seed: number): [number, number][] {
  const latDeg = rKm / 111;
  const lngDeg = rKm / (111 * Math.cos((lat * Math.PI) / 180));
  const pts: [number, number][] = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    // determinstik "shovqin" — har mahalla boshqacha shaklda
    const jitter = 0.55 + 0.45 * Math.abs(Math.sin(seed * 12.9898 + i * 4.1414));
    pts.push([lat + Math.sin(a) * latDeg * jitter, lng + Math.cos(a) * lngDeg * jitter]);
  }
  return pts;
}

// ---------- Маҳаллалар ----------
export interface VillageRow {
  id: number;
  name: string;
  coato: string;
  company: string;
  gps: boolean; // GPS координаталари mavjudmi
}

const MAHALLA_NAMES = [
  "САЙХОН МФЙ", "ОЛМАЗОР МФЙ", "Х.ОЛИМЖОН МФЙ", "А.НАВОИЙ МФЙ", "ХАЛКОБОД МФЙ",
  "А.ТЕМУР МФЙ", "КИМЁГАР МФЙ", "ХАЙРОБОД МФЙ", "ОБОД МФЙ", "ГУЛИСТОН МФЙ",
  "МУСТАҚИЛЛИК МФЙ", "БОҒИШАМОЛ МФЙ", "ЧАМАНЗОР МФЙ", "БЎСТОН МФЙ", "ДЎСТЛИК МФЙ",
  "БУЛОҚБОШИ МФЙ", "ЯНГИОБОД МФЙ", "НАВРЎЗ МФЙ", "ФАЙЗОБОД МФЙ", "ГЎЗАЛ МФЙ",
  "ОҚОЛТИН МФЙ", "ТИНЧЛИК МФЙ", "БАҲОР МФЙ", "ШАРҚ МФЙ", "ОБОДОН МФЙ",
  "ЮЛДУЗ МФЙ", "МЕҲНАТ МФЙ", "ГЛОБУС МФЙ", "ИСТИҚЛОЛ МФЙ", "БИРЛИК МФЙ",
  "ГУЛШАН МФЙ", "ОҚҚЎРҒОН МФЙ", "СОЙЛИК МФЙ", "ҚИРЛИК МФЙ",
];

const COMPANIES = ['"GREENLINE" MChJ', '"Toza Eko Hudud" DUK', '"Eko sfera" MChJ'];

export const VILLAGES: VillageRow[] = MAHALLA_NAMES.map((name, i) => ({
  id: [52622, 52621, 52620, 52619, 52618, 52617, 49625, 47571][i] ?? 47000 - i * 7,
  name,
  coato: `170840${1000 + ((i * 13) % 40)}`,
  company: COMPANIES[i % COMPANIES.length],
  // oxirgi ikkitasi (sariq qator) — koordinatalari yo'q
  gps: i < MAHALLA_NAMES.length - 2,
}));

// Маҳалла полигонлари (Жиззах шаҳар markazi atrofida yashil klaster)
const VILLAGE_CENTER = DISTRICT_CENTROIDS[12]; // Jizzax shahar

export const VILLAGE_POLYGONS: GeoPolygon[] = VILLAGES.filter((v) => v.gps).map((v, i) => {
  const ang = (i / 20) * Math.PI * 2;
  const ring = 0.02 + (i % 4) * 0.012;
  const lat = VILLAGE_CENTER[0] + Math.sin(ang) * ring;
  const lng = VILLAGE_CENTER[1] + Math.cos(ang) * ring * 1.4;
  return { id: v.id, name: v.name, positions: blobAround(lat, lng, 1.1, i + 1) };
});

// ---------- Маҳалла ҳудудлари ----------
export interface MahallaAreaRow {
  id: number;
  name: string;
  monthlyTrips: number; // Ойлик қатновлар сони
  minCount: number; // Минимум сони
  positions: [number, number][];
  // qo'shimcha parametrlar (Худуд қўшиш modalidan)
  minMoveTime?: number; // Минимум ҳаракат вақти (минут)
  minStops?: number; // Минимум тўхташлар сони
  maxAvgSpeed?: number; // Максимум ўртача тезлик (км/соат)
  minDistance?: number; // Ўтилиши керак бўлган минимум масофа (км)
}

// САЙХОН МФЙ atrofidagi 2 ta hudud (screenshotdagidek)
const SAYHON_CENTER: [number, number] = [40.715, 67.905];

export const MAHALLA_AREAS: Record<string, MahallaAreaRow[]> = {
  "САЙХОН МФЙ": [
    { id: 12030, name: "1-худуд", monthlyTrips: 4, minCount: 20, positions: blobAround(SAYHON_CENTER[0] + 0.008, SAYHON_CENTER[1] - 0.006, 0.9, 3) },
    { id: 12032, name: "2-худуд", monthlyTrips: 4, minCount: 40, positions: blobAround(SAYHON_CENTER[0] - 0.006, SAYHON_CENTER[1] + 0.004, 1.0, 8) },
  ],
};

export const REGION_NAME = "Жиззах вилояти";
export const REGION_CITY = "Жиззах шаҳар";

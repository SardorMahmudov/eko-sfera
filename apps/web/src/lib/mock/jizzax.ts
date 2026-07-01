// Jizzax viloyati mock ma'lumotlari (screenshotlardagi raqamlarga mos).
// Keyinchalik bu qatlam NestJS API bilan almashtiriladi.

export interface DistrictStat {
  id: number;
  name: string; // kirill
  nameLat: string;
  subscribers: number;
  debtors: number;
  debt: number; // so'm
  incomeMonth: number; // so'mdagi oylik tushum
}

// 13 tuman/shahar
export const JIZZAX_DISTRICTS: DistrictStat[] = [
  { id: 1, name: "Арнасой тумани", nameLat: "Arnasoy tumani", subscribers: 9544, debtors: 1180, debt: 620_400_000, incomeMonth: 1_350_553 },
  { id: 2, name: "Мирзачўл тумани", nameLat: "Mirzacho'l tumani", subscribers: 9544, debtors: 1240, debt: 712_300_000, incomeMonth: 1_945_760 },
  { id: 3, name: "Зарбдор тумани", nameLat: "Zarbdor tumani", subscribers: 9417, debtors: 1305, debt: 690_100_000, incomeMonth: 1_979_745 },
  { id: 4, name: "Янгиобод тумани", nameLat: "Yangiobod tumani", subscribers: 8120, debtors: 1090, debt: 540_800_000, incomeMonth: 2_321_690 },
  { id: 5, name: "Дўстлик тумани", nameLat: "Do'stlik tumani", subscribers: 11230, debtors: 1560, debt: 880_250_000, incomeMonth: 2_372_897 },
  { id: 6, name: "Зафаробод тумани", nameLat: "Zafarobod tumani", subscribers: 6480, debtors: 870, debt: 459_364_540, incomeMonth: 2_729_440 },
  { id: 7, name: "Фориш тумани", nameLat: "Forish tumani", subscribers: 10240, debtors: 1420, debt: 760_500_000, incomeMonth: 2_752_784 },
  { id: 8, name: "Бахмал тумани", nameLat: "Baxmal tumani", subscribers: 25412, debtors: 3480, debt: 3_085_029_764, incomeMonth: 3_588_600 },
  { id: 9, name: "Пахтакор тумани", nameLat: "Paxtakor tumani", subscribers: 10960, debtors: 1510, debt: 1_297_847_324, incomeMonth: 5_174_306 },
  { id: 10, name: "Зомин тумани", nameLat: "Zomin tumani", subscribers: 18740, debtors: 2560, debt: 2_140_600_000, incomeMonth: 6_864_039 },
  { id: 11, name: "Ғаллаорол тумани", nameLat: "G'allaorol tumani", subscribers: 22870, debtors: 3140, debt: 5_985_802_229, incomeMonth: 8_165_557 },
  { id: 12, name: "Жиззах шаҳар", nameLat: "Jizzax shahar", subscribers: 27847, debtors: 3820, debt: 8_794_944_467, incomeMonth: 9_666_870 },
  { id: 13, name: "Шароф Рашидов тумани", nameLat: "Sharof Rashidov tumani", subscribers: 28475, debtors: 3980, debt: 3_392_025_752, incomeMonth: 13_347_202 },
];

// KPI umumiy raqamlar
export const KPI_TOTALS = {
  regions: 1,
  districts: 13,
  mahallas: 303,
  streets: 3926,
  polygons: 16,
  collectionAreas: 181,
  subscribers: 260_321,
  debtors: 35_153,
  payments: 47_860_462,
  appeals: 16,
  courtCases: 95_115,
  acts: 1_168_780,
};

// GPS statistika
export const GPS_STATS = {
  regions: 1,
  districts: 13,
  mahallas: 301,
  streets: 3908,
  polygons: 16,
  collectionAreas: 180,
  vehiclesInSystem: 3403,
  wialonLinked: 3265,
  wialonTotal: 3641,
};

export const GPS_DEVICE_TYPES = [
  { name: "Teltonika FMB920", value: 61.1 },
  { name: "Teltonika FM5300", value: 20.8 },
  { name: "Teltonika FMB122", value: 9.2 },
  { name: "R51J60AC2PW", value: 3.9 },
  { name: "Positron MX+", value: 2.4 },
  { name: "FMB 920", value: 1.4 },
  { name: "Teltonika FM1120", value: 0.7 },
  { name: "Teltonika FM920", value: 0.5 },
];

export const GPS_VEHICLE_TYPES = [
  { name: "KOMPAKTOR", value: 84.0 },
  { name: "HOWO", value: 4.5 },
  { name: "Hyundai", value: 4.2 },
  { name: "ISUZU", value: 2.6 },
  { name: "MOTOROLLER", value: 1.6 },
  { name: "KAMAZ", value: 1.1 },
  { name: "MERCEDES", value: 0.8 },
  { name: "TRAKTOR", value: 0.6 },
  { name: "EKSKOVATOR", value: 0.4 },
  { name: "BULDOZER", value: 0.2 },
];

// Mahalla tashriflar (haftalik) — eng ko'p / eng kam
export const MOST_VISITED = [
  { name: "Сайхун МФЙ", value: 142 },
  { name: "Дўстлик МФЙ", value: 128 },
  { name: "Обод МФЙ", value: 121 },
  { name: "Гулистон МФЙ", value: 110 },
  { name: "Ободон МФЙ", value: 98 },
  { name: "Мустақиллик МФЙ", value: 91 },
];

export const LEAST_VISITED = [
  { name: "Тоғли МФЙ", value: 4 },
  { name: "Чашма МФЙ", value: 7 },
  { name: "Қирлик МФЙ", value: 9 },
  { name: "Янгиқишлоқ МФЙ", value: 12 },
  { name: "Сойлик МФЙ", value: 15 },
  { name: "Адир МФЙ", value: 18 },
];

// Korxonalar ro'yxati (screenshot 3)
export type CompanyType = "Давлат Унитар Корхонаси" | "Кластер" | "Давлат хусусий шерикчилик";

export interface CompanyRow {
  id: number;
  name: string;
  type: CompanyType;
  district: string;
  account: string;
  transit: string;
  treasury: string;
  mfo: string;
  status: "normal" | "danger" | "warning"; // qator rangi
}

export const COMPANIES: CompanyRow[] = [
  { id: 355, name: "Sh.Rashidov tuman Toza Hudud", type: "Давлат Унитар Корхонаси", district: "Шароф Рашидов тумани", account: "23402000300100001010", transit: "22604000605565269180", treasury: "", mfo: "00419", status: "normal" },
  { id: 363, name: "Zarbdor tumani Toza Hudud", type: "Давлат Унитар Корхонаси", district: "Зарбдор тумани", account: "23402000300100001010", transit: "22604000505565269182", treasury: "", mfo: "00419", status: "normal" },
  { id: 644, name: "Jizzax EKO-HOUSE", type: "Кластер", district: "Жиззах шаҳар", account: "2020800020078655600 1", transit: "22604000405565269184", treasury: "", mfo: "00419", status: "danger" },
  { id: 1573, name: "Toza Eko Hudud", type: "Давлат хусусий шерикчилик", district: "Дўстлик тумани", account: "20208000305476685001", transit: "22604000905565269174", treasury: "", mfo: "00419", status: "normal" },
  { id: 1574, name: "Eko sfera MChJ", type: "Давлат хусусий шерикчилик", district: "Арнасой тумани", account: "20208000905412175005", transit: "22604000905565269181", treasury: "", mfo: "00419", status: "normal" },
  { id: 1575, name: "Eko sfera MChJ", type: "Давлат хусусий шерикчилик", district: "Бахмал тумани", account: "20208000905412175005", transit: "22604000505565269177", treasury: "", mfo: "00419", status: "normal" },
  { id: 1576, name: "Eko sfera MChJ", type: "Давлат хусусий шерикчилик", district: "Ғаллаорол тумани", account: "20208000905412175005", transit: "22604000305565269173", treasury: "", mfo: "00419", status: "normal" },
  { id: 1577, name: "Eko sfera MChJ", type: "Давлат хусусий шерикчилик", district: "Зомин тумани", account: "20208000905412175005", transit: "22604000005565269176", treasury: "", mfo: "00419", status: "normal" },
  { id: 1578, name: "Eko sfera MChJ", type: "Давлат хусусий шерикчилик", district: "Пахтакор тумани", account: "20208000905412175005", transit: "22604000805565269172", treasury: "", mfo: "00419", status: "normal" },
  { id: 1579, name: "Eko sfera MChJ", type: "Давлат хусусий шерикчилик", district: "Мирзачўл тумани", account: "20208000905412175005", transit: "22604000405565269175", treasury: "", mfo: "00419", status: "normal" },
  { id: 1580, name: "Eko sfera MChJ", type: "Давлат хусусий шерикчилик", district: "Фориш тумани", account: "20208000905412175005", transit: "22604000905565269178", treasury: "", mfo: "00419", status: "warning" },
  { id: 1581, name: "Eko sfera MChJ", type: "Давлат хусусий шерикчилик", district: "Янгиобод тумани", account: "20208000905412175005", transit: "22604000005565269183", treasury: "", mfo: "00419", status: "normal" },
];

export const REGION_NAME = "Жиззах вилояти";

// Monitoring uchun mock avtomobillar (Wialon yo'q — simulyatsiya).
// ~148 ta mashina 13 tuman markazlari atrofida tarqatilgan (asl saytdagidek).
// Har bir mashinada batafsil (detail) maydonlar — modal uchun.
import { DISTRICT_CENTROIDS } from "./districtCentroids";
import { JIZZAX_DISTRICTS } from "./jizzax";

export interface VehicleNote {
  date: string;
  text: string;
}

export interface MockVehicle {
  id: number;
  plate: string;
  model: string;
  districtId: number;
  lat: number;
  lng: number;
  speed: number;
  // detail (modal)
  odometer: number; // km
  engineHours: number; // soat
  satellites: number;
  ignition: boolean;
  voltage: number; // V
  device: string;
  imei: string;
  installDate: string;
  seals: string;
  installer: string;
  gosNumber: string;
  org: string;
  driver: string;
  notes: VehicleNote[];
}

// ISUZU ustun (asl saytda deyarli hammasi ISUZU)
const MODELS = ["ISUZU", "ISUZU", "ISUZU", "HOWO", "KOMPAKTOR", "Hyundai", "KAMAZ", "MERCEDES"];
const SERIES = ["NAA", "QAA", "RAA", "OAA", "SAA", "XKA", "HLA", "AAB", "BAC"];
const DEVICES = ["Teltonika FM B920", "Teltonika FM5300", "Teltonika FMB122", "Positron MX+"];
const INSTALLERS = ["RUSTAM", "AZIZ", "JAHONGIR", "SHERZOD", "BEKZOD"];
const INSTALL_DATES = ["24.05.2019", "12.09.2020", "03.02.2021", "18.11.2019", "07.06.2022"];
const DRIVERS = [
  "NEMATJON XOLJIGITOV",
  "BOTIR ERGASHEV",
  "SARDOR QODIROV",
  "JASUR TOSHEV",
  "AKMAL YULDASHEV",
  "RUSTAM NAZAROV",
  "OYBEK SAIDOV",
  "FARRUX KARIMOV",
];
const NOTE_TEXTS = [
  "перерезан кабель питания со стороны водителя",
  "перепрошивка",
  "замена GPS антенны",
  "плановый осмотр",
  "ремонт датчика зажигания",
];

const districtIds = JIZZAX_DISTRICTS.map((d) => d.id);

export function makeVehicles(count = 148): MockVehicle[] {
  const out: MockVehicle[] = [];
  for (let i = 0; i < count; i++) {
    const districtId = districtIds[i % districtIds.length];
    const [clat, clng] = DISTRICT_CENTROIDS[districtId];
    const a = (i * 137) % 360;
    const r = 0.01 + ((i * 29) % 55) / 800;
    const num = 100 + ((i * 17) % 900);
    const plate = `${25 + (i % 5)} / ${num} ${SERIES[i % SERIES.length]}`;
    const ignition = i % 4 !== 0;
    out.push({
      id: 5476 + i,
      plate,
      model: MODELS[i % MODELS.length],
      districtId,
      lat: clat + r * Math.sin((a * Math.PI) / 180),
      lng: clng + r * Math.cos((a * Math.PI) / 180),
      speed: ignition ? 5 + ((i * 7) % 55) : 0,
      odometer: 120000 + ((i * 137) % 160000),
      engineHours: 5000 + ((i * 53) % 9000),
      satellites: 8 + (i % 13),
      ignition,
      voltage: ignition ? 27 - (i % 4) : 0,
      device: DEVICES[i % DEVICES.length],
      imei: `0${84480000 + i * 137}`,
      installDate: INSTALL_DATES[i % INSTALL_DATES.length],
      seals: `${189000 + i}-${300 + (i % 9)}`,
      installer: INSTALLERS[i % INSTALLERS.length],
      gosNumber: plate.replace(" / ", " "),
      org: "JIZZAX VILOYAT TOZA HUDUD",
      driver: DRIVERS[i % DRIVERS.length],
      notes: [
        { date: "14.10.2023", text: `ремонт ${INSTALLERS[i % INSTALLERS.length]} : ${NOTE_TEXTS[i % NOTE_TEXTS.length]}` },
        { date: "05.08.2024", text: `осмотр Вали : ${NOTE_TEXTS[(i + 1) % NOTE_TEXTS.length]}` },
      ],
    });
  }
  return out;
}

"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  GeoJSON,
  Tooltip as LTooltip,
  LayersControl,
  useMap,
} from "react-leaflet";
import type { Layer, PathOptions } from "leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { MockVehicle } from "@/lib/mock/vehicles";
import { JIZZAX_DISTRICTS } from "@/lib/mock/jizzax";
import { BRAND } from "@/theme/themeConfig";

// Tumanlar uchun kategorik ranglar (asl saytdagi rang-barang overlay)
const DISTRICT_COLORS: Record<number, string> = {
  1: "#13c2c2",
  2: "#eb2f96",
  3: "#fa8c16",
  4: "#a0d911",
  5: "#1890ff",
  6: "#722ed1",
  7: "#f759ab",
  8: "#52c41a",
  9: "#faad14",
  10: "#fadb14",
  11: "#9254de",
  12: "#ff4d4f",
  13: "#36cfc9",
};

const NAME_BY_ID: Record<number, string> = Object.fromEntries(
  JIZZAX_DISTRICTS.map((d) => [d.id, d.name]),
);

// Mashina (car) ikonasi — rangli doira ichida oq avtomobil silueti
function carIcon(selected: boolean) {
  const size = selected ? 32 : 24;
  const color = selected ? BRAND.danger : "#00a843";
  const g = Math.round(size * 0.62);
  const html = `
    <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};
      border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.55);
      display:flex;align-items:center;justify-content:center;">
      <svg viewBox="0 0 24 24" width="${g}" height="${g}" fill="#fff">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-8l-2.08-5.99zM6.5 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>
    </div>`;
  return L.divIcon({
    html,
    className: "car-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const fix = () => map.invalidateSize();
    const tid = setTimeout(fix, 120);
    window.addEventListener("resize", fix);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", fix);
    };
  }, [map]);
  return null;
}

function FitToData({ data }: { data: FeatureCollection }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const b = L.geoJSON(data).getBounds();
    if (b.isValid()) map.fitBounds(b, { padding: [20, 20] });
  }, [data, map]);
  return null;
}

function FlyToSelected({ v }: { v: MockVehicle | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (v) map.flyTo([v.lat, v.lng], Math.max(map.getZoom(), 11), { duration: 0.8 });
  }, [v, map]);
  return null;
}

export default function MonitoringMap({
  vehicles,
  selected,
  onVehicleClick,
}: {
  vehicles: MockVehicle[];
  selected: number | null;
  onVehicleClick?: (id: number) => void;
}) {
  const [districts, setDistricts] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/geo/jizzax-districts.geojson")
      .then((r) => r.json())
      .then((j) => alive && setDistricts(j))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const styleFn = (feature?: Feature<Geometry>): PathOptions => {
    const id = feature?.properties?.districtId as number;
    return {
      fillColor: DISTRICT_COLORS[id] ?? "#888",
      color: DISTRICT_COLORS[id] ?? "#fff",
      weight: 1.5,
      fillOpacity: 0.35,
    };
  };

  const onEach = (feature: Feature<Geometry>, layer: Layer) => {
    const id = feature.properties?.districtId as number;
    const name = NAME_BY_ID[id];
    if (!name) return;
    layer.bindTooltip(
      `<span>${name}</span><span class="lbl-caret">▼</span>`,
      { permanent: true, direction: "center", className: "district-label", opacity: 1 },
    );
  };

  const selectedVehicle = vehicles.find((v) => v.id === selected);

  return (
    <MapContainer center={[40.15, 67.9]} zoom={8} style={{ height: "100%", width: "100%" }}>
      <InvalidateSize />
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Спутник">
          <TileLayer
            attribution="&copy; Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Кўча">
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {districts && (
        <>
          <GeoJSON data={districts} style={styleFn} onEachFeature={onEach} />
          <FitToData data={districts} />
        </>
      )}

      {vehicles.map((v) => (
        <Marker
          key={v.id}
          position={[v.lat, v.lng]}
          icon={carIcon(selected === v.id)}
          eventHandlers={{ click: () => onVehicleClick?.(v.id) }}
        >
          <LTooltip>
            <b>{v.plate}</b> — {v.model}
            <br />
            Тезлик: {v.speed} км/с
          </LTooltip>
        </Marker>
      ))}

      <FlyToSelected v={selectedVehicle} />
    </MapContainer>
  );
}

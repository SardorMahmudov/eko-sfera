"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { Layer, PathOptions, LeafletMouseEvent } from "leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { JIZZAX_DISTRICTS, type DistrictStat } from "@/lib/mock/jizzax";
import { fmtNumber } from "@/lib/format";

export type GeoMetric = "debt" | "subscribers" | "payments";

const BY_ID: Record<number, DistrictStat> = Object.fromEntries(
  JIZZAX_DISTRICTS.map((d) => [d.id, d]),
);

function metricValue(d: DistrictStat, m: GeoMetric): number {
  if (m === "debt") return d.debt;
  if (m === "subscribers") return d.subscribers;
  return d.incomeMonth;
}

// Qiymatni 0..1 ga keltirib rang beradi (qizil→sariq→yashil, debt uchun teskari)
function colorFor(v: number, min: number, max: number, m: GeoMetric): string {
  const r = max === min ? 0.5 : (v - min) / (max - min);
  // debt: yuqori = qizil; boshqalar: yuqori = to'q yashil
  if (m === "debt") {
    if (r > 0.8) return "#e5484d";
    if (r > 0.55) return "#fa8c16";
    if (r > 0.35) return "#faad14";
    if (r > 0.15) return "#fadb14";
    return "#a0d911";
  }
  if (r > 0.8) return "#007a30";
  if (r > 0.55) return "#00a843";
  if (r > 0.35) return "#00c950";
  if (r > 0.15) return "#7ee6a6";
  return "#d9f7e5";
}

function FitBounds({ data }: { data: FeatureCollection }) {
  const map = useMap();
  useEffect(() => {
    const gj = L.geoJSON(data);
    const b = gj.getBounds();
    if (b.isValid()) map.fitBounds(b, { padding: [12, 12] });
  }, [data, map]);
  return null;
}

interface Props {
  metric: GeoMetric;
  height?: number | string;
  showTiles?: boolean;
  interactive?: boolean;
  selectedId?: number | null;
  onSelect?: (id: number) => void;
}

export default function ChoroplethMap({
  metric,
  height = "100%",
  showTiles = true,
  interactive = true,
  selectedId,
  onSelect,
}: Props) {
  const [data, setData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/geo/jizzax-districts.geojson")
      .then((r) => r.json())
      .then((j) => alive && setData(j))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const [min, max] = useMemo(() => {
    const vals = JIZZAX_DISTRICTS.map((d) => metricValue(d, metric));
    return [Math.min(...vals), Math.max(...vals)];
  }, [metric]);

  const styleFn = (feature?: Feature<Geometry>): PathOptions => {
    const id = feature?.properties?.districtId as number;
    const d = BY_ID[id];
    const v = d ? metricValue(d, metric) : 0;
    return {
      fillColor: d ? colorFor(v, min, max, metric) : "#ccc",
      weight: selectedId === id ? 3 : 1,
      color: selectedId === id ? "#000" : "#ffffff",
      fillOpacity: 0.75,
    };
  };

  const onEach = (feature: Feature<Geometry>, layer: Layer) => {
    const id = feature.properties?.districtId as number;
    const d = BY_ID[id];
    if (!d) return;
    layer.bindTooltip(
      `<b>${d.name}</b><br/>Абонентлар: ${fmtNumber(d.subscribers)}<br/>Қарздорлик: ${fmtNumber(d.debt)} сўм`,
      { sticky: true },
    );
    layer.on({
      click: () => onSelect?.(id),
      mouseover: (e: LeafletMouseEvent) => (e.target as L.Path).setStyle({ fillOpacity: 0.95 }),
      mouseout: (e: LeafletMouseEvent) => (e.target as L.Path).setStyle({ fillOpacity: 0.75 }),
    });
  };

  return (
    <MapContainer
      center={[40.1, 67.9]}
      zoom={8}
      style={{ height, width: "100%" }}
      zoomControl={interactive}
      dragging={interactive}
      scrollWheelZoom={interactive}
      doubleClickZoom={interactive}
      attributionControl={showTiles}
    >
      {showTiles && (
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.55}
        />
      )}
      {data && (
        <>
          <GeoJSON key={`${metric}-${selectedId}`} data={data} style={styleFn} onEachFeature={onEach} />
          <FitBounds data={data} />
        </>
      )}
    </MapContainer>
  );
}

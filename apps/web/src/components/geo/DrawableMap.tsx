"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  CircleMarker,
  Tooltip as LTooltip,
  LayersControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { GeoPolygon } from "@/lib/mock/geography";

function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const fix = () => map.invalidateSize();
    const tid = setTimeout(fix, 150);
    window.addEventListener("resize", fix);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", fix);
    };
  }, [map]);
  return null;
}

function FitTo({ polygons, draft }: { polygons: GeoPolygon[]; draft: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const all = [...polygons.flatMap((p) => p.positions), ...draft];
    if (!all.length) return;
    const b = L.latLngBounds(all.map(([la, ln]) => L.latLng(la, ln)));
    if (b.isValid()) map.fitBounds(b, { padding: [30, 30] });
    // faqat dastlab moslash — keyin foydalanuvchi zoom qilsa buzmaymiz
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygons]);
  return null;
}

function ClickCatcher({ drawing, onAdd }: { drawing: boolean; onAdd: (p: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      if (drawing) onAdd([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

interface Props {
  existing: GeoPolygon[];
  draft: [number, number][];
  drawing: boolean;
  onAddPoint: (p: [number, number]) => void;
}

export default function DrawableMap({ existing, draft, drawing, onAddPoint }: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <MapContainer
      center={[40.715, 67.905]}
      zoom={13}
      style={{ height: "100%", width: "100%", cursor: drawing ? "crosshair" : "grab" }}
    >
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

      <ClickCatcher drawing={drawing} onAdd={onAddPoint} />

      {/* Mavjud hududlar — qizil chegara + label */}
      {existing.map((p) => (
        <Polygon
          key={p.id}
          positions={p.positions}
          pathOptions={{ color: "#e5484d", weight: 2.5, fillColor: "#52c41a", fillOpacity: 0.4 }}
        >
          <LTooltip permanent direction="center" className="area-label" opacity={1}>
            {p.name}
          </LTooltip>
        </Polygon>
      ))}

      {/* Chizilayotgan yangi hudud */}
      {draft.length >= 3 ? (
        <Polygon positions={draft} pathOptions={{ color: "#1677ff", weight: 2.5, fillColor: "#1677ff", fillOpacity: 0.25 }} />
      ) : draft.length === 2 ? (
        <Polyline positions={draft} pathOptions={{ color: "#1677ff", weight: 2.5 }} />
      ) : null}
      {draft.map((pt, i) => (
        <CircleMarker key={i} center={pt} radius={4} pathOptions={{ color: "#1677ff", fillColor: "#fff", fillOpacity: 1, weight: 2 }} />
      ))}

      <FitTo polygons={existing} draft={draft} />
    </MapContainer>
  );
}

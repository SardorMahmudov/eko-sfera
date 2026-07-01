"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip as LTooltip, LayersControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { GeoPolygon } from "@/lib/mock/geography";

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

function FitTo({ polygons }: { polygons: GeoPolygon[] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (!polygons.length) return;
    const all = polygons.flatMap((p) => p.positions);
    const b = L.latLngBounds(all.map(([la, ln]) => L.latLng(la, ln)));
    if (b.isValid()) map.fitBounds(b, { padding: [30, 30] });
  }, [polygons, map]);
  return null;
}

interface Props {
  polygons: GeoPolygon[];
  // худуд ko'rinishida: qizil chegara + label
  outlined?: boolean;
  labels?: boolean;
}

export default function MahallaMap({ polygons, outlined = false, labels = false }: Props) {
  return (
    <MapContainer center={[40.09, 67.83]} zoom={12} style={{ height: "100%", width: "100%" }}>
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

      {polygons.map((p) => (
        <Polygon
          key={p.id}
          positions={p.positions}
          pathOptions={{
            color: outlined ? "#e5484d" : "#3fbf6f",
            weight: outlined ? 2.5 : 2,
            fillColor: "#52c41a",
            fillOpacity: 0.45,
          }}
        >
          {labels ? (
            <LTooltip permanent direction="center" className="area-label" opacity={1}>
              {p.name}
            </LTooltip>
          ) : (
            <LTooltip sticky>{p.name}</LTooltip>
          )}
        </Polygon>
      ))}

      <FitTo polygons={polygons} />
    </MapContainer>
  );
}

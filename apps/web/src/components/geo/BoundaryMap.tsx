"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl, useMap } from "react-leaflet";
import type { Layer, PathOptions } from "leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { DISTRICTS } from "@/lib/mock/geography";

const NAME_BY_GEOID: Record<number, string> = Object.fromEntries(
  DISTRICTS.map((d) => [d.geoId, d.name]),
);

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

function FitBounds({ data, geoId }: { data: FeatureCollection; geoId: number | null }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const feats = geoId
      ? data.features.filter((f) => f.properties?.districtId === geoId)
      : data.features;
    if (!feats.length) return;
    const b = L.geoJSON({ type: "FeatureCollection", features: feats } as FeatureCollection).getBounds();
    if (b.isValid()) map.fitBounds(b, { padding: [24, 24] });
  }, [data, geoId, map]);
  return null;
}

interface Props {
  // null → butun viloyat chegarasi; raqam → o'sha tuman ajratiladi
  highlightGeoId?: number | null;
  // true bo'lsa har tuman nomi label bilan chiqadi
  labels?: boolean;
}

export default function BoundaryMap({ highlightGeoId = null, labels = false }: Props) {
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

  const styleFn = (feature?: Feature<Geometry>): PathOptions => {
    const id = feature?.properties?.districtId as number;
    const active = highlightGeoId == null || highlightGeoId === id;
    return {
      color: active ? "#1677ff" : "#7c8aa0",
      weight: active ? 3 : 1,
      fillColor: "#1677ff",
      fillOpacity: highlightGeoId == null ? 0.06 : active ? 0.12 : 0.02,
      dashArray: active ? undefined : "3",
    };
  };

  const onEach = (feature: Feature<Geometry>, layer: Layer) => {
    const id = feature.properties?.districtId as number;
    const name = NAME_BY_GEOID[id];
    if (!name) return;
    layer.bindTooltip(name, { sticky: true });
    if (labels) {
      layer.bindTooltip(name, { permanent: true, direction: "center", className: "district-label", opacity: 1 });
    }
  };

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

      {data && (
        <>
          <GeoJSON key={`${highlightGeoId}-${labels}`} data={data} style={styleFn} onEachFeature={onEach} />
          <FitBounds data={data} geoId={highlightGeoId} />
        </>
      )}
    </MapContainer>
  );
}

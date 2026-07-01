"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Button, Card, Spin, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { JIZZAX_DISTRICTS } from "@/lib/mock/jizzax";
import { fmtNumber } from "@/lib/format";
import { BRAND } from "@/theme/themeConfig";

const { Text } = Typography;

const ChoroplethMap = dynamic(() => import("@/components/geo/ChoroplethMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin />
    </div>
  ),
});

export default function RegionMapPanel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Choropleth xarita (abonentlar soni bo'yicha) */}
      <div
        style={{
          height: 420,
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.08)",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <ChoroplethMap metric="subscribers" showTiles={false} />
      </div>

      {/* Tuman kartalari karuseli */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Button shape="circle" size="small" icon={<LeftOutlined />} onClick={() => scroll(-1)} />
        <div
          ref={scrollRef}
          style={{ display: "flex", gap: 10, overflowX: "auto", flex: 1, paddingBottom: 4, scrollbarWidth: "none" }}
        >
          {JIZZAX_DISTRICTS.map((d) => (
            <Card key={d.id} size="small" style={{ minWidth: 175, flexShrink: 0 }} styles={{ body: { padding: 12 } }}>
              <Text strong style={{ display: "block", fontSize: 13 }}>{d.name}</Text>
              <Text style={{ fontSize: 15, fontWeight: 700, color: BRAND.greenDark }}>
                {fmtNumber(d.subscribers)}{" "}
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>та абонент</Text>
              </Text>
            </Card>
          ))}
        </div>
        <Button shape="circle" size="small" icon={<RightOutlined />} onClick={() => scroll(1)} />
      </div>
    </div>
  );
}

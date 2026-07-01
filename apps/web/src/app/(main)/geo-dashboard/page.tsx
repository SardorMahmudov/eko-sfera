"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Breadcrumb, Select, Space, Card, Typography, Spin } from "antd";
import { useTranslation } from "react-i18next";

import { JIZZAX_DISTRICTS, REGION_NAME } from "@/lib/mock/jizzax";
import type { GeoMetric } from "@/components/geo/ChoroplethMap";
import { debtColor } from "@/lib/geo";
import { fmtNumber } from "@/lib/format";

const { Text } = Typography;

const ChoroplethMap = dynamic(() => import("@/components/geo/ChoroplethMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin />
    </div>
  ),
});

export default function GeoDashboardPage() {
  const { t } = useTranslation();
  const [metric, setMetric] = useState<GeoMetric>("debt");
  const [selected, setSelected] = useState<number | null>(null);

  const max = Math.max(...JIZZAX_DISTRICTS.map((d) => d.debt));
  const sorted = useMemo(() => {
    const key = metric === "subscribers" ? "subscribers" : metric === "payments" ? "incomeMonth" : "debt";
    return [...JIZZAX_DISTRICTS].sort((a, b) => (b[key] as number) - (a[key] as number));
  }, [metric]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Breadcrumb items={[{ title: t("nav.general") }, { title: t("nav.geo") }]} />

      <Space wrap>
        <Select
          value={metric}
          onChange={setMetric}
          style={{ width: 210 }}
          options={[
            { value: "debt", label: t("geo.byDebt") },
            { value: "subscribers", label: t("geo.bySubscribers") },
            { value: "payments", label: t("geo.byPayments") },
          ]}
        />
        <Select value={REGION_NAME} style={{ width: 160 }} options={[{ value: REGION_NAME, label: REGION_NAME }]} />
        <Select
          allowClear
          placeholder={t("common.district")}
          style={{ width: 160 }}
          value={selected ?? undefined}
          onChange={(v) => setSelected(v ?? null)}
          options={JIZZAX_DISTRICTS.map((d) => ({ value: d.id, label: d.name }))}
        />
        <Select allowClear placeholder={t("common.company")} style={{ width: 160 }} />
      </Space>

      <div style={{ display: "flex", gap: 12, height: "calc(100vh - 200px)", minHeight: 480 }}>
        {/* Xarita (choropleth) */}
        <div style={{ flex: 1, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", isolation: "isolate" }}>
          <ChoroplethMap metric={metric} selectedId={selected} onSelect={setSelected} />
        </div>

        {/* O'ng panel — tuman kartalari */}
        <div style={{ width: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingRight: 4 }}>
          {sorted.map((d) => (
            <Card
              key={d.id}
              size="small"
              onClick={() => setSelected(d.id)}
              style={{
                borderLeft: `5px solid ${debtColor(d, max)}`,
                flexShrink: 0,
                cursor: "pointer",
                boxShadow: selected === d.id ? "0 0 0 2px #00c950" : undefined,
              }}
              styles={{ body: { padding: 12 } }}
            >
              <Text strong style={{ fontSize: 14 }}>{d.name}</Text>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                <Text type="secondary">{t("geo.subscribersCount")}: </Text>
                <Text>{fmtNumber(d.subscribers)}</Text>
              </div>
              <div style={{ fontSize: 12 }}>
                <Text type="secondary">{t("geo.debt")}: </Text>
                <Text>{fmtNumber(d.debt)} сўм</Text>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

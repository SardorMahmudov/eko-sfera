"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Breadcrumb, Table, Button, Select, Space, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";

import { REGIONS, REGION_NAME, REGION_CITY, type RegionRow } from "@/lib/mock/geography";

const BoundaryMap = dynamic(() => import("@/components/geo/BoundaryMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin />
    </div>
  ),
});

export default function RegionsPage() {
  const [selected, setSelected] = useState<number | null>(REGIONS[0]?.id ?? null);

  const columns: ColumnsType<RegionRow> = [
    { title: "I..", dataIndex: "id", width: 50 },
    { title: "Номи", dataIndex: "name", ellipsis: true },
    { title: "СОАТО коди", dataIndex: "coato", width: 110 },
    { title: "Кадастр коди", dataIndex: "cadastre", width: 110 },
    { title: "Ҳаракат", key: "action", width: 90, render: () => null },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Breadcrumb
          items={[{ title: "GPS кузатув" }, { title: "География" }, { title: "Вилоятлар" }]}
        />
        <Space>
          <Button>{REGION_NAME}</Button>
          <Select
            value={REGION_CITY}
            style={{ width: 160 }}
            options={[{ value: REGION_CITY, label: REGION_CITY }]}
          />
        </Space>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) 1.4fr", gap: 12 }}>
        <Table<RegionRow>
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={REGIONS}
          pagination={false}
          rowClassName={(r) => (r.id === selected ? "row-selected" : "")}
          onRow={(r) => ({ onClick: () => setSelected(r.id), style: { cursor: "pointer" } })}
          style={{ minHeight: 420 }}
        />
        <div style={{ height: 460, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
          <BoundaryMap highlightGeoId={null} />
        </div>
      </div>

      <style jsx global>{`
        .row-selected > td {
          background: #e6f4ff !important;
        }
      `}</style>
    </div>
  );
}

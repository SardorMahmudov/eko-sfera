"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Breadcrumb, Table, Button, Select, Space, Spin, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined } from "@ant-design/icons";

import { DISTRICTS, REGION_NAME, REGION_CITY, type DistrictRow } from "@/lib/mock/geography";

const BoundaryMap = dynamic(() => import("@/components/geo/BoundaryMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin />
    </div>
  ),
});

export default function DistrictsPage() {
  const [rows, setRows] = useState<DistrictRow[]>(DISTRICTS);
  const [selected, setSelected] = useState<number | null>(DISTRICTS[0]?.geoId ?? null);

  const remove = (id: number) => setRows((rs) => rs.filter((r) => r.id !== id));

  const columns: ColumnsType<DistrictRow> = [
    { title: "№", key: "n", width: 50, render: (_, __, i) => i + 1 },
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Номи", dataIndex: "name", width: 180 },
    { title: "Вилоят", dataIndex: "region", width: 140 },
    { title: "СОАТО коди", dataIndex: "coato", width: 120 },
    {
      title: "Ҳаракат",
      key: "action",
      width: 80,
      align: "center",
      render: (_, r) => (
        <Popconfirm
          title="Ўчириш"
          description="Ушбу туманни ўчирасизми?"
          okText="Ҳа"
          cancelText="Йўқ"
          onConfirm={() => remove(r.id)}
        >
          <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Breadcrumb items={[{ title: "GPS кузатув" }, { title: "География" }, { title: "Туманлар" }]} />
        <Space>
          <Button>{REGION_NAME}</Button>
          <Select value={REGION_CITY} style={{ width: 160 }} options={[{ value: REGION_CITY, label: REGION_CITY }]} />
        </Space>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(420px, 1fr) 1fr", gap: 12 }}>
        <Table<DistrictRow>
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={rows}
          rowClassName={(r) => (r.geoId === selected ? "row-selected" : "")}
          onRow={(r) => ({ onClick: () => setSelected(r.geoId), style: { cursor: "pointer" } })}
          pagination={{
            defaultPageSize: 15,
            pageSizeOptions: [15, 30, 50],
            showSizeChanger: true,
            showTotal: (total, range) => `${total} тадан ${range[0]} дан ${range[1]} гача`,
          }}
        />
        <div style={{ height: 500, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
          <BoundaryMap highlightGeoId={selected} />
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

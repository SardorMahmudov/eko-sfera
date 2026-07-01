"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Breadcrumb, Table, Button, Select, Input, Space, Spin, Alert, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, FileExcelOutlined, EditOutlined, DoubleRightOutlined } from "@ant-design/icons";

import { VILLAGES, VILLAGE_POLYGONS, REGION_NAME, REGION_CITY, type VillageRow } from "@/lib/mock/geography";
import { BRAND } from "@/theme/themeConfig";

const MahallaMap = dynamic(() => import("@/components/geo/MahallaMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin />
    </div>
  ),
});

const SECTORS = ["Хусусий сектор", "Кўп қаватли уйлар", "Тижорат объектлари"];

export default function VillagesPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState<string | undefined>();
  const [sector, setSector] = useState<string | undefined>();
  const [onlyYellow, setOnlyYellow] = useState(false);

  const companies = useMemo(() => Array.from(new Set(VILLAGES.map((v) => v.company))), []);

  const data = useMemo(
    () =>
      VILLAGES.filter(
        (v) =>
          (!name || v.name.toLowerCase().includes(name.toLowerCase())) &&
          (!company || v.company === company) &&
          (!onlyYellow || !v.gps),
      ),
    [name, company, onlyYellow],
  );

  const columns: ColumnsType<VillageRow> = [
    { title: "ID", dataIndex: "id", width: 80 },
    {
      title: "Номи",
      dataIndex: "name",
      render: (v, r) => (
        <Space size={6}>
          {r.gps && <Tag color="green" style={{ marginInlineEnd: 0 }}>GPS</Tag>}
          {v}
        </Space>
      ),
    },
    { title: "СОАТО коди", dataIndex: "coato", width: 120 },
    { title: "Корхона", dataIndex: "company", width: 150, ellipsis: true },
    {
      title: "Ҳаракат",
      key: "action",
      width: 100,
      align: "center",
      render: () => (
        <Space size={4}>
          <Tooltip title="Таҳрирлаш">
            <Button size="small" type="text" icon={<EditOutlined style={{ color: BRAND.green }} />} />
          </Tooltip>
          <Tooltip title="Синхронлаш">
            <Button size="small" type="dashed" icon={<DoubleRightOutlined style={{ color: BRAND.green }} />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Breadcrumb items={[{ title: "GPS кузатув" }, { title: "География" }, { title: "Маҳаллалар" }]} />
        <Space>
          <Button>{REGION_NAME}</Button>
          <Select value={REGION_CITY} style={{ width: 160 }} options={[{ value: REGION_CITY, label: REGION_CITY }]} />
        </Space>
      </div>

      {/* Filtrlar + amallar */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <Space wrap>
          <Input placeholder="Маҳалла номи" style={{ width: 160 }} value={name} onChange={(e) => setName(e.target.value)} />
          <Select
            allowClear
            placeholder="Корхона номи"
            style={{ width: 200 }}
            value={company}
            onChange={setCompany}
            options={companies.map((c) => ({ value: c, label: c }))}
          />
          <Select
            allowClear
            placeholder="Сектор тури"
            style={{ width: 160 }}
            value={sector}
            onChange={setSector}
            options={SECTORS.map((s) => ({ value: s, label: s }))}
          />
        </Space>
        <Space wrap>
          <Button
            type={onlyYellow ? "primary" : "default"}
            style={onlyYellow ? undefined : { background: "#f5c518", borderColor: "#f5c518", color: "#3a2f00" }}
            onClick={() => setOnlyYellow((v) => !v)}
          >
            Сариқ қаторлар
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>Қўшиш</Button>
          <Button type="primary" icon={<FileExcelOutlined />}>Excel</Button>
        </Space>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(440px, 1fr) 1fr", gap: 12 }}>
        <Table<VillageRow>
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={data}
          rowClassName={(r) => (!r.gps ? "row-warning" : "")}
          pagination={{
            defaultPageSize: 15,
            pageSizeOptions: [15, 30, 50],
            showSizeChanger: true,
            showTotal: (total, range) => `${total} тадан ${range[0]} дан ${range[1]} гача`,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Alert
            type="warning"
            showIcon
            message="Сариқ рангли қатордаги маҳалланинг координаталари йўқ!"
          />
          <div style={{ height: 420, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
            <MahallaMap polygons={VILLAGE_POLYGONS} />
          </div>
          <div>
            <Button type="primary">Сақлаш</Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .row-warning > td {
          background: #fff7db !important;
        }
      `}</style>
    </div>
  );
}

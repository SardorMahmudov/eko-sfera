"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Breadcrumb, Table, Button, Select, Space, Spin, Tooltip, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined, DoubleRightOutlined } from "@ant-design/icons";

import { MAHALLA_AREAS, VILLAGES, REGION_NAME, REGION_CITY, type MahallaAreaRow } from "@/lib/mock/geography";
import { BRAND } from "@/theme/themeConfig";
import HududModal from "@/components/geo/HududModal";

const MahallaMap = dynamic(() => import("@/components/geo/MahallaMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin />
    </div>
  ),
});

export default function MahallaAreaPage() {
  const options = useMemo(() => VILLAGES.filter((v) => v.gps).map((v) => v.name), []);
  const [mahalla, setMahalla] = useState("САЙХОН МФЙ");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MahallaAreaRow | null>(null);
  // barcha maҳallalar bo'yicha hududlar (boshlang'ich — mock)
  const [byMahalla, setByMahalla] = useState<Record<string, MahallaAreaRow[]>>(() => ({ ...MAHALLA_AREAS }));

  const areas: MahallaAreaRow[] = byMahalla[mahalla] ?? [];

  const removeArea = (id: number) =>
    setByMahalla((m) => ({ ...m, [mahalla]: (m[mahalla] ?? []).filter((a) => a.id !== id) }));

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (row: MahallaAreaRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  const saveArea = (row: Omit<MahallaAreaRow, "id">) =>
    setByMahalla((m) => {
      const list = m[mahalla] ?? [];
      if (editing) {
        // tahrirlash — mavjud id saqlanib qoladi
        return {
          ...m,
          [mahalla]: list.map((a) => (a.id === editing.id ? { ...row, id: editing.id } : a)),
        };
      }
      const id = list.reduce((mx, a) => Math.max(mx, a.id), 12000) + 2;
      return { ...m, [mahalla]: [...list, { ...row, id }] };
    });

  const columns: ColumnsType<MahallaAreaRow> = [
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "Ҳудуд номи", dataIndex: "name", width: 160 },
    { title: "Ойлик қатновлар сони", dataIndex: "monthlyTrips", width: 160, align: "center" },
    { title: "Минимум сони", dataIndex: "minCount", width: 130, align: "center" },
    {
      title: "Ҳаракат",
      key: "action",
      width: 120,
      align: "center",
      render: (_, r) => (
        <Space size={4}>
          <Tooltip title="Таҳрирлаш">
            <Button size="small" type="text" icon={<EditOutlined style={{ color: BRAND.green }} />} onClick={() => openEdit(r)} />
          </Tooltip>
          <Popconfirm title="Ўчириш" okText="Ҳа" cancelText="Йўқ" onConfirm={() => removeArea(r.id)}>
            <Button size="small" type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
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
        <Breadcrumb items={[{ title: "GPS кузатув" }, { title: "География" }, { title: "Маҳалла ҳудудлари" }]} />
        <Space>
          <Button>{REGION_NAME}</Button>
          <Select value={REGION_CITY} style={{ width: 160 }} options={[{ value: REGION_CITY, label: REGION_CITY }]} />
        </Space>
      </div>

      <Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Ҳудуд қўшиш
        </Button>
        <Select
          value={mahalla}
          style={{ width: 300 }}
          showSearch
          onChange={setMahalla}
          options={options.map((o) => ({ value: o, label: o }))}
        />
      </Space>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(480px, 1fr) 1fr", gap: 12 }}>
        <Table<MahallaAreaRow>
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={areas}
          pagination={{
            defaultPageSize: 15,
            showTotal: (total, range) => `${total} тадан ${range[0]} дан ${range[1]} гача`,
          }}
          style={{ minHeight: 460 }}
        />
        <div style={{ height: 500, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
          <MahallaMap polygons={areas} outlined labels />
        </div>
      </div>

      <HududModal
        open={modalOpen}
        mahalla={mahalla}
        existing={areas}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={saveArea}
      />
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Breadcrumb, Select, Input, Space, Switch, Table, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

import { makeVehicles, type MockVehicle } from "@/lib/mock/vehicles";
import { JIZZAX_DISTRICTS, REGION_NAME } from "@/lib/mock/jizzax";
import VehicleModal from "@/components/geo/VehicleModal";

const MonitoringMap = dynamic(() => import("@/components/geo/MonitoringMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin />
    </div>
  ),
});

export default function GpsMonitoringPage() {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState<MockVehicle[]>(() => makeVehicles(148));
  const [selected, setSelected] = useState<number | null>(null);
  const [modalId, setModalId] = useState<number | null>(null);
  const [auto, setAuto] = useState(true);
  const [district, setDistrict] = useState<number | null>(null);
  const [q, setQ] = useState("");

  // Carga bosilganda: avval xarita yaqinlashadi (fly), keyin modal ochiladi
  const onVehicleClick = (id: number) => {
    setSelected(id);
    window.setTimeout(() => setModalId(id), 850);
  };

  const modalVehicle = modalId != null ? vehicles.find((v) => v.id === modalId) ?? null : null;

  // Jadval tanasi balandligini ustun balandligiga moslash (xarita bilan teng bo'lishi uchun)
  const listRef = useRef<HTMLDivElement>(null);
  const [tableY, setTableY] = useState(420);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      // ustun balandligidan jadval sarlavhasi (~39px) va paginatsiya (~64px) ni ayiramiz
      setTableY(Math.max(160, el.clientHeight - 103));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mock harakat simulyatsiyasi (har 3s ozgina tebranish, markazdan uzoqlashmaydi)
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      const tick = Date.now() / 4000;
      setVehicles((prev) =>
        prev.map((v) => ({
          ...v,
          lat: v.lat + Math.sin(tick + v.id) * 0.0006,
          lng: v.lng + Math.cos(tick + v.id) * 0.0006,
          speed: Math.max(0, Math.round(40 + Math.sin(tick + v.id) * 25)),
        })),
      );
    }, 3000);
    return () => clearInterval(id);
  }, [auto]);

  const data = useMemo(
    () =>
      vehicles.filter(
        (v) =>
          (!district || v.districtId === district) &&
          (!q ||
            v.plate.toLowerCase().includes(q.toLowerCase()) ||
            v.model.toLowerCase().includes(q.toLowerCase())),
      ),
    [vehicles, district, q],
  );

  const columns: ColumnsType<MockVehicle> = [
    { title: "ID", dataIndex: "id", width: 64 },
    {
      title: "Рақам ва модел",
      key: "plate",
      render: (_, r) => (
        <span>
          <b style={{ fontWeight: 600 }}>{r.plate}</b>
          <span style={{ color: "#8c8c8c" }}> - {r.model}</span>
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Breadcrumb items={[{ title: t("nav.gps") }, { title: t("nav.monitoring") }]} />

      <Space wrap>
        <Select value={REGION_NAME} style={{ width: 150 }} options={[{ value: REGION_NAME, label: REGION_NAME }]} />
        <Select
          allowClear
          placeholder={t("common.district")}
          style={{ width: 150 }}
          value={district ?? undefined}
          onChange={(v) => setDistrict(v ?? null)}
          options={JIZZAX_DISTRICTS.map((d) => ({ value: d.id, label: d.name }))}
        />
        <Select allowClear placeholder={t("common.company")} style={{ width: 150 }} />
        <Input placeholder={t("common.search")} style={{ width: 160 }} value={q} onChange={(e) => setQ(e.target.value)} />
        <Space size={6}>
          <Switch checked={auto} onChange={setAuto} />
          <span style={{ fontSize: 13 }}>{t("common.autoRefresh")}</span>
        </Space>
      </Space>

      <div style={{ display: "flex", gap: 12, height: "calc(100vh - 175px)", minHeight: 520 }}>
        <div ref={listRef} style={{ width: 320, display: "flex", flexDirection: "column" }}>
          <Table<MockVehicle>
            rowKey="id"
            size="small"
            columns={columns}
            dataSource={data}
            scroll={{ y: tableY }}
            pagination={{
              pageSize: 15,
              size: "small",
              showSizeChanger: false,
              showLessItems: true,
              showTotal: (tt, range) => `${range[0]}–${range[1]} / ${tt} та`,
            }}
            onRow={(r) => ({
              onClick: () => onVehicleClick(r.id),
              style: {
                cursor: "pointer",
                background: selected === r.id ? "#e6f4ff" : undefined,
              },
            })}
          />
        </div>
        <div style={{ flex: 1, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", isolation: "isolate" }}>
          <MonitoringMap vehicles={vehicles} selected={selected} onVehicleClick={onVehicleClick} />
        </div>
      </div>

      <VehicleModal vehicle={modalVehicle} onClose={() => setModalId(null)} />
    </div>
  );
}

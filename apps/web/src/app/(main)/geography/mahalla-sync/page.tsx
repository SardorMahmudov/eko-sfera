"use client";

import { useState } from "react";
import { Breadcrumb, Button, Select, Space, Card, Progress, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SyncOutlined, CheckCircleOutlined } from "@ant-design/icons";

import { DISTRICTS, REGION_NAME, REGION_CITY } from "@/lib/mock/geography";

interface SyncRow {
  key: number;
  district: string;
  total: number;
  synced: number;
  status: "done" | "pending";
}

const INITIAL: SyncRow[] = DISTRICTS.map((d, i) => {
  const total = 12 + ((d.id * 7) % 28);
  const synced = i < 3 ? total : Math.floor(total * 0.6);
  return { key: d.id, district: d.name, total, synced, status: i < 3 ? "done" : "pending" };
});

export default function MahallaSyncPage() {
  const [rows, setRows] = useState<SyncRow[]>(INITIAL);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalMahallas = rows.reduce((s, r) => s + r.total, 0);
  const syncedMahallas = rows.reduce((s, r) => s + r.synced, 0);

  const runSync = () => {
    if (running) return;
    setRunning(true);
    setProgress(0);
    let p = 0;
    const timer = setInterval(() => {
      p += 8 + Math.floor(Math.random() * 10);
      if (p >= 100) {
        p = 100;
        clearInterval(timer);
        setRows((rs) => rs.map((r) => ({ ...r, synced: r.total, status: "done" })));
        setRunning(false);
        message.success("Маҳаллалар муваффақиятли синхронланди");
      }
      setProgress(p);
    }, 350);
  };

  const columns: ColumnsType<SyncRow> = [
    { title: "№", key: "n", width: 50, render: (_, __, i) => i + 1 },
    { title: "Туман", dataIndex: "district" },
    { title: "Жами маҳалла", dataIndex: "total", width: 130, align: "center" },
    { title: "Синхронланган", dataIndex: "synced", width: 140, align: "center" },
    {
      title: "Ҳолати",
      key: "status",
      width: 140,
      render: (_, r) =>
        r.status === "done" ? (
          <Tag icon={<CheckCircleOutlined />} color="success">Тайёр</Tag>
        ) : (
          <Tag color="warning">Кутилмоқда</Tag>
        ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Breadcrumb items={[{ title: "GPS кузатув" }, { title: "География" }, { title: "Маҳаллаларни синхронлаш" }]} />
        <Space>
          <Button>{REGION_NAME}</Button>
          <Select value={REGION_CITY} style={{ width: 160 }} options={[{ value: REGION_CITY, label: REGION_CITY }]} />
        </Space>
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <Space size={40} wrap>
            <div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>Жами маҳаллалар</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{totalMahallas}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>Синхронланган</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#00c950" }}>{syncedMahallas}</div>
            </div>
            <div style={{ minWidth: 200 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Умумий ҳолат</div>
              <Progress
                percent={running ? progress : Math.round((syncedMahallas / totalMahallas) * 100)}
                status={running ? "active" : "normal"}
              />
            </div>
          </Space>
          <Button type="primary" size="large" icon={<SyncOutlined spin={running} />} loading={running} onClick={runSync}>
            Синхронлаш
          </Button>
        </div>
      </Card>

      <Table<SyncRow>
        rowKey="key"
        size="small"
        columns={columns}
        dataSource={rows}
        pagination={{ defaultPageSize: 15, showTotal: (t, r) => `${t} тадан ${r[0]} дан ${r[1]} гача` }}
      />
    </div>
  );
}

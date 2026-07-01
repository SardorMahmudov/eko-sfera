"use client";

import { useState } from "react";
import { Row, Col, Typography, Select, Space, Modal, Input, InputNumber, App } from "antd";
import {
  TeamOutlined,
  CreditCardOutlined,
  DollarOutlined,
  MessageOutlined,
  BankOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import KpiCard from "@/components/dashboard/KpiCard";
import SectionCard from "@/components/common/SectionCard";
import RegionFilter from "@/components/dashboard/RegionFilter";
import RegionMapPanel from "@/components/dashboard/RegionMapPanel";
import IncomeBarChart from "@/components/charts/IncomeBarChart";
import { KPI_TOTALS, JIZZAX_DISTRICTS, REGION_NAME } from "@/lib/mock/jizzax";
import { fmtNumber } from "@/lib/format";

const { Title, Text } = Typography;

export default function StatisticsPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [district, setDistrict] = useState<number | null>(null);
  const [period, setPeriod] = useState("month");

  // KPI qiymatlarini admin tahrirlashi mumkin (mock, sessiya davomida saqlanadi)
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const income = JIZZAX_DISTRICTS.map((d) => ({ name: d.name, value: d.incomeMonth }));
  const totalIncome = income.reduce((s, d) => s + d.value, 0);

  const accentCards = [
    { key: "regions", title: t("kpi.regions"), value: KPI_TOTALS.regions },
    { key: "districts", title: t("kpi.districts"), value: KPI_TOTALS.districts },
    { key: "mahallas", title: t("kpi.mahallas"), value: KPI_TOTALS.mahallas },
    { key: "streets", title: t("kpi.streets"), value: KPI_TOTALS.streets },
    { key: "polygons", title: t("kpi.polygons"), value: KPI_TOTALS.polygons },
    { key: "collectionAreas", title: t("kpi.collectionAreas"), value: KPI_TOTALS.collectionAreas },
  ].map((c) => ({ ...c, value: overrides[c.key] ?? c.value }));

  const editingCard = accentCards.find((c) => c.key === editKey);

  const openEdit = (key: string, value: number) => {
    setEditKey(key);
    setEditValue(value);
  };

  const saveEdit = () => {
    if (editKey) setOverrides((o) => ({ ...o, [editKey]: editValue }));
    setEditKey(null);
    message.success("KPI қиймати янгиланди");
  };

  const iconCards = [
    { title: t("kpi.subscribers"), value: KPI_TOTALS.subscribers, suffix: "та", icon: <TeamOutlined /> },
    { title: t("kpi.debtors"), value: KPI_TOTALS.debtors, suffix: "та", icon: <CreditCardOutlined /> },
    { title: t("kpi.payments"), value: KPI_TOTALS.payments, suffix: "сўм", icon: <DollarOutlined /> },
    { title: t("kpi.appeals"), value: KPI_TOTALS.appeals, suffix: "та", icon: <MessageOutlined /> },
    { title: t("kpi.courtCases"), value: KPI_TOTALS.courtCases, suffix: "та", icon: <BankOutlined /> },
    { title: t("kpi.acts"), value: KPI_TOTALS.acts, suffix: "та", icon: <FileTextOutlined /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Sarlavha + filtr */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Title level={4} style={{ margin: 0 }}>
          {t("statistics.title")}
        </Title>
        <RegionFilter district={district} onDistrict={setDistrict} />
      </div>

      {/* Asosiy grid — chapda KPI kartalar, o'ngda xarita */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* KPI — yashil sarlavhali (edit) */}
            <Row gutter={[12, 12]}>
              {accentCards.map((c) => (
                <Col key={c.key} xs={12} sm={8}>
                  <KpiCard
                    variant="accent"
                    editable
                    title={c.title}
                    value={c.value}
                    suffix=""
                    onEdit={() => openEdit(c.key, c.value)}
                  />
                </Col>
              ))}
            </Row>

            {/* KPI — ikonali */}
            <Row gutter={[12, 12]}>
              {iconCards.map((c) => (
                <Col key={c.title} xs={12} sm={8}>
                  <KpiCard title={c.title} value={c.value} suffix={c.suffix} icon={c.icon} />
                </Col>
              ))}
            </Row>
          </div>
        </Col>

        {/* Xarita */}
        <Col xs={24} lg={10}>
          <SectionCard title={REGION_NAME} height="100%">
            <RegionMapPanel />
          </SectionCard>
        </Col>
      </Row>

      {/* Tushumlar grafigi — to'liq kenglik */}
      <SectionCard
        title={t("statistics.incomeByRegion")}
        extra={
          <Select
            size="small"
            value={period}
            onChange={setPeriod}
            style={{ width: 90 }}
            options={[
              { value: "day", label: t("common.day") },
              { value: "week", label: t("common.week") },
              { value: "month", label: t("common.month") },
              { value: "year", label: t("common.year") },
            ]}
          />
        }
      >
        <IncomeBarChart data={income} />
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <Space size={4}>
            <Text type="secondary">{t("common.total")}:</Text>
            <Text strong>{fmtNumber(totalIncome)} сўм</Text>
          </Space>
        </div>
      </SectionCard>

      {/* KPI tahrirlash modali */}
      <Modal
        title={editingCard ? `Тахрирлаш: ${editingCard.title}` : ""}
        open={!!editKey}
        onOk={saveEdit}
        onCancel={() => setEditKey(null)}
        okText="Сақлаш"
        cancelText="Бекор қилиш"
        okButtonProps={{ disabled: editValue == null }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 8 }}>
          <div>
            <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>Сарлавҳа</Text>
            <Input value={editingCard?.title} disabled />
          </div>
          <div>
            <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>Қиймат</Text>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              value={editValue}
              onChange={(v) => setEditValue(v ?? 0)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

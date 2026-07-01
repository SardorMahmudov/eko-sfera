"use client";

import { useMemo, useState } from "react";
import {
  Breadcrumb,
  Table,
  Select,
  Input,
  Button,
  Alert,
  Space,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { FileExcelOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { COMPANIES, JIZZAX_DISTRICTS, REGION_NAME, type CompanyRow } from "@/lib/mock/jizzax";
import { BRAND } from "@/theme/themeConfig";
import CompanyDrawer from "@/components/companies/CompanyDrawer";

const TYPE_OPTIONS = [
  "Давлат Унитар Корхонаси",
  "Кластер",
  "Давлат хусусий шерикчилик",
];

export default function AllCompaniesPage() {
  const { t } = useTranslation();
  const [district, setDistrict] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();
  const [inn, setInn] = useState("");
  const [selected, setSelected] = useState<CompanyRow | null>(null);

  const data = useMemo(
    () =>
      COMPANIES.filter(
        (c) =>
          (!district || c.district === district) &&
          (!type || c.type === type) &&
          (!inn || String(c.id).includes(inn) || c.name.toLowerCase().includes(inn.toLowerCase())),
      ),
    [district, type, inn],
  );

  const columns: ColumnsType<CompanyRow> = [
    { title: "ID", dataIndex: "id", width: 70 },
    { title: t("companies.name"), dataIndex: "name", width: 200 },
    { title: t("companies.type"), dataIndex: "type", width: 190 },
    { title: t("common.district"), dataIndex: "district", width: 150 },
    { title: t("companies.account"), dataIndex: "account", width: 190 },
    { title: t("companies.transit"), dataIndex: "transit", width: 180 },
    { title: t("companies.treasury"), dataIndex: "treasury", width: 170, render: (v) => v || "—" },
    { title: t("companies.mfo"), dataIndex: "mfo", width: 100 },
    {
      title: t("common.actions"),
      key: "action",
      fixed: "right",
      width: 90,
      align: "center",
      render: (_, r) => (
        <Button
          size="small"
          type="dashed"
          icon={<DoubleRightOutlined style={{ color: BRAND.green }} />}
          onClick={() => setSelected(r)}
        />
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Breadcrumb
        items={[
          { title: t("nav.general") },
          { title: t("nav.companies") },
          { title: t("common.list") },
        ]}
      />

      {/* Filtrlar + Excel + ogohlantirish */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <Space wrap>
          <Select value={REGION_NAME} style={{ width: 150 }} options={[{ value: REGION_NAME, label: REGION_NAME }]} />
          <Select
            allowClear
            placeholder={t("common.district")}
            style={{ width: 160 }}
            value={district}
            onChange={setDistrict}
            options={JIZZAX_DISTRICTS.map((d) => ({ value: d.name, label: d.name }))}
          />
          <Select
            allowClear
            placeholder={t("common.companyType")}
            style={{ width: 200 }}
            value={type}
            onChange={setType}
            options={TYPE_OPTIONS.map((tp) => ({ value: tp, label: tp }))}
          />
          <Input placeholder="ИНН" style={{ width: 150 }} value={inn} onChange={(e) => setInn(e.target.value)} />
          <Button type="primary" icon={<FileExcelOutlined />}>
            {t("common.excel")}
          </Button>
        </Space>
        <Alert
          type="warning"
          showIcon
          message={t("companies.contractWarning")}
          style={{ maxWidth: 440 }}
        />
      </div>

      <Table<CompanyRow>
        rowKey="id"
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300 }}
        rowClassName={(r) =>
          r.status === "danger" ? "row-danger" : r.status === "warning" ? "row-warning" : ""
        }
        pagination={{
          defaultPageSize: 15,
          showSizeChanger: true,
          pageSizeOptions: [15, 30, 50],
          showTotal: (total, range) => `${total} тадан ${range[0]}–${range[1]} гача`,
        }}
        onRow={(r) => ({ onClick: () => setSelected(r), style: { cursor: "pointer" } })}
      />

      <CompanyDrawer company={selected} onClose={() => setSelected(null)} />

      <style jsx global>{`
        .row-danger > td {
          background: #ffe3e3 !important;
        }
        .row-warning > td {
          background: #fff7db !important;
        }
      `}</style>
    </div>
  );
}

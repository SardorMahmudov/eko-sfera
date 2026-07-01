"use client";

import { Drawer, Descriptions, Tag, Tabs, Row, Col, Card, Statistic, Empty } from "antd";
import { TeamOutlined, CarOutlined, DollarOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { CompanyRow } from "@/lib/mock/jizzax";
import { fmtNumber } from "@/lib/format";
import { BRAND } from "@/theme/themeConfig";

// id dan deterministik mock statistika (soxta, lekin barqaror)
function mockStats(id: number) {
  const subs = 3000 + (id * 137) % 22000;
  const vehicles = 20 + (id * 7) % 180;
  const debt = ((id * 991) % 8000) * 1_000_000;
  return { subs, vehicles, debt };
}

const STATUS_TAG: Record<CompanyRow["status"], { color: string; label: string }> = {
  normal: { color: "green", label: "Фаол" },
  warning: { color: "gold", label: "Шартнома тугаяпти" },
  danger: { color: "red", label: "Эътибор талаб" },
};

export default function CompanyDrawer({
  company,
  onClose,
}: {
  company: CompanyRow | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const open = !!company;
  const st = company ? mockStats(company.id) : null;
  const status = company ? STATUS_TAG[company.status] : null;

  return (
    <Drawer
      title={company ? `#${company.id} · ${company.name}` : ""}
      width={560}
      open={open}
      onClose={onClose}
      extra={status && <Tag color={status.color}>{status.label}</Tag>}
    >
      {company && st && (
        <Tabs
          defaultActiveKey="info"
          items={[
            {
              key: "info",
              label: "Маълумот",
              children: (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Row gutter={12}>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic title="Абонентлар" value={st.subs} prefix={<TeamOutlined style={{ color: BRAND.green }} />} />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic title="Автомобиллар" value={st.vehicles} prefix={<CarOutlined style={{ color: BRAND.green }} />} />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small">
                        <Statistic title="Қарздорлик" value={fmtNumber(st.debt)} valueStyle={{ fontSize: 15 }} prefix={<DollarOutlined style={{ color: BRAND.danger }} />} />
                      </Card>
                    </Col>
                  </Row>

                  <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label={t("companies.type")}>{company.type}</Descriptions.Item>
                    <Descriptions.Item label={t("common.district")}>{company.district}</Descriptions.Item>
                    <Descriptions.Item label={t("companies.account")}>{company.account || "—"}</Descriptions.Item>
                    <Descriptions.Item label={t("companies.transit")}>{company.transit || "—"}</Descriptions.Item>
                    <Descriptions.Item label={t("companies.treasury")}>{company.treasury || "—"}</Descriptions.Item>
                    <Descriptions.Item label={t("companies.mfo")}>{company.mfo || "—"}</Descriptions.Item>
                  </Descriptions>
                </div>
              ),
            },
            {
              key: "districts",
              label: "Хизмат ҳудудлари",
              children: <Tag color="blue">{company.district}</Tag>,
            },
            {
              key: "fleet",
              label: "Автопарк",
              children: <Empty description="Автопарк рўйхати (mock) — тез орада" />,
            },
          ]}
        />
      )}
    </Drawer>
  );
}

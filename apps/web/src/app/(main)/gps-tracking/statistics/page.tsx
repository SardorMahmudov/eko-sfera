"use client";

import { Row, Col, Card, Typography, Breadcrumb } from "antd";
import {
  FlagOutlined,
  AimOutlined,
  EnvironmentOutlined,
  NodeIndexOutlined,
  DeleteOutlined,
  CarOutlined,
  LinkOutlined,
  DatabaseOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import SectionCard from "@/components/common/SectionCard";
import DonutChart from "@/components/charts/DonutChart";
import VBarChart from "@/components/charts/VBarChart";
import {
  GPS_STATS,
  GPS_DEVICE_TYPES,
  GPS_VEHICLE_TYPES,
  MOST_VISITED,
  LEAST_VISITED,
} from "@/lib/mock/jizzax";
import { fmtNumber } from "@/lib/format";
import { BRAND } from "@/theme/themeConfig";

const { Text } = Typography;

export default function GpsStatisticsPage() {
  const { t } = useTranslation();

  const units = [
    { icon: <FlagOutlined />, value: GPS_STATS.regions, label: t("kpi.regions") },
    { icon: <AimOutlined />, value: GPS_STATS.districts, label: t("kpi.districts") },
    { icon: <EnvironmentOutlined />, value: GPS_STATS.mahallas, label: t("kpi.mahallas") },
    { icon: <NodeIndexOutlined />, value: GPS_STATS.streets, label: t("kpi.streets") },
    { icon: <BuildOutlined />, value: GPS_STATS.polygons, label: t("kpi.polygons") },
    { icon: <DeleteOutlined />, value: GPS_STATS.collectionAreas, label: t("kpi.collectionAreas") },
    { icon: <CarOutlined />, value: GPS_STATS.vehiclesInSystem, label: t("gps.vehiclesInSystem") },
    { icon: <LinkOutlined />, value: GPS_STATS.wialonLinked, label: "Wialonga бириктирилганлар" },
    { icon: <DatabaseOutlined />, value: GPS_STATS.wialonTotal, label: "Wialondaги жами автомобиллар" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Breadcrumb items={[{ title: t("nav.gps") }, { title: t("nav.gpsStats") }]} />

      <Row gutter={[16, 16]}>
        {/* Geografik birliklar */}
        <Col xs={24} lg={12}>
          <SectionCard title={t("gps.geoUnits")} height="100%">
            <Row gutter={[12, 12]}>
              {units.map((u) => (
                <Col key={u.label} xs={12} sm={8}>
                  <Card size="small" style={{ textAlign: "center", height: "100%" }} styles={{ body: { padding: 14 } }}>
                    <div style={{ fontSize: 22, color: BRAND.green, marginBottom: 6 }}>{u.icon}</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>
                      {fmtNumber(u.value)} <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>та</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>{u.label}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </SectionCard>
        </Col>

        {/* Avtomobillar statistikasi — 2 donut */}
        <Col xs={24} lg={12}>
          <SectionCard title={t("gps.vehicleStats")} height="100%">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <DonutChart title={t("gps.deviceTypes")} data={GPS_DEVICE_TYPES} />
              </Col>
              <Col xs={24} md={12}>
                <DonutChart title={t("gps.vehicleTypes")} data={GPS_VEHICLE_TYPES} />
              </Col>
            </Row>
          </SectionCard>
        </Col>
      </Row>

      {/* Tashriflar */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <SectionCard title={t("gps.mostVisited")}>
            <VBarChart data={MOST_VISITED} color="#52c41a" />
          </SectionCard>
        </Col>
        <Col xs={24} lg={12}>
          <SectionCard title={t("gps.leastVisited")}>
            <VBarChart data={LEAST_VISITED} color={BRAND.danger} />
          </SectionCard>
        </Col>
      </Row>
    </div>
  );
}

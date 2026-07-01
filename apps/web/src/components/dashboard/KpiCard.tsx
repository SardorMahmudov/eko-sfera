"use client";

import { Card, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { BRAND } from "@/theme/themeConfig";
import { fmtNumber } from "@/lib/format";

const { Text } = Typography;

interface Props {
  title: string;
  value: number;
  suffix?: string;
  icon?: React.ReactNode;
  editable?: boolean;
  variant?: "accent" | "icon";
  onEdit?: () => void;
}

export default function KpiCard({
  title,
  value,
  suffix = "та",
  icon,
  editable,
  variant = "icon",
  onEdit,
}: Props) {
  if (variant === "accent") {
    // Yashil sarlavhali karta (edit ikonasi bilan)
    return (
      <Card
        size="small"
        style={{ borderTop: `3px solid ${BRAND.green}`, height: "100%" }}
        styles={{ body: { padding: "12px 14px" } }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text strong style={{ color: BRAND.greenDark, fontSize: 13 }}>
            {title}
          </Text>
          {editable && (
            <EditOutlined
              onClick={onEdit}
              style={{ color: BRAND.green, cursor: "pointer", fontSize: 13 }}
            />
          )}
        </div>
        <Text style={{ fontSize: 22, fontWeight: 700 }}>
          {fmtNumber(value)}{" "}
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>
            {suffix}
          </Text>
        </Text>
      </Card>
    );
  }

  // Ikonali karta
  return (
    <Card size="small" style={{ height: "100%" }} styles={{ body: { padding: 14 } }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {title}
        </Text>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: BRAND.greenSoft,
              color: BRAND.green,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {icon}
          </span>
          <Text style={{ fontSize: 20, fontWeight: 700 }}>
            {fmtNumber(value)}{" "}
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
              {suffix}
            </Text>
          </Text>
        </div>
      </div>
    </Card>
  );
}

"use client";

import { Card } from "antd";
import { BRAND } from "@/theme/themeConfig";

interface Props {
  title: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
  bodyStyle?: React.CSSProperties;
  height?: number | string;
}

// Yashil sarlavhali blok (screenshotdagi "Жиззах вилояти", "Тушумлар..." kabi)
export default function SectionCard({ title, extra, children, bodyStyle, height }: Props) {
  return (
    <Card
      styles={{
        header: {
          background: BRAND.green,
          color: "#fff",
          borderRadius: "10px 10px 0 0",
          minHeight: 46,
        },
        body: { padding: 16, ...bodyStyle },
      }}
      style={{ height, overflow: "hidden" }}
      title={<span style={{ color: "#fff", fontWeight: 600 }}>{title}</span>}
      extra={extra}
    >
      {children}
    </Card>
  );
}

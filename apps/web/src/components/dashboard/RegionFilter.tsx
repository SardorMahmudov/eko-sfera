"use client";

import { Select, Space } from "antd";
import { JIZZAX_DISTRICTS, REGION_NAME } from "@/lib/mock/jizzax";

interface Props {
  district?: number | null;
  onDistrict?: (id: number | null) => void;
}

export default function RegionFilter({ district, onDistrict }: Props) {
  return (
    <Space wrap>
      <Select
        value={0}
        style={{ width: 150 }}
        options={[{ value: 0, label: REGION_NAME }]}
      />
      <Select
        allowClear
        placeholder="Жиззах шаҳар"
        style={{ width: 170 }}
        value={district ?? undefined}
        onChange={(v) => onDistrict?.(v ?? null)}
        options={JIZZAX_DISTRICTS.map((d) => ({ value: d.id, label: d.name }))}
      />
    </Space>
  );
}

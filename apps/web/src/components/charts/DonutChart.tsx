"use client";

import type { EChartsOption } from "echarts";
import EChart from "./EChart";

interface Item {
  name: string;
  value: number;
}

const PALETTE = [
  "#1890ff", "#13c2c2", "#faad14", "#722ed1", "#eb2f96",
  "#52c41a", "#fa541c", "#2f54eb", "#a0d911", "#fa8c16",
];

export default function DonutChart({ title, data }: { title: string; data: Item[] }) {
  const option: EChartsOption = {
    color: PALETTE,
    title: {
      text: title,
      left: "center",
      top: 4,
      textStyle: { fontSize: 13, fontWeight: 600, color: "#475569" },
    },
    tooltip: { trigger: "item", formatter: "{b}: {d}%" },
    legend: {
      type: "scroll",
      orient: "horizontal",
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { fontSize: 10 },
    },
    series: [
      {
        type: "pie",
        radius: ["45%", "68%"],
        center: ["50%", "48%"],
        avoidLabelOverlap: true,
        label: {
          show: true,
          formatter: "{d}%",
          fontSize: 11,
        },
        labelLine: { length: 8, length2: 8 },
        data,
      },
    ],
  };

  return <EChart option={option} height={300} />;
}

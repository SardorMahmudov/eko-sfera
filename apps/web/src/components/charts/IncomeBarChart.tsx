"use client";

import type { EChartsOption } from "echarts";
import EChart from "./EChart";
import { fmtNumber } from "@/lib/format";
import { BRAND } from "@/theme/themeConfig";

interface Item {
  name: string;
  value: number;
}

export default function IncomeBarChart({ data }: { data: Item[] }) {
  // Kichikdan kattaga saralangan (screenshotdagidek)
  const sorted = [...data].sort((a, b) => a.value - b.value);

  const option: EChartsOption = {
    grid: { left: 8, right: 90, top: 10, bottom: 30, containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (v) => `${fmtNumber(Number(v))} сўм`,
    },
    xAxis: {
      type: "value",
      axisLabel: { formatter: (v: number) => `${(v / 1_000_000).toFixed(1)}` },
      splitLine: { lineStyle: { type: "dashed", color: "rgba(0,0,0,0.08)" } },
      name: "( Миллион ) сўм",
      nameLocation: "middle",
      nameGap: 26,
      nameTextStyle: { fontSize: 11, color: "#94a3b8" },
    },
    yAxis: {
      type: "category",
      data: sorted.map((d) => d.name),
      axisLabel: { fontSize: 11, color: "#475569" },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series: [
      {
        type: "bar",
        data: sorted.map((d) => d.value),
        barWidth: "58%",
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: "#7bd3a0" },
              { offset: 1, color: BRAND.green },
            ],
          },
        },
        label: {
          show: true,
          position: "right",
          formatter: (p) => `${fmtNumber(Number(p.value))} сўм`,
          fontSize: 11,
          color: "#334155",
        },
      },
    ],
  };

  return <EChart option={option} height={470} />;
}

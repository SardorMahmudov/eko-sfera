"use client";

import type { EChartsOption } from "echarts";
import EChart from "./EChart";

interface Item {
  name: string;
  value: number;
}

export default function VBarChart({
  data,
  color = "#52c41a",
}: {
  data: Item[];
  color?: string;
}) {
  const option: EChartsOption = {
    grid: { left: 8, right: 16, top: 20, bottom: 60, containLabel: true },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    xAxis: {
      type: "category",
      data: data.map((d) => d.name),
      axisLabel: { rotate: 35, fontSize: 10, color: "#475569" },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { type: "dashed", color: "rgba(0,0,0,0.08)" } },
    },
    series: [
      {
        type: "bar",
        data: data.map((d) => d.value),
        barWidth: "50%",
        itemStyle: { color, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: "top", fontSize: 11 },
      },
    ],
  };

  return <EChart option={option} height={300} />;
}

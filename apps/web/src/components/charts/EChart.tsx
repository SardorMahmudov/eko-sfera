"use client";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

interface Props {
  option: EChartsOption;
  height?: number | string;
  style?: React.CSSProperties;
}

export default function EChart({ option, height = 320, style }: Props) {
  return (
    <ReactECharts
      option={option}
      style={{ height, width: "100%", ...style }}
      opts={{ renderer: "canvas" }}
      notMerge
      lazyUpdate
    />
  );
}

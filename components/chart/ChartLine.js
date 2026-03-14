"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import styles from "./Plot.module.css";

const DEFAULT_COLORS = [
  "#0166b1",
  "#FF8243",
  "#84bc29",
  "#069494",
  "#a157f0",
  "#f2bf17",
];

export default function PlotLine({
  data,
  xAxis,
  yAxes,
  chartTitle,
  seriesColors,
  aspectRatio,
}) {
  if (!data || data.length === 0) {
    return <p className={styles.plotMessage}>No valid data for line plot.</p>;
  }

  if (!xAxis || !yAxes || yAxes.length === 0) {
    return <p className={styles.plotMessage}>Please select X and Y axes.</p>;
  }

  const hasAnyValidLine = yAxes.some((yAxis) =>
    data.some((row) => typeof row[yAxis] === "number")
  );

  if (!hasAnyValidLine) {
    return (
      <p className={styles.plotMessage}>
        No valid numeric values available for the selected Y axes.
      </p>
    );
  }

  return (
    <div className={styles.plotWrapper}>
      <div className={styles.plotWithLegend}>
        <div className={styles.plotMain}>
          <div
            className={styles.plotFrame}
            style={{ aspectRatio: aspectRatio || 1.4 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                margin={{ top: 40, right: 20, bottom: 30, left: 20 }}
                data={data}
              >
                <text
                  x="50%"
                  y={20}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="600"
                  fill="#111827"
                >
                  {chartTitle || "Line Plot"}
                </text>

                <CartesianGrid />
                <XAxis
                  type="number"
                  dataKey={xAxis}
                  label={{
                    value: xAxis,
                    position: "bottom",
                    offset: 10,
                  }}
                />
                <YAxis
                  width={60}
                  label={{
                    value: "Y values",
                    angle: -90,
                    position: "insideLeft",
                    offset: -5,
                  }}
                />
                <Tooltip />

                {yAxes.map((yAxis, index) => (
                  <Line
                    key={yAxis}
                    type="linear"
                    dataKey={yAxis}
                    name={yAxis}
                    stroke={
                      seriesColors?.[yAxis] ||
                      DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                    }
                    dot={false}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.plotLegendSide}>
          <p className={styles.legendTitle}>Legend</p>

          <div className={styles.legendList}>
            {yAxes.map((yAxis, index) => {
              const color =
                seriesColors?.[yAxis] ||
                DEFAULT_COLORS[index % DEFAULT_COLORS.length];

              return (
                <div key={yAxis} className={styles.legendItem}>
                  <span
                    className={styles.legendSwatch}
                    style={{ backgroundColor: color }}
                  />
                  <span className={styles.legendLabel}>{yAxis}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
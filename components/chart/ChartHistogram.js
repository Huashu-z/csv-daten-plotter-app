"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
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

export default function PlotHistogram({
  data,
  yAxes,
  chartTitle,
  seriesColors,
  aspectRatio,
}) {
  if (!data || data.length === 0) {
    return <p className={styles.plotMessage}>No valid data for histogram.</p>;
  }

  if (!yAxes || yAxes.length === 0) {
    return (
      <p className={styles.plotMessage}>
        Please select at least one Y-axis column.
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
              <BarChart
                data={data}
                margin={{ top: 40, right: 20, bottom: 30, left: 20 }}
              >
                <text
                  x="50%"
                  y={20}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="600"
                  fill="#111827"
                >
                  {chartTitle || "Histogram"}
                </text>

                <CartesianGrid />
                <XAxis
                  dataKey="binLabel"
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  height={60}
                  label={{
                    value: "Bins",
                    position: "bottom",
                    offset: 10,
                  }}
                />
                <YAxis
                  width={60}
                  label={{
                    value: "Count",
                    angle: -90,
                    position: "insideLeft",
                    offset: -5,
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip />

                {yAxes.map((yAxis, index) => (
                  <Bar
                    key={yAxis}
                    dataKey={yAxis}
                    name={yAxis}
                    fill={
                      seriesColors?.[yAxis] ||
                      DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                    }
                  />
                ))}
              </BarChart>
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
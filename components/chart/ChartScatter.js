"use client";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import styles from "./Chart.module.css";

const DEFAULT_COLORS = [
  "#0166b1",
  "#FF8243",
  "#84bc29",
  "#069494",
  "#a157f0",
  "#f2bf17",
];

export default function PlotScatter({
  data,
  xAxis,
  yAxes,
  chartTitle,
  seriesColors,
  aspectRatio,
}) {
  if (!data || data.length === 0) {
    return <p className={styles.plotMessage}>No valid data for scatter plot.</p>;
  }

  if (!xAxis || !yAxes || yAxes.length === 0) {
    return <p className={styles.plotMessage}>Please select X and Y axes.</p>;
  }

  const hasAnyPoints = data.some(
    (series) => series.points && series.points.length > 0
  );

  if (!hasAnyPoints) {
    return (
      <p className={styles.plotMessage}>
        No valid numeric points available for the selected axes.
      </p>
    );
  }

  const yAxisLabel = yAxes.join(" / ");

  return (
    <div className={styles.plotWrapper}>
      <div className={styles.plotWithLegend}>
        <div className={styles.plotMain}>
          <div
            className={styles.plotFrame}
            style={{ aspectRatio: aspectRatio || 1.4 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 40, right: 20, bottom: 30, left: 20 }}>
                <text
                  x="50%"
                  y={20}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="600"
                  fill="#111827"
                >
                  {chartTitle || "Scatter Plot"}
                </text>

                <CartesianGrid />
                <XAxis
                  type="number"
                  dataKey="x"
                  label={{
                    value: xAxis,
                    position: "bottom",
                    offset: 10,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  width={60}
                  label={{
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft", 
                    offset: -5,
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip />

                {data.map((series, index) => (
                  <Scatter
                    key={series.key}
                    name={series.key}
                    data={series.points}
                    fill={
                      seriesColors?.[series.key] ||
                      DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                    }
                  />
                ))}
              </ScatterChart>
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
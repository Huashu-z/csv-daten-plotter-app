"use client";

import styles from "./CsvViewer.module.css";

export default function PlotUserSetting({
  parsedData,
  plotType,
  yAxes,
  chartTitle,
  onChartTitleChange,
  seriesColors,
  onSeriesColorsChange,
  aspectRatio,
  onAspectRatioChange,
}) {
  const numericColumns = parsedData?.numericColumns ?? [];
  const selectedColorColumns = plotType === "histogram" ? yAxes : yAxes;

  return (
    <div className={styles.controlCard}>
      <h3 className={styles.controlTitle}>Custom Settings</h3>

      {!parsedData || numericColumns.length === 0 ? (
        <p className={styles.mutedText}>
          Please upload a CSV file with numeric columns first.
        </p>
      ) : (
        <div className={styles.controlStack}>
          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>Plot Title</label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => onChartTitleChange(e.target.value)}
              placeholder="Enter a chart title"
              className={styles.textInput}
            />
          </div>

          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>
              Chart Format (Width / Height)
            </label>

            <input
              type="range"
              min={9 / 16}
              max={16 / 9}
              step="0.01"
              value={aspectRatio}
              onChange={(e) => onAspectRatioChange(Number(e.target.value))}
              className={styles.rangeInput}
            />

            <div className={styles.rangeLabels}>
              <span>9:16</span>
              <span>1:1</span>
              <span>16:9</span>
            </div>
          </div>

          <div className={styles.fieldBlock}>
            <div className={styles.colorSectionTitle}>Series Colors</div>

            {selectedColorColumns.length === 0 ? (
              <p className={styles.emptyHint}>
                Select at least one Y-axis column first.
              </p>
            ) : (
              <div className={styles.colorList}>
                {selectedColorColumns.map((column) => (
                  <div key={column} className={styles.colorRow}>
                    <span className={styles.colorName}>{column}</span>

                    <input
                      type="color"
                      value={seriesColors[column] || "#d1d5db"}
                      onChange={(e) =>
                        onSeriesColorsChange({
                          ...seriesColors,
                          [column]: e.target.value,
                        })
                      }
                      className={styles.colorInput}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
import styles from "./CsvViewer.module.css";

export default function PlotTypeSelector({ plotType, onPlotTypeChange }) {
  const chartTypes = [
    { value: "scatter", label: "Scatter", iconSrc: "/icons/plot_scatter.png" },
    { value: "line", label: "Line", iconSrc: "/icons/plot_line.png" },
    { value: "histogram", label: "Histogram", iconSrc: "/icons/plot_hist.png" },
  ];

  return (
    <div className={styles.controlCard}>
      <h3 className={styles.controlTitle}>Chart Type</h3>

      <div className={styles.chartTypeGrid}>
        {chartTypes.map((type) => {
          const isActive = plotType === type.value;

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onPlotTypeChange(type.value)}
              className={`${styles.chartTypeButton} ${
                isActive ? styles.chartTypeButtonActive : ""
              }`}
            >
              <img
                src={type.iconSrc}
                alt={type.label}
                className={styles.chartTypeIcon}
              />

              <span
                className={`${styles.chartTypeLabel} ${
                  isActive ? styles.chartTypeLabelActive : ""
                }`}
              >
                {type.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
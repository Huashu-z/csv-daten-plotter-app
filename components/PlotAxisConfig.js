"use client";

import styles from "./CsvViewer.module.css";

export default function PlotAxisConfig({
  parsedData,
  xAxis,
  yAxes,
  onXAxisChange,
  onYAxesChange,
}) {
  const numericColumns = parsedData?.numericColumns ?? [];
  const hasData = numericColumns.length > 0;

  function handleYCheckboxChange(column) {
    if (column === xAxis) {
      return;
    }

    const isSelected = yAxes.includes(column);

    if (isSelected) {
      onYAxesChange(yAxes.filter((item) => item !== column));
    } else {
      onYAxesChange([...yAxes, column]);
    }
  }

  return (
    <div className={styles.controlCard}>
      <h3 className={styles.controlTitle}>Axes</h3>

      {!hasData ? (
        <p className={styles.mutedText}>
          Please upload a CSV file with numeric columns first.
        </p>
      ) : (
        <div className={styles.controlStack}>
          <div className={styles.axisBox}>
            <label htmlFor="x-axis-select" className={styles.fieldLabel}>
              X-axis
            </label>

            <select
              id="x-axis-select"
              value={xAxis || ""}
              onChange={(e) => onXAxisChange(e.target.value)}
              className={styles.selectInput}
            >
              <option value="">Select X-axis</option>
              {numericColumns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldBlock}>
            <div className={styles.fieldLabel}>Y-axis</div>

            <div className={styles.checkboxPanel}>
              {numericColumns.map((column) => {
                const isDisabled = column === xAxis;

                return (
                  <label
                    key={column}
                    className={`${styles.checkboxItem} ${
                      isDisabled ? styles.checkboxItemDisabled : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={yAxes.includes(column)}
                      disabled={isDisabled}
                      onChange={() => handleYCheckboxChange(column)}
                    />
                    <span>{column}</span>
                  </label>
                );
              })}
            </div>

            <p className={styles.selectedSummary}>
              Selected: {yAxes.length > 0 ? yAxes.join(", ") : "None"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
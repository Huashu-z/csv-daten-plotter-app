import styles from "./CsvViewer.module.css";

export default function DataPreview({ parsedData }) {
  if (!parsedData) {
    return (
      <section>
        <h2 className={styles.sectionTitle}>Data Preview</h2>
        <div className={`${styles.card} ${styles.fixedHeightCard}`}>
          <p style={{ margin: 0 }}>
            A preview of the uploaded file content will appear here.
          </p>
        </div>
      </section>
    );
  }

  const { columns, rows, warnings = [] } = parsedData;

  if (columns.length === 0 || rows.length === 0) {
    return (
      <section>
        <h2 className={styles.sectionTitle}>Data Preview</h2>
        <div className={`${styles.card} ${styles.fixedHeightCard}`}>
          {warnings.length > 0 && (
            <div
              className={`${styles.warningBox} ${styles.warningBoxStandalone}`}
            >
              <p className={styles.warningTitle}>Parsing Warnings</p>

              <ul className={styles.warningList}>
                {warnings.map((warning, index) => (
                  <li key={index} className={styles.warningItem}>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p style={{ margin: 0 }}>
            No structured table could be detected from the uploaded file.
          </p>
        </div>
      </section>
    );
  }

  const maxReviewRows = 200;
  const reviewRows = rows.slice(0, maxReviewRows);
  const totalRows = rows.length;
  const totalColumns = columns.length;
  const isTruncated = totalRows > maxReviewRows;

  return (
    <section>
      <h2 className={styles.sectionTitle}>Data Preview</h2>

      <div className={styles.card}>
        <div className={styles.previewContentRow}>
          <div className={styles.previewTableWrapper}>
            <div className={styles.previewTableScroll}>
              <table className={styles.previewTable}>
                <thead className={styles.previewTableHead}>
                  <tr>
                    {columns.map((column) => (
                      <th key={column} className={styles.previewTh}>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {reviewRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((column) => (
                        <td
                          key={`${rowIndex}-${column}`}
                          className={styles.previewTd}
                        >
                          {row[column] === null || row[column] === undefined
                            ? ""
                            : String(row[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {warnings.length > 0 && (
            <div className={`${styles.warningBox} ${styles.warningSidebar}`}>
              <p className={styles.warningTitle}>Parsing Warnings</p>

              <ul className={styles.warningList}>
                {warnings.map((warning, index) => (
                  <li key={index} className={styles.warningItem}>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className={styles.previewSummary}>
          {isTruncated
            ? `200/${totalRows} rows have been successfully parsed for review.`
            : `All ${totalRows} rows, ${totalColumns} columns have been successfully parsed.`}
        </p>
      </div>
    </section>
  );
}
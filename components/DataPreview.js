export default function DataPreview({ parsedData }) {
  if (!parsedData) {
    return (
      <section>
        <h2 style={{ marginBottom: "12px" }}>Data Preview</h2>
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #d9d9d9",
            borderRadius: "16px",
            padding: "18px",
            minHeight: "360px",
            boxSizing: "border-box",
          }}
        >
          <p style={{ margin: 0 }}>
            A preview of the uploaded file content will appear here.
          </p>
        </div>
      </section>
    );
  }

  const { columns, rows } = parsedData;

  if (columns.length === 0 || rows.length === 0) {
    return (
      <section>
        <h2 style={{ marginBottom: "12px" }}>Data Preview</h2>
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #d9d9d9",
            borderRadius: "16px",
            padding: "18px",
            minHeight: "360px",
            boxSizing: "border-box",
          }}
        >
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
      <h2 style={{ marginBottom: "12px" }}>Data Preview</h2>

      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #d9d9d9",
          borderRadius: "16px",
          padding: "18px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: "290px",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              minWidth: "640px",
              tableLayout: "auto",
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                backgroundColor: "#f7f7f7",
              }}
            >
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "10px 12px",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                      backgroundColor: "#f7f7f7",
                    }}
                  >
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
                      style={{
                        borderBottom: "1px solid #eee",
                        padding: "10px 12px",
                        whiteSpace: "nowrap",
                      }}
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

        <p style={{ marginTop: "12px", marginBottom: 0, color: "#555" }}>
          {isTruncated
            ? `All 200/${totalRows} rows have been successfully parsed for review.`
            : `${totalRows} rows, ${totalColumns} columns have been successfully parsed.`}
        </p>
      </div>
    </section>
  );
}
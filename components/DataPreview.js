import { parseCsvText } from "../lib/parseCsv";

export default function DataPreview({ rawText }) {
  if (!rawText) {
    return (
      <section>
        <h2>Data Preview</h2>
        <p>A preview of the uploaded file content will appear here.</p>
      </section>
    );
  }

  const { columns, rows } = parseCsvText(rawText);
  const previewRows = rows.slice(0, 10);

  return (
    <section>
      <h2>Data Preview</h2>

      {columns.length === 0 || rows.length === 0 ? (
        <p>No structured table could be detected from the uploaded file.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              minWidth: "600px",
            }}
          >
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      textAlign: "left",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {previewRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column}`}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
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

          <p style={{ marginTop: "12px" }}>
            Showing {previewRows.length} of {rows.length} rows.
          </p>
        </div>
      )}
    </section>
  );
}
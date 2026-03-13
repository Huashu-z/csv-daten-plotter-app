export default function PlotTypeSelector({ plotType, onPlotTypeChange }) {
  const chartTypes = [
    { value: "scatter", label: "Scatter", iconSrc: "/icons/plot_scatter.png" },
    { value: "line", label: "Line", iconSrc: "/icons/plot_line.png" },
    { value: "histogram", label: "Histogram", iconSrc: "/icons/plot_hist.png" },
    ];

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "12px" }}>Chart Type</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        {chartTypes.map((type) => {
          const isActive = plotType === type.value;

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onPlotTypeChange(type.value)}
              style={{
                border: isActive ? "2px solid #2563eb" : "1px solid #d1d5db",
                backgroundColor: isActive ? "#eff6ff" : "#ffffff",
                borderRadius: "10px",
                padding: "14px 10px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                minHeight: "88px",
              }}
            >
              <img
                src={type.iconSrc}
                alt={type.label}
                style={{
                    width: "46px",
                    height: "46px",
                    objectFit: "contain",
                }}
              />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  color: "#111827",
                }}
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
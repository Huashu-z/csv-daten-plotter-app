"use client";

import PlotTypeSelector from "./PlotTypeSelector";

export default function PlotPanel({
  parsedData,
  plotType,
  onPlotTypeChange,
  xAxis,
  yAxes,
  onXAxisChange,
  onYAxesChange,
  chartTitle,
  onChartTitleChange,
  seriesColors,
  onSeriesColorsChange,
}) {

  return (
    <section
      style={{
        width: "100%",
        border: "1px solid #d9d9d9",
        borderRadius: "16px",
        backgroundColor: "#fff",
        padding: "20px",
        boxSizing: "border-box",
        marginTop: "24px",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Plot Chart</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "20px",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            borderRight: "1px solid #e5e7eb",
            paddingRight: "20px",
          }}
        >
          <PlotTypeSelector
            plotType={plotType}
            onPlotTypeChange={onPlotTypeChange}
          />

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Axes</h3>
            <p style={{ marginBottom: 0 }}>x: single selection; y: multiple</p>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Custom Settings</h3>
            <p style={{ marginBottom: 0 }}>title and color settings</p>
          </div>
        </div>

        <div
          style={{
            minHeight: "420px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            boxSizing: "border-box",
          }}
        >
          <p style={{ marginTop: 0 }}><strong>Plot preview area</strong></p>
          <p>plotType: {plotType}</p>
          <p>xAxis: {xAxis || "not selected"}</p>
          <p>yAxes: {yAxes.length > 0 ? yAxes.join(", ") : "not selected"}</p>
          <p>title: {chartTitle || "not set"}</p>
          <p>
            parsed rows: {parsedData?.rows?.length ?? 0}, numeric columns:{" "}
            {parsedData?.numericColumns?.length ?? 0}
          </p>
        </div>
      </div>
    </section>
  );
}
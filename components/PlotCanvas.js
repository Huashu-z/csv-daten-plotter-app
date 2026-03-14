"use client";

import PlotScatter from "./chart/ChartScatter";
import PlotLine from "./chart/ChartLine";
import PlotHistogram from "./chart/ChartHistogram";
import {
  prepareScatterData,
  prepareLineData,
  prepareHistogramData,
} from "../lib/plotData";
import styles from "./CsvViewer.module.css";

export default function PlotCanvas({
  parsedData,
  plotType,
  xAxis,
  yAxes,
  chartTitle,
  seriesColors,
  aspectRatio,
}) {
  function renderMessage(message) {
    return (
      <div className={styles.plotCanvasState}>
        <p className={styles.plotMessage}>{message}</p>
      </div>
    );
  }

  if (!parsedData || !parsedData.rows || parsedData.rows.length === 0) {
    return renderMessage("No data available.");
  }

  if (!plotType) {
    return renderMessage("Please select a chart type.");
  }

  if (!yAxes || yAxes.length === 0) {
    return renderMessage("Please select at least one Y-axis column.");
  }

  if ((plotType === "scatter" || plotType === "line") && !xAxis) {
    return renderMessage("Please select an X-axis column.");
  }

  if (plotType === "scatter") {
    const data = prepareScatterData(parsedData.rows, xAxis, yAxes);
    return (
      <PlotScatter
        data={data}
        xAxis={xAxis}
        yAxes={yAxes}
        chartTitle={chartTitle}
        seriesColors={seriesColors}
        aspectRatio={aspectRatio}
      />
    );
  }

  if (plotType === "line") {
    const data = prepareLineData(parsedData.rows, xAxis, yAxes);
    return (
      <PlotLine
        data={data}
        xAxis={xAxis}
        yAxes={yAxes}
        chartTitle={chartTitle}
        seriesColors={seriesColors}
        aspectRatio={aspectRatio}
      />
    );
  }

  if (plotType === "histogram") {
    const data = prepareHistogramData(parsedData.rows, yAxes, 20);
    return (
      <PlotHistogram
        data={data}
        yAxes={yAxes}
        chartTitle={chartTitle}
        seriesColors={seriesColors}
        aspectRatio={aspectRatio}
      />
    );
  }

  return renderMessage("Unsupported chart type.");
}
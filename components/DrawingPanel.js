"use client";

import PlotTypeSelector from "./PlotTypeSelector";
import PlotAxisConfig from "./PlotAxisConfig";
import PlotCanvas from "./PlotCanvas";
import PlotUserSetting from "./PlotUserSetting";
import styles from "./CsvViewer.module.css";

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
  aspectRatio,
  onAspectRatioChange,
}) {
  return (
    <section className={styles.plotPanel}>
      <h2 className={styles.plotPanelTitle}>Plot Chart</h2>

      <div className={styles.plotPanelGrid}>
        <div className={styles.plotSidebar}>
          <PlotTypeSelector
            plotType={plotType}
            onPlotTypeChange={onPlotTypeChange}
          />

          <PlotAxisConfig
            parsedData={parsedData}
            xAxis={xAxis}
            yAxes={yAxes}
            onXAxisChange={onXAxisChange}
            onYAxesChange={onYAxesChange}
          />

          <PlotUserSetting
            parsedData={parsedData}
            plotType={plotType}
            yAxes={yAxes}
            chartTitle={chartTitle}
            onChartTitleChange={onChartTitleChange}
            seriesColors={seriesColors}
            onSeriesColorsChange={onSeriesColorsChange}
            aspectRatio={aspectRatio}
            onAspectRatioChange={onAspectRatioChange}
          />
        </div>

        <div className={styles.plotCanvasArea}>
          <PlotCanvas
            parsedData={parsedData}
            plotType={plotType}
            xAxis={xAxis}
            yAxes={yAxes}
            chartTitle={chartTitle}
            seriesColors={seriesColors}
            aspectRatio={aspectRatio}
          />
        </div>
      </div>
    </section>
  );
}
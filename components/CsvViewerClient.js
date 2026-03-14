"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import DataPreview from "./DataPreview";
import DrawingPanel from "./DrawingPanel";
import { parseCsvText } from "../lib/parseCsv";
import styles from "./CsvViewer.module.css";

export default function CsvViewerClient() {
  const [fileName, setFileName] = useState("");
  const [parsedData, setParsedData] = useState(null);

  const [plotType, setPlotType] = useState("scatter");
  const [xAxis, setXAxis] = useState("");
  const [yAxes, setYAxes] = useState([]);
  const [chartTitle, setChartTitle] = useState("");
  const [seriesColors, setSeriesColors] = useState({});
  const [aspectRatio, setAspectRatio] = useState("1 / 0.7");

  function handleFileLoaded(name, text) {
    const parsed = parseCsvText(text);

    setFileName(name);
    setParsedData(parsed);

    setPlotType("scatter");
    setXAxis("");
    setYAxes([]);
    setChartTitle("");
    setSeriesColors({});
    setAspectRatio("1.4");
  }

  function handleXAxisChange(newXAxis) {
    setXAxis(newXAxis);
    setYAxes((prev) => prev.filter((column) => column !== newXAxis));
  }

  return (
    <>
      <div className={styles.viewerTopRow}>
        <div className={styles.uploadColumn}>
          <FileUpload fileName={fileName} onFileLoaded={handleFileLoaded} />
        </div>

        <div className={styles.previewColumn}>
          <DataPreview parsedData={parsedData} />
        </div>
      </div>

      <DrawingPanel
        parsedData={parsedData}
        plotType={plotType}
        onPlotTypeChange={setPlotType}
        xAxis={xAxis}
        yAxes={yAxes}
        onXAxisChange={handleXAxisChange}
        onYAxesChange={setYAxes}
        chartTitle={chartTitle}
        onChartTitleChange={setChartTitle}
        seriesColors={seriesColors}
        onSeriesColorsChange={setSeriesColors}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
      />
    </>
  );
}
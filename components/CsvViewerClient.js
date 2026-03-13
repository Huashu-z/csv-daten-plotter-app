"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import DataPreview from "./DataPreview";
import PlotPanel from "./PlotPanel";
import { parseCsvText } from "../lib/parseCsv";

export default function CsvViewerClient() {
  const [fileName, setFileName] = useState("");
  const [parsedData, setParsedData] = useState(null);

  const [plotType, setPlotType] = useState("scatter");
  const [xAxis, setXAxis] = useState("");
  const [yAxes, setYAxes] = useState([]);
  const [chartTitle, setChartTitle] = useState("");
  const [seriesColors, setSeriesColors] = useState({});

  function handleFileLoaded(name, text) {
    const parsed = parseCsvText(text);

    setFileName(name);
    setParsedData(parsed);

    setPlotType("scatter");
    setXAxis("");
    setYAxes([]);
    setChartTitle("");
    setSeriesColors({});
  }

  return (
    <>
      <FileUpload fileName={fileName} onFileLoaded={handleFileLoaded} />
      <DataPreview parsedData={parsedData} />

      <PlotPanel
        parsedData={parsedData}
        plotType={plotType}
        onPlotTypeChange={setPlotType}
        xAxis={xAxis}
        yAxes={yAxes}
        onXAxisChange={setXAxis}
        onYAxesChange={setYAxes}
        chartTitle={chartTitle}
        onChartTitleChange={setChartTitle}
        seriesColors={seriesColors}
        onSeriesColorsChange={setSeriesColors}
      />
    </>
  );
}
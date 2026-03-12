"use client";

import { useState } from "react";
import FileUpload from "../components/FileUpload";
import AxisSelector from "../components/AxisSelector";
import DataPreview from "../components/DataPreview";
import PlotChart from "../components/PlotChart";

export default function HomePage() {
  const [fileName, setFileName] = useState("");
  const [rawText, setRawText] = useState("");

  function handleFileLoaded(fileName, rawText) {
    setFileName(fileName);
    setRawText(rawText);
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>CSV Plotter</h1>
        <p>
          Upload a CSV file, choose the X and Y axes, and visualize the data in
          a 2D chart.
        </p>
      </header>

      <div className="page-grid">
        <div className="left-column">
          <FileUpload onFileLoaded={handleFileLoaded} fileName={fileName} />
          <AxisSelector />
        </div>

        <div className="right-column">
          <DataPreview rawText={rawText} />
          <PlotChart />
        </div>
      </div>
    </main>
  );
}
"use client";

import { useRef } from "react";
import styles from "./CsvViewer.module.css";

export default function FileUpload({ onFileLoaded, fileName }) {
  const inputRef = useRef(null);

  async function handleFile(file) {
    if (!file) {
      return;
    }

    const text = await file.text();
    onFileLoaded(file.name, text);
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    await handleFile(file);
  }

  async function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    await handleFile(file);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function openFileDialog() {
    inputRef.current?.click();
  }

  return (
    <section>
      <h2 className={styles.sectionTitle}>Upload CSV File</h2>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`${styles.card} ${styles.fixedHeightCard} ${styles.uploadOuter}`}
      >
        <div className={styles.uploadInner}>
          <div>
            <p className={styles.uploadText}>Drag a file here or</p>

            <button
              type="button"
              onClick={openFileDialog}
              className={styles.uploadButton}
            >
              Browse files
            </button>

            <p className={styles.uploadHint}>
              Select a CSV file from your computer
            </p>

            {fileName && (
              <p className={styles.selectedFile}>
                Selected file: <strong>{fileName}</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </section>
  );
}
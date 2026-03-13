"use client";

import { useRef } from "react";

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
      <h2 style={{ marginBottom: "12px" }}>Upload CSV File</h2>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          backgroundColor: "#fff",
          border: "1px solid #d9d9d9",
          borderRadius: "16px",
          padding: "18px",
          minHeight: "360px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            border: "2px dashed #c7c7c7",
            borderRadius: "12px",
            minHeight: "320px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "16px", lineHeight: 1.6 }}>
              Drag a file here or{" "}
              <button
                type="button"
                onClick={openFileDialog}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "16px",
                  padding: 0,
                }}
              >
                browse
              </button>{" "}
              a file from your computer
            </p>

            {fileName && (
              <p style={{ marginTop: "18px", color: "#555" }}>
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
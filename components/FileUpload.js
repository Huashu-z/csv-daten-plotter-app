export default function FileUpload({ onFileLoaded, fileName }) {
  async function handleFileChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const text = await file.text();
    onFileLoaded(file.name, text);
  }

  return (
    <section>
      <h2>Upload CSV File</h2>
      <p>Select a CSV file to begin.</p>

      <input type="file" accept=".csv,.txt" onChange={handleFileChange} />

      {fileName && (
        <p style={{ marginTop: "12px" }}>
          <strong>Selected file:</strong> {fileName}
        </p>
      )}
    </section>
  );
}
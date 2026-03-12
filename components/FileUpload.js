export default function FileUpload() {
  return (
    <section>
      <h2>Upload CSV File</h2>
      <p>Select a CSV file to begin.</p>
      <input type="file" accept=".csv,text/csv" />
    </section>
  );
}
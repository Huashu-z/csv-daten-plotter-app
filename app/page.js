import CsvViewerClient from "../components/CsvViewerClient.js";

export default function Page() {
  return (
    <main
      style={{
        width: "90%",
        margin: "0 auto",
        padding: "24px 0",
      }}
    >
      <h1>Data Viewer</h1>
      <CsvViewerClient />
    </main>
  );
}
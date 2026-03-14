## Getting Started 

Run the development server:

```bash
npm run dev 
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tools and Libraries

- **Next.js / React** for the frontend application
- **Papa Parse** for CSV parsing
- **Recharts**  
  Used to render the interactive charts:
  - `ResponsiveContainer` for adaptive chart sizing
  - `ScatterChart` and `Scatter` for scatter plots
  - `LineChart` and `Line` for line charts
  - `BarChart` and `Bar` for histogram rendering
  - `XAxis` and `YAxis` for axis configuration
  - `CartesianGrid` for chart readability
  - `Tooltip` for value inspection
  - custom chart labels and layout configuration

## Delivery

Upload CSV file -> Parse content (including incomplete data and different input formats) -> Clean data and report parsing warnings/errors -> Display available columns and data preview -> Allow X/Y axis selection -> Generate plot -> Handle invalid or unsupported cases

## Components (UI)

1. **FileUpload**  

2. **DataPreview**  
   preview + possible parsing warnings

3. **DrawingPanel**  
   PlotTypeSelector: select scatter plot, line plot, or histogram.
   AxisSelector: 1 X-axis and one + more Y-axis columns
   PlotCanvas: draw chart.

5. **chart file**  
   how to draw each chart

## lib
1. **parseCsv** (clean and organised data): 
    1. Different delimiter: "," and ";" 
    2. Different decimal formats: "," and "."
    3. Metadate row
    4. NaN

2. **plotData**: prepare data for different chart type
    1. scatter: point series
    2. line: value order sorting along the x-axis
    3. histogram: bins setting, frequency counts




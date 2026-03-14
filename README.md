This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## delivery

Upload csv -> Parase content (data incomplete/ different format possible) -> Clean data and output error message-> Display optional column -> Allow x/y axis selection -> Draw -> Error handling 

## components (UI)
1. FileUpload: upload csv data
2. DataPreview: show first few lines of the selected file
3. AxisSelector: 1 x axe with several y axis, prepare for 4. 2D-Plots

## lib
parseCsv (clean and organised data): 
1. Different delimiter: "," and ";" 
2. Different decimal formats: "," and "."
3. Metadate row
4. NaN

plotData: prepare data for different chart type




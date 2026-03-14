export function prepareScatterData(rows, xAxis, yAxes) {
  if (!xAxis || !yAxes || yAxes.length === 0) {
    return [];
  }

  return yAxes.map((yAxis) => {
    const points = rows
      .filter((row) => {
        return (
          typeof row[xAxis] === "number" &&
          typeof row[yAxis] === "number"
        );
      })
      .map((row) => ({
        x: row[xAxis],
        y: row[yAxis],
      }));

    return {
      key: yAxis,
      points,
    };
  });
}

export function prepareLineData(rows, xAxis, yAxes) {
  if (!rows || !xAxis || !yAxes || yAxes.length === 0) {
    return [];
  }

  return rows
    .filter((row) => {
      if (typeof row[xAxis] !== "number" || Number.isNaN(row[xAxis])) {
        return false;
      }

      return yAxes.some(
        (yAxis) =>
          typeof row[yAxis] === "number" && !Number.isNaN(row[yAxis])
      );
    })
    .map((row) => {
      const result = {
        [xAxis]: row[xAxis],
      };

      yAxes.forEach((yAxis) => {
        result[yAxis] =
          typeof row[yAxis] === "number" && !Number.isNaN(row[yAxis])
            ? row[yAxis]
            : null;
      });

      return result;
    })
    .sort((a, b) => a[xAxis] - b[xAxis]);
}

export function prepareHistogramData(rows, yAxes, maxBins = 20) {
  if (!yAxes || yAxes.length === 0) {
    return [];
  }

  const seriesValues = yAxes.map((yAxis) => ({
    key: yAxis,
    values: rows
      .map((row) => row[yAxis])
      .filter((value) => typeof value === "number" && !Number.isNaN(value)),
  }));

  const allValues = seriesValues.flatMap((series) => series.values);

  if (allValues.length === 0) {
    return [];
  }

  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);

  const binCount = Math.min(maxBins, Math.ceil(Math.sqrt(allValues.length)));
  const binWidth = (globalMax - globalMin) / binCount;

  const bins = Array.from({ length: binCount }, (_, index) => {
    const rangeStart = globalMin + index * binWidth;
    const rangeEnd =
      index === binCount - 1
        ? globalMax
        : globalMin + (index + 1) * binWidth;

    const bin = {
      binLabel: `${rangeStart.toFixed(2)} - ${rangeEnd.toFixed(2)}`,
      rangeStart,
      rangeEnd,
    };

    yAxes.forEach((yAxis) => {
      bin[yAxis] = 0;
    });

    return bin;
  });

  seriesValues.forEach((series) => {
    series.values.forEach((value) => {
      let binIndex = Math.floor((value - globalMin) / binWidth);

      if (binIndex >= binCount) {
        binIndex = binCount - 1;
      }

      bins[binIndex][series.key] += 1;
    });
  });

  return bins;
}
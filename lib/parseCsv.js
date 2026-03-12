import Papa from "papaparse";

function getNonEmptyLines(rawText) {
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

// seperate rows with "#": possible metadata
function getCandidateHeaderIndices(lines) {
  const hashIndices = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#")) {
      hashIndices.push(i);
    }
  }

  if (hashIndices.length > 0) {
    return hashIndices;
  }

  return lines.length > 0 ? [0] : [];
}

// find start line of real data (exclude metadata)
function getNextDataLines(lines, startIndex, maxCount = 20) {
  const result = [];

  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("#")) {
      continue;
    }

    result.push(line);

    if (result.length >= maxCount) {
      break;
    }
  }

  return result;
}


function tryMatchHeader(lines, headerIndex, delimiter) {
  const headerLine = lines[headerIndex];
  const headerParts = headerLine.split(delimiter).map((item) => item.trim());
  const cleanedHeaderParts = headerParts.map(cleanHeader);
  const columnCount = headerParts.length;

  if (columnCount <= 1) {
    return null;
  }

  const nonEmptyHeaderCount = cleanedHeaderParts.filter(
    (item) => item !== ""
  ).length;

  if (nonEmptyHeaderCount < 2) {
    return null;
  }

  const nextDataLines = getNextDataLines(lines, headerIndex);

  if (nextDataLines.length === 0) {
    return null;
  }

  let matchingCount = 0;

  for (const line of nextDataLines) {
    const parts = line.split(delimiter).map((item) => item.trim());

    if (parts.length === columnCount) {
      matchingCount += 1;
    }
  }

  if (matchingCount >= 10 || matchingCount === nextDataLines.length) {
    return {
      headerIndex,
      delimiter,
      columnCount,
    };
  }

  return null;
}

function findTableStructure(lines) {
  const candidateHeaderIndices = getCandidateHeaderIndices(lines);

  for (const headerIndex of candidateHeaderIndices) {
    const semicolonMatch = tryMatchHeader(lines, headerIndex, ";");
    if (semicolonMatch) {
      return semicolonMatch;
    }

    const commaMatch = tryMatchHeader(lines, headerIndex, ",");
    if (commaMatch) {
      return commaMatch;
    }
  }

  return null;
}

function cleanHeader(header) {
  return String(header).trim().replace(/^#\s*/, "");
}

function convertCell(value, delimiter) {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = String(value).trim();

  if (trimmed === "" || trimmed.toLowerCase() === "nan") {
    return null;
  }

  if (delimiter === ";") {
    const normalized = trimmed.replace(",", ".");
    const num = Number(normalized);

    if (!Number.isNaN(num)) {
      return num;
    }
  } else {
    const num = Number(trimmed);

    if (!Number.isNaN(num)) {
      return num;
    }
  }

  return trimmed;
}

function isMeaningfulRow(row) {
  return Object.values(row).some(
    (value) => value !== null && value !== undefined && value !== ""
  );
}

function canBeNumber(value, delimiter) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "number") {
    return !Number.isNaN(value);
  }

  const trimmed = String(value).trim();

  if (trimmed === "" || trimmed.toLowerCase() === "nan") {
    return false;
  }

  if (delimiter === ";") {
    const normalized = trimmed.replace(",", ".");
    return !Number.isNaN(Number(normalized));
  }

  return !Number.isNaN(Number(trimmed));
}

function isNumericColumn(rows, columnName, delimiter) {
  let valueCount = 0;

  for (const row of rows) {
    const value = row[columnName];

    if (value === null || value === undefined || value === "") {
      continue;
    }

    valueCount += 1;

    if (!canBeNumber(value, delimiter)) {
      return false;
    }
  }

  return valueCount > 0;
}

export function parseCsvText(rawText) {
  const lines = getNonEmptyLines(rawText);
  const structure = findTableStructure(lines);

  if (!structure) {
    return {
      delimiter: null,
      columns: [],
      rows: [],
      numericColumns: [],
    };
  }

  const { headerIndex, delimiter } = structure;
  const relevantLines = lines.filter((line, index) => {
    if (index < headerIndex) return false;
    if (index === headerIndex) return true;
    if (line.startsWith("#")) return false;
    return true;
  });

  const cleanedText = relevantLines.join("\n");

  const parsed = Papa.parse(cleanedText, {
    header: true,
    delimiter,
    skipEmptyLines: true,
    transformHeader: cleanHeader,
  });

  const columns = (parsed.meta.fields || []).map(cleanHeader);

  const rows = parsed.data
    .map((row) => {
      const cleanedRow = {};

      for (const key of columns) {
        cleanedRow[key] = convertCell(row[key], delimiter);
      }

      return cleanedRow;
    })
    .filter(isMeaningfulRow);

  const numericColumns = columns.filter((column) =>
    isNumericColumn(rows, column, delimiter)
  );

  return {
    delimiter,
    columns,
    rows,
    numericColumns,
  };
}
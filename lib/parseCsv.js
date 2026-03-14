import Papa from "papaparse";

function getNonEmptyLines(rawText) {
  const rawLines = rawText.split(/\r?\n/);
  const trimmedLines = rawLines.map((line) => line.trim());
  const nonEmptyLines = trimmedLines.filter((line) => line !== "");

  return {
    lines: nonEmptyLines,
    removedEmptyLineCount: trimmedLines.length - nonEmptyLines.length,
  };
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

function convertCell(value, delimiter, stats) {
  if (value === undefined || value === null) {
    stats.nullLikeValueCount += 1;
    return null;
  }

  const trimmed = String(value).trim();

  if (trimmed === "" || trimmed.toLowerCase() === "nan") {
    stats.nullLikeValueCount += 1;
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
  const warnings = [];
  const {
    lines,
    removedEmptyLineCount,
  } = getNonEmptyLines(rawText);

  if (removedEmptyLineCount > 0) {
    warnings.push(
      `Warning: ${removedEmptyLineCount} empty line(s) was found in the file and removed automatically.`
    );
  }

  const metadataLineCount = lines.filter((line) => line.startsWith("#")).length;

  if (metadataLineCount > 0) {
    warnings.push(
      `Warning: ${metadataLineCount} metadata line(s) starting with "#" were detected and removed automatically.`
    );
  }

  const structure = findTableStructure(lines);

  if (!structure) {
    warnings.push(
      "Warning: No valid CSV table structure could be detected. Possible reasons: inconsistent delimiter, unclear header row, or unstable column count."
    );

    return {
      delimiter: null,
      columns: [],
      rows: [],
      numericColumns: [],
      warnings,
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

  if (parsed.errors && parsed.errors.length > 0) {
    parsed.errors.forEach((error) => {
      warnings.push(
        `Warning: CSV parsing issue at row ${error.row ?? "unknown"}: ${error.message}`
      );
    });
  }

  const columns = (parsed.meta.fields || []).map(cleanHeader);

  if (columns.length === 0) {
    warnings.push(
      "Warning: No valid column headers could be extracted from the file."
    );
  }

  const duplicateColumns = columns.filter(
    (column, index) => columns.indexOf(column) !== index
  );

  if (duplicateColumns.length > 0) {
    warnings.push(
      `Warning: Duplicate column name(s) detected: ${[
        ...new Set(duplicateColumns),
      ].join(", ")}. This may cause overwritten values during parsing.`
    );
  }

  const stats = {
    nullLikeValueCount: 0,
  };

  const rawRowCount = parsed.data.length;

  const mappedRows = parsed.data.map((row) => {
    const cleanedRow = {};

    for (const key of columns) {
      cleanedRow[key] = convertCell(row[key], delimiter, stats);
    }

    return cleanedRow;
  });

  const rows = mappedRows.filter(isMeaningfulRow);

  const removedMeaninglessRowCount = rawRowCount - rows.length;

  if (removedMeaninglessRowCount > 0) {
    warnings.push(
      `Warning: ${removedMeaninglessRowCount} empty or non-meaningful row(s) were removed automatically.`
    );
  }

  if (stats.nullLikeValueCount > 0) {
    warnings.push(
      `Warning: ${stats.nullLikeValueCount} NaN/empty/null-like value(s) were detected and converted to null.`
    );
  }

  const numericColumns = columns.filter((column) =>
    isNumericColumn(rows, column, delimiter)
  );

  if (numericColumns.length === 0 && columns.length > 0) {
    warnings.push(
      "Warning: No numeric columns were detected. Plotting may be limited."
    );
  }

  return {
    delimiter,
    columns,
    rows,
    numericColumns,
    warnings,
  };
}
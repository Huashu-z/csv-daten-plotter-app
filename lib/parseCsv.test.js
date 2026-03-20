import { describe, it, expect } from "vitest";
import { parseCsvText } from "./parseCsv";

describe("parseCsvText", () => {
  it("parses a basic comma-separated CSV", () => {
    const csv = `x,y
1,2
3,4`;

    const result = parseCsvText(csv);

    expect(result.delimiter).toBe(",");
    expect(result.columns).toEqual(["x", "y"]);
    expect(result.rows).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]);
    expect(result.numericColumns).toEqual(["x", "y"]);
    expect(result.warnings).toEqual([]);
  });

  it("parses semicolon-separated CSV with decimal commas", () => {
    const csv = `a;b
1,5;2,5
3,0;4,2`;

    const result = parseCsvText(csv);

    expect(result.delimiter).toBe(";");
    expect(result.columns).toEqual(["a", "b"]);
    expect(result.rows).toEqual([
      { a: 1.5, b: 2.5 },
      { a: 3, b: 4.2 },
    ]);
    expect(result.numericColumns).toEqual(["a", "b"]);
  });

  it('ignores metadata lines starting with "#"', () => {
    const csv = `# source: sensor
# date: 2026-03-20
x,y
1,2
3,4`;

    const result = parseCsvText(csv);

    expect(result.delimiter).toBe(",");
    expect(result.columns).toEqual(["x", "y"]);
    expect(result.rows).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]);
    expect(
      result.warnings.some((warning) =>
        warning.includes('metadata line(s) starting with "#"')
      )
    ).toBe(true);
  });

  it("converts empty strings and NaN-like values to null", () => {
    const csv = `x,y
1,NaN
,4
5,`;

    const result = parseCsvText(csv);

    expect(result.rows).toEqual([
      { x: 1, y: null },
      { x: null, y: 4 },
      { x: 5, y: null },
    ]);
    expect(
      result.warnings.some((warning) =>
        warning.includes("converted to null")
      )
    ).toBe(true);
  });

  it("detects numeric columns correctly", () => {
    const csv = `name,value,count
a,1,10
b,2,20
c,3,30`;

    const result = parseCsvText(csv);

    expect(result.columns).toEqual(["name", "value", "count"]);
    expect(result.numericColumns).toEqual(["value", "count"]);
  });

  it("returns warning and empty result when no valid table structure is found", () => {
    const csv = `hello
world
something random`;

    const result = parseCsvText(csv);

    expect(result.delimiter).toBe(null);
    expect(result.columns).toEqual([]);
    expect(result.rows).toEqual([]);
    expect(result.numericColumns).toEqual([]);
    expect(
      result.warnings.some((warning) =>
        warning.includes("No valid CSV table structure could be detected")
      )
    ).toBe(true);
  });

  it("warns when duplicate column names exist", () => {
    const csv = `x,x
1,2
3,4`;

    const result = parseCsvText(csv);

    expect(result.columns).toEqual(["x", "x_1"]);
  });

  it("removes empty lines before parsing and reports a warning", () => {
    const csv = `x,y

1,2

3,4
`;

    const result = parseCsvText(csv);

    expect(result.rows).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]);
  });
});
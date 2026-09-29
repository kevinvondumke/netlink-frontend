import { describe, expect, it } from "vitest";
import { idEquals, isPresentId } from "../idUtils";

// 1. idEquals
describe("idEquals", () => {
  // Returns true when comparing a number and its string representation (10 and "10")
  it("returns true when comparing a number and its string representation", () => {
    // ARRANGE
    const numericId = 10;
    const stringId = "10";

    // ACT
    const result = idEquals(numericId, stringId);

    // ASSERT
    expect(result).toBe(true);
  });

  // Returns true when comparing null and undefined (both normalize to empty string)
  it("returns true when comparing null and undefined", () => {
    // ARRANGE
    const nullId = null;
    const undefinedId = undefined;

    // ACT
    const result = idEquals(nullId, undefinedId);

    // ASSERT
    expect(result).toBe(true);
  });

  // Returns false when comparing different IDs (10 and 20)
  it("returns false when comparing different IDs", () => {
    // ARRANGE
    const firstId = 10;
    const secondId = 20;

    // ACT
    const result = idEquals(firstId, secondId);

    // ASSERT
    expect(result).toBe(false);
  });
});

// 2. isPresentId
describe("isPresentId", () => {
  // Returns true for a valid number or non-empty string.
  it("returns true for a valid number or non-empty string", () => {
    // ARRANGE
    const validNumberId = 10;
    const validStringId = "valid";

    // ACT
    const result = isPresentId(validNumberId);
    const result2 = isPresentId(validStringId);

    // ASSERT
    expect(result).toBe(true);
    expect(result2).toBe(true);
  });

  // Returns false for null, undefined, or empty string "".
  it("returns false for null, undefined, or empty string", () => {
    // ARRANGE
    const nullId = null;
    const undefinedId = undefined;
    const emptyStringId = "";

    // ACT
    const nullResult = isPresentId(nullId);
    const undefinedResult = isPresentId(undefinedId);
    const emptyStringResult = isPresentId(emptyStringId);

    // ASSERT
    expect(nullResult).toBe(false);
    expect(undefinedResult).toBe(false);
    expect(emptyStringResult).toBe(false);
  });
});

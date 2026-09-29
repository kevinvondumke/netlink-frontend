// CHECK IF ID IS EQUAL (NULL AND UNDEFINED ARE CONSIDERED EQUAL)
export function idEquals(
  a: string | number | null | undefined,
  b: string | number | null | undefined,
) {
  return String(a ?? "") === String(b ?? "");
}

// CHECK IF ID IS PRESENT (NOT NULL, NOT UNDEFINED, NOT EMPTY STRING)
export function isPresentId(id: string | number | null | undefined) {
  return id !== null && id !== undefined && String(id) !== "";
}

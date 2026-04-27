import { JsonValue } from "@/types";

export function getType(v: JsonValue): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

export function valueMatchesSearch(value: JsonValue, query: string): boolean {
  if (!query) return false;
  const q = query.toLowerCase();
  if (value === null) return "null".includes(q);
  if (typeof value === "string") return value.toLowerCase().includes(q);
  if (typeof value === "number" || typeof value === "boolean")
    return String(value).toLowerCase().includes(q);
  if (Array.isArray(value)) return value.some((v) => valueMatchesSearch(v, q));
  if (typeof value === "object")
    return Object.entries(value).some(
      ([k, v]) =>
        k.toLowerCase().includes(q) || valueMatchesSearch(v as JsonValue, q)
    );
  return false;
}

export function countMatches(value: JsonValue, query: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  
  const countInStr = (str: string) => str.toLowerCase().split(q).length - 1;

  if (value === null) return countInStr("null");
  if (typeof value === "string") return countInStr(value);
  if (typeof value === "number" || typeof value === "boolean")
    return countInStr(String(value));
    
  let count = 0;
  if (Array.isArray(value)) {
    for (const v of value) count += countMatches(v, q);
    return count;
  }
  if (typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      count += countInStr(k);
      count += countMatches(v as JsonValue, q);
    }
  }
  return count;
}

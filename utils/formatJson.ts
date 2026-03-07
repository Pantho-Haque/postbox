import { TabSize } from "@/types";

export const formatJson = (
  text: string,
  size: TabSize = "tab",
  minify: boolean = false,
) => {
  if (!text.trim()) {
    return { output: "", error: null };
  }

  try {
    const parsed = JSON.parse(text);
    if (minify) {
      return { output: JSON.stringify(parsed), error: null };
    } else {
      const space = size === "tab" ? "\t" : size;
      return { output: JSON.stringify(parsed, null, space), error: null };
    }
  } catch (e: unknown) {
    return { output: "", error: (e as { message: string }).message || "Invalid JSON" };
  }
};

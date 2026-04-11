import { Dispatch, SetStateAction } from "react";

export const formatJson = (text: string) => {
  if (!text?.trim()) {
    return { output: "", error: null };
  }

  try {
    const parsed = JSON.parse(text);
    return { output: JSON.stringify(parsed, null, "\t"), error: null };
  } catch (e: unknown) {
    return {
      output: text,
      error: (e as { message: string }).message || "Invalid JSON",
    };
  }
};

export const formatWithErrorHandleing = (
  text: string,
  setError: Dispatch<SetStateAction<string | null>>,
) => {
  const { output, error } = formatJson(text);
  if (!!error) {
    setError(error);
  } else {
    setError(null);
  }
  return output;
};

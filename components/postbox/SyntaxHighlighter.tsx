"use client";
import { useNotification } from "@/hooks";

export default function SyntaxHighlighter({ data }: { data: unknown }) {
  const toast = useNotification();
  const jsonString = JSON.stringify(data, null, 2) || "";

  const STRING     = '"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\\s*:)?';
  const BOOLEAN    = '\\b(true|false|null)\\b';
  const NUMBER     = '-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?';
  const JSON_TOKEN = new RegExp(`(${STRING}|${BOOLEAN}|${NUMBER})`, 'g');
  const URL_PATTERN = /https?:\/\/[^\s"'<>]+/g;

  const highlighted = jsonString.replace(JSON_TOKEN, (match) => {
    if (/^"/.test(match) && /:$/.test(match)) {
      return `<span class="text-gray-300">${match}</span>`;
    }
    if (/^"/.test(match)) {
      const inner = match.replace(/^"|"$/g, "");
      if (URL_PATTERN.test(inner)) {
        URL_PATTERN.lastIndex = 0;
        const linked = inner.replace(
          URL_PATTERN,
          (url) => `<span data-url="${url}" class="text-blue-400 underline underline-offset-2 cursor-pointer hover:text-blue-800 transition-colors">${url}</span>`
        );
        return `<span class="text-green-400">"${linked}"</span>`;
      }
      return `<span class="text-green-400">${match}</span>`;
    }
    if (/true|false/.test(match)) return `<span class="text-orange-400">${match}</span>`;
    if (/null/.test(match))       return `<span class="text-gray-400">${match}</span>`;
    return `<span class="text-blue-400">${match}</span>`;
  });

  // ↓ one handler on the parent — reads data-url from whatever was clicked
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    const url = target.dataset.url;
    if (!url) return;

    if (e.metaKey) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigator.clipboard.writeText(url);
      toast.success({ title: "Copied to clipboard", desc: url });
    }
  }

  return (
    <div
      className="pb-20"
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
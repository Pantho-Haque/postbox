export default function SyntaxHighlighter({ data }: { data: unknown }) {
  const jsonString = JSON.stringify(data, null, 2) || "";

  const STRING    = '"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\\s*:)?';
  const BOOLEAN   = '\\b(true|false|null)\\b';
  const NUMBER    = '-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?';
  const JSON_TOKEN = new RegExp(`(${STRING}|${BOOLEAN}|${NUMBER})`, 'g');

  const URL_PATTERN = /https?:\/\/[^\s"'<>]+/g;

  const highlighted = jsonString
    .replace(JSON_TOKEN, (match) => {
      // key
      if (/^"/.test(match) && /:$/.test(match)) {
        return `<span class="text-gray-300">${match}</span>`;
      }
      // string value — check if it contains a URL
      if (/^"/.test(match)) {
        const inner = match.replace(/^"|"$/g, "");
        if (URL_PATTERN.test(inner)) {
          URL_PATTERN.lastIndex = 0; // reset after .test()
          const linked = inner.replace(
            URL_PATTERN,
            (url) => `<a href="${url}" data-url="${url}" class="text-blue-400 underline underline-offset-2 cursor-pointer hover:text-blue-300 transition-colors">${url}</a>`
          );
          return `<span class="text-green-400">"${linked}"</span>`;
        }
        return `<span class="text-green-400">${match}</span>`;
      }
      // boolean
      if (/true|false/.test(match)) {
        return `<span class="text-orange-400">${match}</span>`;
      }
      // null
      if (/null/.test(match)) {
        return `<span class="text-gray-400">${match}</span>`;
      }
      // number
      return `<span class="text-blue-400">${match}</span>`;
    });

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    const url = target.dataset.url;
    if (url && e.metaKey) {
      e.preventDefault();
      window.open(url, "_blank", "noopener,noreferrer");
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
export default function SyntaxHighlighter({ data }: { data: unknown }) {
  const jsonString = JSON.stringify(data, null, 2) || "";

  // Regex to identify JSON parts: keys, strings, numbers, booleans, and nulls
  const highlighted = jsonString.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "text-blue-400"; // Default: Numbers
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-gray-300"; // Keys
        } else {
          cls = "text-green-400"; // Strings
        }
      } else if (/true|false/.test(match)) {
        cls = "text-orange-400"; // Booleans
      } else if (/null/.test(match)) {
        cls = "text-gray-400"; // Null
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );

  return (
    <div 
      className="pb-20" // Prevents the last line from being hidden
      dangerouslySetInnerHTML={{ __html: highlighted }} 
    />
  );
};
import ReactMarkdown from "react-markdown";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// import remarkGfm from "remark-gfm";

type FormatParagraphType = {
  text: string;
};
export default function FormatParagraph({ text }: FormatParagraphType) {
  const processNewlines = (rawText: string) => {
    if (!rawText) return "";

    // Replace single newlines with markdown line breaks (two spaces + newline)
    // but preserve double newlines for paragraphs
    return rawText.replace(/([^\n])\n([^\n])/g, "$1  \n$2");
  };

  const processedText = processNewlines(text);

  return (
    <div className="markdown-content">
      <ReactMarkdown>{processedText}</ReactMarkdown>
    </div>
  );
}

import { FileText } from "lucide-react";
import { useDocumentContext } from "../hooks/use-document-context";

interface SearchResultItemProps {
  document: {
    id: string;
    title: string;
    documentParentId?: string;
    contentId?: string;
    children?: DocumentItem[];
  };
  searchQuery: string;
}

interface DocumentItem {
  id: string;
  title: string;
  documentParentId?: string;
  contentId?: string;
  children?: DocumentItem[];
}

export default function SearchResultItem({
  document,
  searchQuery,
}: SearchResultItemProps) {
  const { setSelectedDoc } = useDocumentContext();

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleClick = () => {
    setSelectedDoc(document);
  };

  return (
    <div
      onClick={handleClick}
      className="group min-h-[27px] text-sm py-1 px-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium cursor-pointer"
    >
      <FileText className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      <span className="truncate">
        {highlightText(document.title, searchQuery)}
      </span>
    </div>
  );
}

import { DocumentContext } from "@/context/document-provider";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import DocItem from "./doc-item";

interface Document {
  id: string;
  title: string;
  documentParentId?: string;
  contentId?: string;
  children?: Document[];
}

export default function DocumentsList({
  documents,
  level = 0,
  isSearch = false,
}: {
  documents: Document[];
  level?: number;
  isSearch?: boolean;
}) {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const documentContext = useContext(DocumentContext);

  if (!documentContext) {
    throw new Error("DocumentsList must be used within DocumentProvider");
  }

  const { setSelectedDoc } = documentContext;

  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };

  const handleDocumentClick = (document: Document) => {
    setSelectedDoc(document);
  };

  useEffect(() => {}, []);

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          "hidden text-sm text-muted-foreground/80 font-medium",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No documents inside
      </p>
      {documents &&
        documents.length > 0 &&
        documents.map((document: Document) => (
          <div key={document.id}>
            <DocItem
              label={document.title}
              onClick={() => handleDocumentClick(document)}
              id={document.id}
              onExpand={() => onExpand(document.id)}
              level={level}
              icon={FileText}
              expanded={expanded[document.id]}
              isSearch={isSearch}
            />
            {expanded[document.id] && document.children && (
              <DocumentsList documents={document.children} level={level + 1} />
            )}
          </div>
        ))}
    </>
  );
}

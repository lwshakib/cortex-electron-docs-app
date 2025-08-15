import { FileText, Plus, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDocumentContext } from "../hooks/use-document-context";
import DocItem from "./doc-item";
import DocumentsList from "./documents-list";
import SearchResultItem from "./search-result-item";
import { ScrollArea } from "./ui/scroll-area";
import logo from "/logo.svg";

interface DocumentItem {
  id: string;
  title: string;
  documentParentId?: string;
  contentId?: string;
  children?: DocumentItem[];
}

function DocumentSidebar() {
  const { documents, createDocument, searchDocuments } = useDocumentContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DocumentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleCreateDocument = async () => {
    await createDocument();
    toast.success("Document created successfully!");
  };

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchDocuments(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [searchDocuments]
  );

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder="Search documents..."]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center drag-css">
          <img src={logo} alt="Cortex Logo" className="h-8 w-8" />
          <h2 className="text-lg font-semibold text-foreground">Cortex</h2>
        </div>
      </div>

      <div className="px-4 py-2">
        <DocItem
          icon={Plus}
          label="Create new document"
          onClick={handleCreateDocument}
        />
      </div>
      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-20 py-2 text-sm bg-background/50 border border-border/20 rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          {!searchQuery && !isSearching && (
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full"></div>
            </div>
          )}
          {searchQuery && !isSearching && searchResults.length === 0 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="text-xs text-muted-foreground">No results</div>
            </div>
          )}
        </div>
      </div>

      {/* Document List */}
      <ScrollArea className="flex-1 p-2 h-[200px]">
        {searchQuery ? (
          <div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2 px-2">
              <span>
                Search results for "{searchQuery}" ({searchResults.length})
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs hover:text-foreground transition-colors"
              >
                Clear search
              </button>
            </div>
            {searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((result) => (
                  <SearchResultItem
                    key={result.id}
                    document={result}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No documents found
              </div>
            )}
          </div>
        ) : documents ? (
          documents.length > 0 ? (
            <DocumentsList documents={documents} />
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <div className="flex flex-col items-center space-y-2">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm">No documents yet</p>
                <p className="text-xs">
                  Create your first document to get started
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default DocumentSidebar;

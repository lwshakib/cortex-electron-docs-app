import React, { useCallback, useEffect, useState } from "react";

interface Document {
  id: string;
  title: string;
  documentParentId?: string;
  contentId?: string;
  children?: Document[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface DocumentContextProps {
  documents: Document[] | null;
  setDocuments: (documents: Document[] | null) => void;
  selectedDoc: Document | null;
  setSelectedDoc: (document: Document | null) => void;
  selectedDocFileContent: unknown | null;
  createDocument: (
    documentParentId?: string,
    title?: string
  ) => Promise<Document | null>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;
  searchDocuments: (query: string) => Promise<Document[]>;
  findDocumentById: (id: string) => Document | null;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

interface DocumentProviderProps {
  children: React.ReactNode;
}

export const DocumentContext = React.createContext<DocumentContextProps | null>(
  null
);

export default function DocumentProvider({ children }: DocumentProviderProps) {
  const [documents, setDocuments] = React.useState<Document[] | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocFileContent, setSelectedDocFileContent] = useState<
    unknown | null
  >(null);

  // Helper function to find document by ID recursively
  const findDocById = useCallback(
    (docs: Document[] | null, id: string): Document | null => {
      if (!docs) return null;

      for (const doc of docs) {
        if (doc.id === id) return doc;
        if (doc.children) {
          const found = findDocById(doc.children, id);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  // Helper function to update documents recursively
  const updateDocumentsRecursively = useCallback(
    (
      docs: Document[] | null,
      id: string,
      updates: Partial<Document>
    ): Document[] | null => {
      if (!docs) return null;

      return docs.map((doc) => {
        if (doc.id === id) {
          return { ...doc, ...updates, updatedAt: new Date() };
        }
        if (doc.children) {
          const updatedChildren = updateDocumentsRecursively(
            doc.children,
            id,
            updates
          );
          return {
            ...doc,
            children: updatedChildren || [],
          };
        }
        return doc;
      });
    },
    []
  );

  // Helper function to remove document recursively
  const removeDocumentRecursively = useCallback(
    (docs: Document[] | null, id: string): Document[] | null => {
      if (!docs) return null;

      return docs.filter((doc) => {
        if (doc.id === id) return false;
        if (doc.children) {
          const updatedChildren = removeDocumentRecursively(doc.children, id);
          doc.children = updatedChildren || [];
        }
        return true;
      });
    },
    []
  );

  async function fetchDocs() {
    try {
      setIsLoading(true);
      setError(null);
      const docs = await window.ipcRenderer.invoke("give-me-docs");
      setDocuments(docs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch documents"
      );
      console.error("Error fetching documents:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function createDocument(
    documentParentId?: string,
    title?: string
  ): Promise<Document | null> {
    try {
      setIsLoading(true);
      setError(null);

      const newDoc = await window.ipcRenderer.invoke("create-doc", {
        documentParentId: documentParentId,
        title: title || "Untitled Document",
      });

      if (documentParentId) {
        // Add to parent's children
        setDocuments((prevDocs) => {
          if (!prevDocs) return [newDoc];

          const updatedDocs = updateDocumentsRecursively(
            prevDocs,
            documentParentId,
            {
              children: [
                ...(findDocById(prevDocs, documentParentId)?.children || []),
                { ...newDoc, children: [] },
              ],
            }
          );
          return updatedDocs;
        });
      } else {
        // Add to root level
        setDocuments((prevDocs) => [
          ...(prevDocs || []),
          { ...newDoc, children: [] },
        ]);
      }

      return newDoc;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create document"
      );
      console.error("Error creating document:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateDocument(
    id: string,
    updates: Partial<Document>
  ): Promise<boolean> {
    try {
      setIsLoading(true);
      setError(null);

      const success = await window.ipcRenderer.invoke("update-doc", {
        id,
        updates,
      });

      if (success) {
        setDocuments((prevDocs) =>
          updateDocumentsRecursively(prevDocs, id, updates)
        );

        // Update selected document if it's the one being updated
        if (selectedDoc?.id === id) {
          setSelectedDoc((prev) =>
            prev ? { ...prev, ...updates, updatedAt: new Date() } : null
          );
        }

        return true;
      }
      return false;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update document"
      );
      console.error("Error updating document:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteDocument(id: string): Promise<boolean> {
    try {
      setIsLoading(true);
      setError(null);

      const success = await window.ipcRenderer.invoke("delete-doc", { id });

      if (success) {
        setDocuments((prevDocs) => removeDocumentRecursively(prevDocs, id));

        // Clear selection if deleted document was selected
        if (selectedDoc?.id === id) {
          setSelectedDoc(null);
        }

        return true;
      }
      return false;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete document"
      );
      console.error("Error deleting document:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function searchDocuments(query: string): Promise<Document[]> {
    if (!query.trim()) return [];

    try {
      setIsLoading(true);
      setError(null);
      const results = await window.ipcRenderer.invoke("search-documents", {
        query: query.trim(),
      });
      return results;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search documents"
      );
      console.error("Error searching documents:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  const findDocumentById = useCallback(
    (id: string): Document | null => {
      return findDocById(documents, id);
    },
    [documents, findDocById]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchFileContent() {
    if (!selectedDoc?.id) {
      setSelectedDocFileContent(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const fileContent = await window.ipcRenderer.invoke("get-file-content", {
        docId: selectedDoc.id,
      });
      setSelectedDocFileContent(fileContent);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch file content"
      );
      console.error("Error fetching file content:", err);
      setSelectedDocFileContent(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchFileContent();
  }, [selectedDoc]);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        setDocuments,
        selectedDoc,
        setSelectedDoc,
        selectedDocFileContent,
        createDocument,
        updateDocument,
        deleteDocument,
        searchDocuments,
        findDocumentById,
        isLoading,
        error,
        clearError,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

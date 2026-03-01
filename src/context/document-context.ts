import React from 'react';

/**
 * Represents the structure of a single document in the frontend and sidebar.
 */
export interface Document {
  id: string; // Unique ID (UUID or 'welcome')
  title: string; // The note title
  documentParentId?: string; // Links to parent doc if nested
  contentId?: string; // Content file handle
  children?: Document[]; // Children for recursive tree display
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface defining the API exposed by the Document Provider.
 */
export interface DocumentContextProps {
  documents: Document[] | null; // The root-level document tree
  setDocuments: (documents: Document[] | null) => void;
  selectedDoc: Document | null; // The currently open document
  setSelectedDoc: (document: Document | null) => void;
  selectedDocFileContent: unknown | null; // Actual content block data for the selection
  createDocument: (
    documentParentId?: string,
    title?: string,
  ) => Promise<Document | null>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;
  searchDocuments: (query: string) => Promise<Document[]>;
  findDocumentById: (id: string) => Document | null;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const DocumentContext = React.createContext<DocumentContextProps | null>(
  null,
);

import React from 'react';

export interface Document {
  id: string;
  title: string;
  documentParentId?: string;
  contentId?: string;
  children?: Document[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocumentContextProps {
  documents: Document[] | null;
  setDocuments: (documents: Document[] | null) => void;
  selectedDoc: Document | null;
  setSelectedDoc: (document: Document | null) => void;
  selectedDocFileContent: unknown | null;
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

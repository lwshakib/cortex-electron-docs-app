import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DocumentsList from '../../src/components/documents-list';
import { DocumentContext } from '../../src/context/document-context';

const mockContext = {
  documents: [],
  selectedDoc: null,
  setSelectedDoc: vi.fn(),
  createDocument: vi.fn(),
  updateDocument: vi.fn(),
  deleteDocument: vi.fn(),
  searchDocuments: vi.fn(),
  findDocumentById: vi.fn(),
  isLoading: false,
  error: null,
  clearError: vi.fn(),
  setDocuments: vi.fn(),
  selectedDocFileContent: null,
};

describe('DocumentsList Component', () => {
  const mockDocuments = [
    {
      id: '1',
      title: 'Doc 1',
      children: [{ id: '1-1', title: 'Sub Doc 1-1', children: [] }],
    },
    { id: '2', title: 'Doc 2', children: [] },
  ];

  it('renders a list of documents', () => {
    render(
      <DocumentContext.Provider value={mockContext}>
        <DocumentsList documents={mockDocuments} />
      </DocumentContext.Provider>,
    );

    expect(screen.getByText('Doc 1')).toBeInTheDocument();
    expect(screen.getByText('Doc 2')).toBeInTheDocument();
  });

  it('initially does not show sub-documents', () => {
    render(
      <DocumentContext.Provider value={mockContext}>
        <DocumentsList documents={mockDocuments} />
      </DocumentContext.Provider>,
    );

    expect(screen.queryByText('Sub Doc 1-1')).not.toBeInTheDocument();
  });
});

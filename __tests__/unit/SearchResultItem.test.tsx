import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchResultItem from '../../src/components/search-result-item';
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

describe('SearchResultItem Component', () => {
  const mockDoc = {
    id: '1',
    title: 'Hello World',
  };

  it('renders and highlights the search query', () => {
    render(
      <DocumentContext.Provider value={mockContext}>
        <SearchResultItem document={mockDoc} searchQuery='World' />
      </DocumentContext.Provider>,
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    // The highlighted part might be in a separate span or have special formatting
    // depending on completion of highlighter component.
    expect(screen.getByText('World')).toBeInTheDocument();
  });

  it('calls setSelectedDoc on click', () => {
    render(
      <DocumentContext.Provider value={mockContext}>
        <SearchResultItem document={mockDoc} searchQuery='Hello' />
      </DocumentContext.Provider>,
    );

    fireEvent.click(screen.getByText('Hello'));
    expect(mockContext.setSelectedDoc).toHaveBeenCalledWith(mockDoc);
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ContentEditor from '../../src/components/content-editor';
import { DocumentContext } from '../../src/context/document-context';

// Mock the context
const mockUpdateDocument = vi.fn();
const mockContext = {
  documents: [],
  selectedDoc: { id: '1', title: 'Original Title' },
  setSelectedDoc: vi.fn(),
  createDocument: vi.fn(),
  updateDocument: mockUpdateDocument,
  deleteDocument: vi.fn(),
  searchDocuments: vi.fn(),
  findDocumentById: vi.fn(),
  isLoading: false,
  error: null,
  clearError: vi.fn(),
  setDocuments: vi.fn(),
  selectedDocFileContent: [],
};

// Mock BlockNote hooks
vi.mock('@blocknote/react', () => ({
  useCreateBlockNote: () => ({
    document: [],
    replaceBlocks: vi.fn(),
    focus: vi.fn(),
  }),
  useEditorChange: vi.fn(),
}));

// Mock BlockNote components
vi.mock('@blocknote/shadcn', () => ({
  BlockNoteView: () => <div data-testid='blocknote-view' />,
}));

describe('ContentEditor Component', () => {
  it('updates the title when input changes', async () => {
    render(
      <DocumentContext.Provider
        value={
          mockContext as unknown as React.ContextType<typeof DocumentContext>
        }
      >
        <ContentEditor />
      </DocumentContext.Provider>,
    );

    const input = screen.getByPlaceholderText(
      'Note title...',
    ) as HTMLInputElement;
    expect(input.value).toBe('Original Title');

    fireEvent.change(input, { target: { value: 'New Test Title' } });
    expect(input.value).toBe('New Test Title');

    // Should call updateDocument after debounce (500ms)
    await waitFor(
      () => {
        expect(mockUpdateDocument).toHaveBeenCalledWith('1', {
          title: 'New Test Title',
        });
      },
      { timeout: 1000 },
    );
  });

  it('updates title immediately on Enter key', () => {
    render(
      <DocumentContext.Provider
        value={
          mockContext as unknown as React.ContextType<typeof DocumentContext>
        }
      >
        <ContentEditor />
      </DocumentContext.Provider>,
    );

    const input = screen.getByPlaceholderText(
      'Note title...',
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Title Enter' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockUpdateDocument).toHaveBeenCalledWith('1', {
      title: 'New Title Enter',
    });
  });
});

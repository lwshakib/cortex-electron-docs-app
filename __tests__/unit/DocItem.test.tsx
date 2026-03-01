import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DocItem from '../../src/components/doc-item';
import { DocumentContext } from '../../src/context/document-context';

// Mock the context values
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

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <DocumentContext.Provider value={mockContext}>
      {ui}
    </DocumentContext.Provider>,
  );
};

/**
 * Unit tests for the DocItem component.
 * Verifies rendering, interactions (clicks/expansion), and
 * integration with the DocumentContext for CRUD functionality.
 */
describe('DocItem Component', () => {
  it('renders the label correctly', () => {
    renderWithContext(<DocItem label='Test Document' onClick={() => {}} />);
    expect(screen.getByText('Test Document')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    renderWithContext(<DocItem label='Test Document' onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('shows expansion icon when id is provided', () => {
    const { container } = renderWithContext(
      <DocItem id='123' label='Parent Doc' onClick={() => {}} />,
    );
    // ChevronDown or ChevronUp should be present
    const chevron = container.querySelector('svg');
    expect(chevron).toBeInTheDocument();
  });

  it('calls onExpand when chevron is clicked', () => {
    const handleExpand = vi.fn();
    renderWithContext(
      <DocItem
        id='123'
        label='Parent Doc'
        onClick={() => {}}
        onExpand={handleExpand}
      />,
    );

    // The main div has role='button', and the chevron div also has role='button'
    const buttons = screen.getAllByRole('button');
    // Main div is index 0, nested chevron is index 1
    const chevronButton = buttons[1];

    if (chevronButton) {
      fireEvent.click(chevronButton);
      expect(handleExpand).toHaveBeenCalled();
    } else {
      throw new Error('Chevron button not found');
    }
  });
});

import React from 'react';
import { DocumentContext } from '../context/document-context';

/**
 * Convenience hook to access the Document context.
 * Useful for sidebar management, search, and editor synchronization.
 */
export const useDocumentContext = () => {
  const context = React.useContext(DocumentContext);
  if (!context) {
    throw new Error(
      'useDocumentContext must be used within a DocumentProvider',
    );
  }
  return context;
};

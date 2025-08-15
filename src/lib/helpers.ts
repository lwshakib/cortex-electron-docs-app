interface Document {
  id: string;
  title: string;
  documentParentId?: string;
  contentId?: string;
  children?: Document[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const findDocById = (docs: Document[], id: string): Document | null => {
  for (const doc of docs) {
    if (doc.id === id) return doc;
    if (doc.children && doc.children.length > 0) {
      const found = findDocById(doc.children, id);
      if (found) return found;
    }
  }
  return null;
};

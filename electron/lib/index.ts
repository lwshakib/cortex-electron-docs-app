import { ensureDir, readFile, writeFile } from 'fs-extra';
import fs from 'fs/promises';
import { homedir } from 'os';
import { v4 as uuid } from 'uuid';
import welcomeData from '../constants/welcome.json';

/**
 * The name of the hidden directory where app data is stored.
 */
export const appDirectoryName = '.cortex';

/**
 * Returns the absolute path to the root directory of the application's data.
 * The directory is located in the user's home folder.
 */
export const getRootDir = () => {
  return `${homedir()}/${appDirectoryName}`;
};

/**
 * Represents a document structure in the application.
 */
type Document = {
  id: string; // Unique identifier for the document
  documentParentId?: string; // ID of the parent document, if any
  title: string; // The display title of the document
  contentId?: string; // ID of the file containing the actual content
  children?: Document[]; // List of nested child documents
};

/**
 * Converts a flat array of documents into a hierarchical tree structure.
 * This is used for displaying nested folders/files in the sidebar.
 *
 * @param docs - Flat list of all documents from config.json
 * @returns An array of root-level documents with their children arrays populated
 */
export const buildHierarchy = (docs: Document[]): Document[] => {
  const docsMap = new Map<string, Document>();

  // Step 1: Initialize map entries with empty children arrays
  // We first map all documents by ID for quick lookup
  docs.forEach((doc) => {
    docsMap.set(doc.id, { ...doc, children: [] });
  });

  const rootDocs: Document[] = [];

  // Step 2: Link children to parents
  // We iterate through the list and push each document to its parent's children array
  docs.forEach((doc) => {
    if (doc.documentParentId) {
      const parent = docsMap.get(doc.documentParentId);
      const child = docsMap.get(doc.id);
      if (parent && child) {
        parent.children!.push(child);
      }
    } else {
      rootDocs.push(docsMap.get(doc.id)!);
    }
  });
  return rootDocs;
};

/**
 * Entry point for loading all documents. Ensures root directory exists,
 * checks for config validity, and initiates the hierarchy building.
 */
export const loadDocs = async (): Promise<Document[]> => {
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  const checkConfig = await isConfigAvailable();
  if (checkConfig) {
    // find a file config.json which acts as the database of document metadata
    const configPath = `${rootDir}/config.json`;
    const config = await readFile(configPath, 'utf-8');
    const configJson = JSON.parse(config);

    const docs = buildHierarchy(configJson);
    return docs;
  } else {
    // If no config exists, create the initial environment
    return await createConfigAndWelcomeFile();
  }
};

/**
 * Verifies if the configuration file (config.json) exists in the app root.
 */
export const isConfigAvailable = async () => {
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  const configPath = `${rootDir}/config.json`;

  try {
    // Check if config.json file exists and is accessible
    const configExists = await fs
      .access(configPath)
      .then(() => true)
      .catch(() => false);
    return configExists;
  } catch (error) {
    return false;
  }
};

/**
 * Initializes the app directory with a default configuration and a welcome note.
 */
export const createConfigAndWelcomeFile = async (): Promise<Document[]> => {
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  // Create the initial metadata file (database)
  const configPath = `${rootDir}/config.json`;
  await writeFile(
    configPath,
    JSON.stringify([
      {
        id: 'welcome',
        title: 'Welcome',
        content: 'Welcome to Cortex Docs',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]),
  );

  // Create the actual content file for the welcome document
  const welcomePath = `${rootDir}/welcome.json`;
  console.log('Creating welcome file at:', welcomePath);

  try {
    await writeFile(welcomePath, JSON.stringify(welcomeData, null, 2));
    console.log('Successfully created welcome.json file');
  } catch (error) {
    console.error('Error creating welcome.json:', error);
  }

  // Load the newly created documents
  const configJson: Document[] = await loadDocs();

  return configJson;
};

/**
 * Creates a new document, either at the root level or nested inside a parent.
 */
export const createDoc = async (args: {
  documentParentId?: string;
  title?: string;
}) => {
  const { documentParentId, title = 'New note' } = args;
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  let newDoc;

  // Generate unique IDs and timestamps for the new doc
  if (documentParentId) {
    newDoc = {
      id: uuid(),
      title: title,
      documentParentId: documentParentId,
      contentId: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } else {
    newDoc = {
      id: uuid(),
      title: title,
      contentId: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Read existing metadata from config.json
  const configPath = `${rootDir}/config.json`;
  const existingConfig = await readFile(configPath, 'utf-8');
  const configJson = JSON.parse(existingConfig);

  // append the new document metadata and save
  configJson.push(newDoc);
  await writeFile(configPath, JSON.stringify(configJson, null, 2));

  // Create the actual content file (using the same ID as metadata)
  // Initializes with a default empty blocknote paragraph
  const docFilePath = `${rootDir}/${newDoc.id}.json`;

  await writeFile(
    docFilePath,
    JSON.stringify(
      [
        {
          type: 'paragraph',
          content: '',
        },
      ],
      null,
      2,
    ),
  );

  return newDoc;
};

/**
 * Deletes a document and all of its recursively nested children.
 * Both the metadata (in config.json) and physical content files are removed.
 */
export const deleteDoc = async (args: { id: string }) => {
  const { id } = args;
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  try {
    // Read the database metadata
    const configPath = `${rootDir}/config.json`;
    const existingConfig = await readFile(configPath, 'utf-8');
    const configJson = JSON.parse(existingConfig);

    // Identify all children that need to be deleted as part of a folder deletion
    const documentsToDelete = getAllChildIds(configJson, id);
    documentsToDelete.push(id); // Include the requested document itself

    // Filter out the deleted IDs from the metadata and save back to config.json
    const updatedConfig = configJson.filter(
      (doc: Document) => !documentsToDelete.includes(doc.id),
    );
    await writeFile(configPath, JSON.stringify(updatedConfig, null, 2));

    // Delete the physical content files (.json) for each ID
    for (const docId of documentsToDelete) {
      const docFilePath = `${rootDir}/${docId}.json`;
      try {
        await fs.unlink(docFilePath);
        console.log(`Deleted document file: ${docId}.json`);
      } catch (error) {
        // File might not exist (e.g., deleted manually), which is fine
        console.log(`Document file ${docId}.json not found, skipping deletion`);
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
};

// Helper function to get all child document IDs recursively
const getAllChildIds = (docs: Document[], parentId: string): string[] => {
  const childIds: string[] = [];

  const findChildren = (docId: string) => {
    const children = docs.filter((doc) => doc.documentParentId === docId);
    children.forEach((child) => {
      childIds.push(child.id);
      findChildren(child.id); // Recursively find children of children
    });
  };

  findChildren(parentId);
  return childIds;
};

/**
 * Updates an existing document's metadata (like title or parent).
 */
export const updateDoc = async (args: {
  id: string;
  updates: Partial<Document>;
}) => {
  const { id, updates } = args;
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  try {
    // Modify metadata in database
    const configPath = `${rootDir}/config.json`;
    const existingConfig = await readFile(configPath, 'utf-8');
    const configJson = JSON.parse(existingConfig);

    // Find document by ID and merge the new updates
    const docIndex = configJson.findIndex((doc: Document) => doc.id === id);
    if (docIndex !== -1) {
      configJson[docIndex] = {
        ...configJson[docIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await writeFile(configPath, JSON.stringify(configJson, null, 2));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error updating document:', error);
    return false;
  }
};

/**
 * Reads and returns the content of a specific document file (.json).
 */
export const getFileContent = async (args: { docId: string }) => {
  const rootDir = getRootDir();
  await ensureDir(rootDir);
  const { docId } = args;
  const filePath = `${rootDir}/${docId}.json`;
  const fileContent = await readFile(filePath, 'utf-8');
  const fileJson = JSON.parse(fileContent);
  return fileJson;
};

/**
 * Overwrites the content file of a document with new editor data.
 */
export const saveFileContent = async (args: {
  docId: string;
  content: unknown;
}) => {
  const rootDir = getRootDir();
  await ensureDir(rootDir);
  const { docId, content } = args;
  const filePath = `${rootDir}/${docId}.json`;

  try {
    await writeFile(filePath, JSON.stringify(content, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving file content:', error);
    throw new Error('Failed to save file content');
  }
};

/**
 * Searches through document titles and contents for a specific query.
 * Titles are prioritized in results.
 *
 * @returns A filtered list of document metadata objects.
 */
export const searchDocuments = async (args: { query: string }) => {
  const { query } = args;
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  try {
    // Read config.json to get all document metadata
    const configPath = `${rootDir}/config.json`;
    const existingConfig = await readFile(configPath, 'utf-8');
    const configJson = JSON.parse(existingConfig);

    const results: (Document & { matchType: 'title' | 'content' })[] = [];
    const queryLower = query.toLowerCase();

    // Loop through all documents to find matches
    for (const doc of configJson) {
      // Priority 1: Check document title
      if (doc.title.toLowerCase().includes(queryLower)) {
        results.push({ ...doc, matchType: 'title' });
        continue; // Skip content search if title already matched
      }

      // Priority 2: Full-text search in content (.json file)
      if (doc.contentId) {
        try {
          const contentPath = `${rootDir}/${doc.id}.json`;
          const content = await readFile(contentPath, 'utf-8');
          const contentJson = JSON.parse(content);

          // Convert content blocks to string for keyword searching
          const contentString = JSON.stringify(contentJson).toLowerCase();
          if (contentString.includes(queryLower)) {
            results.push({ ...doc, matchType: 'content' });
          }
        } catch (error) {
          // Content file might not exist or be unreadable
          console.log(
            `Content file for ${doc.id} not found, skipping content search`,
          );
        }
      }
    }

    // Sort results: title matches appear before content matches
    results.sort((a, b) => {
      if (a.matchType === 'title' && b.matchType === 'content') return -1;
      if (a.matchType === 'content' && b.matchType === 'title') return 1;
      return a.title.localeCompare(b.title);
    });

    // Cleanup: remove temporary matchType field from final output
    return results.map((result) => {
      const doc = { ...result };
      delete (doc as Document & { matchType?: string }).matchType;
      return doc;
    });
  } catch (error) {
    console.error('Error searching documents:', error);
    return [];
  }
};

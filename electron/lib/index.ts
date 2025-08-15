import { ensureDir, readFile, writeFile } from "fs-extra";
import fs from "fs/promises";
import { homedir } from "os";
import path from "path";
import { v4 as uuid } from "uuid";

export const appDirectoryName = ".cortex";
export const getRootDir = () => {
  return `${homedir()}/${appDirectoryName}`;
};

type Document = {
  id: string;
  documentParentId?: string;
  title: string;
  contentId?: string;
  children?: Document[];
};

export const buildHierarchy = (docs: Document[]): Document[] => {
  const docsMap = new Map<string, Document>();

  // Step 1: Initialize map entries with empty children arrays
  docs.forEach((doc) => {
    docsMap.set(doc.id, { ...doc, children: [] });
  });

  const rootDocs: Document[] = [];

  // Step 2: Link children to parents
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

export const loadDocs = async (): Promise<Document[]> => {
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  const checkConfig = await isConfigAvailable();
  if (checkConfig) {
    // find a file config.json
    const configPath = `${rootDir}/config.json`;
    const config = await readFile(configPath, "utf-8");
    const configJson = JSON.parse(config);

    const docs = buildHierarchy(configJson);
    return docs;
  } else {
    return await createConfigAndWelcomeFile();
  }
};

export const isConfigAvailable = async () => {
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  // find a file config.json
  const configPath = `${rootDir}/config.json`;

  try {
    // Check if config.json file exists
    const configExists = await fs
      .access(configPath)
      .then(() => true)
      .catch(() => false);
    return configExists;
  } catch (error) {
    return false;
  }
};

export const createConfigAndWelcomeFile = async (): Promise<Document[]> => {
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  // create a file config.json
  const configPath = `${rootDir}/config.json`;
  await writeFile(
    configPath,
    JSON.stringify([
      {
        id: "welcome",
        title: "Welcome",
        content: "Welcome to Cortex Docs",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  );

  // create a file welcome.json with the welcome content
  const welcomePath = `${rootDir}/welcome.json`;
  const constantsPath = path.join(
    process.env.APP_ROOT || process.cwd(),
    "lib",
    "constants",
    "welcome.json"
  );

  console.log("Creating welcome file at:", welcomePath);
  console.log("Reading from constants path:", constantsPath);

  try {
    const welcomeContent = await fs.readFile(constantsPath, "utf-8");
    await writeFile(welcomePath, welcomeContent);
    console.log("Successfully created welcome.json file");
  } catch (error) {
    console.error("Error creating welcome.json:", error);
    // Fallback: create a simple welcome content
    const fallbackContent = JSON.stringify([
      {
        type: "paragraph",
        content: "Welcome to Cortex Docs!",
      },
    ]);
    await writeFile(welcomePath, fallbackContent);
    console.log("Created welcome.json with fallback content");
  }

  const configJson: Document[] = await loadDocs();

  return configJson;
};

export const createDoc = async (args: {
  documentParentId?: string;
  title?: string;
}) => {
  const { documentParentId, title = "New note" } = args;
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  let newDoc;

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

  // Read existing config.json
  const configPath = `${rootDir}/config.json`;
  const existingConfig = await readFile(configPath, "utf-8");
  const configJson = JSON.parse(existingConfig);

  // Add new document to config.json
  configJson.push(newDoc);
  await writeFile(configPath, JSON.stringify(configJson, null, 2));

  // Create new document file
  const docFilePath = `${rootDir}/${newDoc.id}.json`;

  await writeFile(
    docFilePath,
    JSON.stringify(
      [
        {
          type: "paragraph",
          content: "",
        },
      ],
      null,
      2
    )
  );

  return newDoc;
};

export const deleteDoc = async (args: { id: string }) => {
  const { id } = args;
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  try {
    // Read existing config.json
    const configPath = `${rootDir}/config.json`;
    const existingConfig = await readFile(configPath, "utf-8");
    const configJson = JSON.parse(existingConfig);

    // Get all documents to delete (including children)
    const documentsToDelete = getAllChildIds(configJson, id);
    documentsToDelete.push(id); // Add the parent document itself

    // Remove all documents from config.json
    const updatedConfig = configJson.filter(
      (doc: Document) => !documentsToDelete.includes(doc.id)
    );
    await writeFile(configPath, JSON.stringify(updatedConfig, null, 2));

    // Delete all document files
    for (const docId of documentsToDelete) {
      const docFilePath = `${rootDir}/${docId}.json`;
      try {
        await fs.unlink(docFilePath);
        console.log(`Deleted document file: ${docId}.json`);
      } catch (error) {
        // File might not exist, which is fine
        console.log(`Document file ${docId}.json not found, skipping deletion`);
      }
    }

    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
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

export const updateDoc = async (args: {
  id: string;
  updates: Partial<Document>;
}) => {
  const { id, updates } = args;
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  try {
    // Read existing config.json
    const configPath = `${rootDir}/config.json`;
    const existingConfig = await readFile(configPath, "utf-8");
    const configJson = JSON.parse(existingConfig);

    // Find and update the document
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
    console.error("Error updating document:", error);
    return false;
  }
};

export const getFileContent = async (args: { docId: string }) => {
  const rootDir = getRootDir();
  await ensureDir(rootDir);
  const { docId } = args;
  const filePath = `${rootDir}/${docId}.json`;
  const fileContent = await readFile(filePath, "utf-8");
  const fileJson = JSON.parse(fileContent);
  return fileJson;
};

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
    console.error("Error saving file content:", error);
    throw new Error("Failed to save file content");
  }
};

export const searchDocuments = async (args: { query: string }) => {
  const { query } = args;
  const rootDir = getRootDir();
  await ensureDir(rootDir);

  try {
    // Read config.json to get all documents
    const configPath = `${rootDir}/config.json`;
    const existingConfig = await readFile(configPath, "utf-8");
    const configJson = JSON.parse(existingConfig);

    const results: (Document & { matchType: "title" | "content" })[] = [];
    const queryLower = query.toLowerCase();

    // Search through all documents
    for (const doc of configJson) {
      // Search in title first (higher priority)
      if (doc.title.toLowerCase().includes(queryLower)) {
        results.push({ ...doc, matchType: "title" });
        continue;
      }

      // Search in content if contentId exists
      if (doc.contentId) {
        try {
          const contentPath = `${rootDir}/${doc.id}.json`;
          const content = await readFile(contentPath, "utf-8");
          const contentJson = JSON.parse(content);

          // Search in content (assuming content is an array of blocks)
          const contentString = JSON.stringify(contentJson).toLowerCase();
          if (contentString.includes(queryLower)) {
            results.push({ ...doc, matchType: "content" });
          }
        } catch (error) {
          // Content file might not exist, skip
          console.log(
            `Content file for ${doc.id} not found, skipping content search`
          );
        }
      }
    }

    // Sort results: title matches first, then by title alphabetically
    results.sort((a, b) => {
      if (a.matchType === "title" && b.matchType === "content") return -1;
      if (a.matchType === "content" && b.matchType === "title") return 1;
      return a.title.localeCompare(b.title);
    });

    // Remove matchType from final results
    return results.map((result) => {
      const doc = { ...result };
      delete (doc as Document & { matchType?: string }).matchType;
      return doc;
    });
  } catch (error) {
    console.error("Error searching documents:", error);
    return [];
  }
};

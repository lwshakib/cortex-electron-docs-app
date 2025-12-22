"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocumentContext } from "@/hooks/use-document-context";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useCallback, useEffect, useState } from "react";
import ActionBar from "./action-bar";

interface Note {
  title?: string;
}

function ContentEditor({ note }: { note?: Note }) {
  const [title, setTitle] = useState(note?.title || "");
  const { selectedDoc, selectedDocFileContent, updateDocument } =
    useDocumentContext();

  const editor = useCreateBlockNote({
    initialContent:
      selectedDocFileContent && Array.isArray(selectedDocFileContent)
        ? selectedDocFileContent
        : [
            {
              type: "paragraph",
              content: "",
            },
          ],
  });

  // Update title when selectedDoc changes
  useEffect(() => {
    if (selectedDoc?.title) {
      setTitle(selectedDoc.title);
    }
  }, [selectedDoc?.title]);

  // Update editor content when selectedDocFileContent changes
  useEffect(() => {
    if (selectedDocFileContent && Array.isArray(selectedDocFileContent)) {
      // Only update if the content is different to avoid infinite loops
      const currentContent = JSON.stringify(editor.document);
      const newContent = JSON.stringify(selectedDocFileContent);
      if (currentContent !== newContent) {
        editor.replaceBlocks(editor.document, selectedDocFileContent);
      }
    }
  }, [selectedDocFileContent, editor]);

  // Save editor content when it changes
  const saveEditorContent = useCallback(
    async (content: unknown[]) => {
      if (selectedDoc?.id && content && Array.isArray(content)) {
        try {
          // Save content to file system via IPC
          await window.ipcRenderer.invoke("save-file-content", {
            docId: selectedDoc.id,
            content: content,
          });
        } catch (error) {
          console.error("Failed to save editor content:", error);
        }
      }
    },
    [selectedDoc?.id]
  );

  // Debounced save function for editor content
  const debouncedSaveContent = useCallback(
    (content: unknown[]) => {
      const timeoutId = setTimeout(() => {
        saveEditorContent(content);
      }, 1000); // 1 second delay for content saves

      return () => clearTimeout(timeoutId);
    },
    [saveEditorContent]
  );

  // Debounced function to update document title
  const debouncedUpdateTitle = useCallback(
    (newTitle: string) => {
      if (selectedDoc?.id && newTitle !== selectedDoc.title) {
        updateDocument(selectedDoc.id, { title: newTitle });
      }
    },
    [selectedDoc?.id, selectedDoc?.title, updateDocument]
  );

  // Debounce title updates
  useEffect(() => {
    if (title && selectedDoc?.id) {
      const timeoutId = setTimeout(() => {
        debouncedUpdateTitle(title);
      }, 500); // 500ms delay

      return () => clearTimeout(timeoutId);
    }
  }, [title, selectedDoc?.id, debouncedUpdateTitle]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      editor.focus();
      // Update title immediately on Enter
      if (selectedDoc?.id && title !== selectedDoc.title) {
        updateDocument(selectedDoc.id, { title });
      }
    }
  };

  useEditorChange(async (editor) => {
    console.log(editor.document);
    // Save editor content when it changes
    if (editor.document && Array.isArray(editor.document)) {
      debouncedSaveContent(editor.document);
    }
  }, editor);

  const handleSelectionChange = () => {
    // setSelText(editor.getSelectedText() ?? "");
  };

  return (
    <div className="max-h-screen h-screen ">
      <header className="h-[50px] drag-css">
        <ActionBar />

      </header>
      <ScrollArea className="h-[calc(100vh-50px)]">
        {selectedDoc ? (
          <>
            <div className="ml-10">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                onKeyDown={handleTitleKeyDown}
                className="w-full px-3 py-2 bg-transparent focus:outline-none dark:text-white font-bold text-2xl"
                placeholder="Note title..."
              />
            </div>
            <BlockNoteView
              editor={editor}
              theme="dark"
              className="bg-transparent bn-small-text"
              onSelectionChange={handleSelectionChange}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 py-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold text-white mb-4">Cortex</h1>
              <p className="text-xl text-gray-300 mb-8">
                A document Create, Update, Delete platform
              </p>

              <div className="text-left text-gray-400 space-y-4">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Welcome to Cortex
                </h2>

                <p>
                  Cortex is your intelligent document management platform
                  designed to help you organize, create, and manage your notes
                  with ease. Whether you're a student, professional, or creative
                  thinker, Cortex provides the tools you need to capture and
                  organize your ideas.
                </p>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                  Key Features
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Create and organize documents in a hierarchical structure
                  </li>
                  <li>Rich text editing with BlockNote</li>
                  <li>Automatic saving and real-time updates</li>
                  <li>Search and find documents quickly</li>
                  <li>Clean, distraction-free writing environment</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                  Getting Started
                </h3>
                <p>
                  To begin using Cortex, select a document from the sidebar or
                  create a new one. You can organize your documents in folders
                  and subfolders, making it easy to maintain a structured
                  knowledge base.
                </p>

                <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-300">
                    <strong>Tip:</strong> Use the sidebar to navigate between
                    documents. Click the plus icon to create new documents or
                    folders. Right-click on documents for additional options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default ContentEditor;

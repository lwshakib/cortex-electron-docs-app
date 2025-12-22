import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlockNoteEditor } from "@blocknote/core";

import { Download, FileCode, FileText, FileType, Mail } from "lucide-react";
import { toast } from "sonner";

interface ExportDropdownProps {
  documentTitle: string;
  editor: BlockNoteEditor;
}

export default function ExportDropdown({
  documentTitle,
  editor,
}: ExportDropdownProps) {
  const handleExport = async (
    format: "pdf" | "docx" | "markdown" | "email" | "html"
  ) => {
    try {
      const contentHtml = await editor.blocksToFullHTML(editor.document);
      // add the title on the html
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentTitle}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    </style>
</head>
<body>
    <h1>${documentTitle}</h1>
    ${contentHtml}
</body>
</html>`;

      const loadingToast = toast.loading(
        `Exporting as ${format.toUpperCase()}...`
      );

      // Call the export function via IPC
      const result = await window.ipcRenderer.invoke("export-document", {
        format,
        html,
        title: documentTitle
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(
          `Document exported successfully! Check your Documents/Cortex Exports folder.`
        );
      } else {
        toast.error(`Failed to export document as ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error(`Export error (${format}):`, error);
      toast.error(`Failed to export document as ${format.toUpperCase()}`);
    }
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="h-8 w-8 p-0 hover:bg-accent rounded-full transition-colors flex items-center justify-center bg-primary text-primary-foreground"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Export button clicked");
            }}
          >
            <Download className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 z-[9999]"
          sideOffset={5}
        >
          <DropdownMenuItem onClick={() => handleExport("pdf")}>
            <FileText className="mr-2 h-4 w-4" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("docx")}>
            <FileType className="mr-2 h-4 w-4" />
            Export as DOCX
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("markdown")}>
            <FileCode className="mr-2 h-4 w-4" />
            Export as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("email")}>
            <Mail className="mr-2 h-4 w-4" />
            Export as Email Template
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("html")}>
            <FileCode className="mr-2 h-4 w-4" />
            Export as HTML
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

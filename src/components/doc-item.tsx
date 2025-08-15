import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDocumentContext } from "@/hooks/use-document-context";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, LucideIcon, Plus, Trash2 } from "lucide-react";

type DocItemProps = {
  id?: string;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
};

export default function DocItem({
  label,
  onClick,
  icon: Icon,
  onExpand,
  active,
  expanded,
  isSearch,
  level = 0,
  documentIcon,
  id,
}: DocItemProps) {
  const ChevronIcon = expanded ? ChevronUp : ChevronDown;
  const { documents, createDocument, deleteDocument } = useDocumentContext();

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpand?.();
  };

  const handleCreate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id || !documents) return;

    try {
      await createDocument(id);
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      const success = await deleteDocument(id);
      if (success) {
        console.log("Document deleted successfully");
      } else {
        console.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : "12px",
      }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium cursor-pointer",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          onClick={handleExpand}
          role="button"
          className="h-full rounded-sm mr-1"
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px] ">{documentIcon}</div>
      ) : Icon ? (
        <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      ) : null}
      <span className="truncate">{label}</span>

      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>k
        </kbd>
      )}

      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 h-full rounded-sm cursor-pointer p-1"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Document</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{label}"? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div
            onClick={handleCreate}
            className="opacity-0 group-hover:opacity-100 h-full rounded-sm cursor-pointer p-1"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}

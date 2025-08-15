import { Button } from "@/components/ui/button";
import { Minus, Square, X } from "lucide-react";

export default function ActionBar() {
    function handleActions (channel: string){
        switch (channel) {
            case "minimize":
                window.ipcRenderer.send("win:minimize");
                break;
            case "maximize":
                window.ipcRenderer.send("win:maximize");
                break;
            case "close":
                window.ipcRenderer.send("win:close");
                break;
            default:
                break;
        }
    }
    return (
        <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-muted/50 rounded-full transition-colors no-drag-css"
          onClick={() => {
            handleActions("minimize")
          }}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-muted/50 rounded-full transition-colors no-drag-css"
          onClick={() => {
            handleActions("maximize")
          }}
                >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-colors no-drag-css"
          onClick={() => {
            handleActions("close")
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
}
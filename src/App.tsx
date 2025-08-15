import DocumentContent from "./components/document-content";
import DocumentSidebar from "./components/document-sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";

function App() {
  return (
    <div className="min-h-screen bg-background/90 backdrop-blur-md relative">
      <ResizablePanelGroup direction="horizontal" className="h-screen">
        <ResizablePanel
          defaultSize={25}
          minSize={20}
          maxSize={40}
          className="h-full"
        >
          <DocumentSidebar />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={75} minSize={30} className="h-full">
          <DocumentContent />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;

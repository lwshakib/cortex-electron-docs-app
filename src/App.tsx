import DocumentContent from './components/document-content';
import DocumentSidebar from './components/document-sidebar';
import Updater from './components/updater';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './components/ui/resizable';

/**
 * The root App component.
 * Implements a resizable dashboard layout with a sidebar and a content area.
 */
function App() {
  return (
    <div className='min-h-screen bg-background/90 backdrop-blur-md relative'>
      {/* Handles background update checks and UI notifications */}
      <Updater />

      {/* Main split-screen layout */}
      <ResizablePanelGroup direction='horizontal' className='h-screen'>
        {/* Left Sidebar: Document navigation and search */}
        <ResizablePanel
          defaultSize={25}
          minSize={20}
          maxSize={60}
          className='h-full'
        >
          <DocumentSidebar />
        </ResizablePanel>

        {/* Draggable handle for resizing panels */}
        <ResizableHandle withHandle />

        {/* Right Content Area: Text editor and title bar */}
        <ResizablePanel
          defaultSize={75}
          minSize={40}
          maxSize={80}
          className='h-full'
        >
          <DocumentContent />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;

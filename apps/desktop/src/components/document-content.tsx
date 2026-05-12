import ContentEditor from './content-editor';

/**
 * Container component for the document content area.
 */
export default function DocumentContent() {
  return (
    <div className='w-full h-full flex flex-col'>
      {/* Renders the BlockNote editor or welcome screen */}
      <ContentEditor />
    </div>
  );
}

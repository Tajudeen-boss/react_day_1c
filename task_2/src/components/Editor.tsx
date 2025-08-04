import React from 'react';
import { FileTree } from './FileTree';
import { CodeEditor } from './CodeEditor';
import { EditorTabs } from './EditorTabs';
import { EditorNavBar } from './EditorNavBar';
import { Breadcrumb } from './Breadcrumb';

export function Editor() {
  const [files, setFiles] = React.useState({
    '/src/App.tsx': `import React from 'react';
import { Prompt } from './components/Prompt';
import { Chat } from './components/Chat';
import { Editor } from './components/Editor';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b">
        <div className="text-xl font-bold text-blue-500">bolt.new</div>
      </header>
      <Prompt />
      <main className="flex-1 grid grid-cols-2 gap-4 p-4">
        <Chat />
        <Editor />
      </main>
    </div>
  );
}

export default App;`,

    '/src/components/Chat.tsx': `export function Chat() { return <div>Chat</div>; }`,
    '/src/components/Editor.tsx': `export function Editor() { return <div>Editor</div>; }`,
    '/src/components/Prompt.tsx': `export function Prompt() { return <div>Prompt</div>; }`,
  });

  const [currentFile, setCurrentFile] = React.useState('/src/App.tsx');
  const [code, setCode] = React.useState(files['/src/App.tsx']);

  const handleFileSelect = (path: string) => {
    // Save current file content before switching
    setFiles(prev => ({
      ...prev,
      [currentFile]: code
    }));

    setCurrentFile(path);
    setCode(files[path] ?? '');
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    // Auto-save changes to the files object
    setFiles(prev => ({
      ...prev,
      [currentFile]: newCode
    }));
  };

  return (
    <>
      <EditorTabs />
      <EditorNavBar />
      <div className="h-full flex bg-[#1E1E1E]">
        <FileTree onFileSelect={handleFileSelect} />
        <div className="flex-1 flex flex-col">
          <Breadcrumb path={currentFile} />
          <CodeEditor value={code} onChange={handleCodeChange} />
        </div>
      </div>
    </>
  );
}

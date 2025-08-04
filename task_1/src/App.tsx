import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './components/Sidebar';
import { FlowProvider } from './store/FlowContext';

function App() {
  return (
    <FlowProvider>
      <div className="w-full h-screen">
        <ReactFlowProvider>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 bg-white" />
          </div>
        </ReactFlowProvider>
      </div>
    </FlowProvider>
  );
}

export default App;

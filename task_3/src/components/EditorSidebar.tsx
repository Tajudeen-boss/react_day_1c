import React from 'react';
import { DraggableField } from './DraggableField';
import { useDocumentStore } from '../store/documentStore';
import type { DocumentField } from '../types';

export const EditorSidebar: React.FC = () => {
  const { currentDocument } = useDocumentStore();
  const fieldTypes: DocumentField['type'][] = [
    'signature',
    'text',
    'date',
    'checkbox',
    'initial',
  ];

  const totalFields = currentDocument?.fields.length || 0;

  return (
    <div className="w-64 bg-white p-4 border-r">
      <h3 className="text-lg font-semibold mb-2">Form Fields</h3>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
        <p className="text-blue-800 font-medium mb-1">Instructions:</p>
        <p className="text-blue-700">Drag fields from below onto the PDF to add them to your document.</p>
        <p className="text-blue-600 mt-2">Total fields: {totalFields}</p>
      </div>

      <div className="space-y-2">
        {fieldTypes.map((type) => (
          <DraggableField key={type} type={type} />
        ))}
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, GripHorizontal } from 'lucide-react';
import { useDocumentStore } from '../store/documentStore';
import { ProgressBar } from '../components/ProgressBar';
import { PDFViewer } from '../components/PDFViewer';
import { EditorSidebar } from '../components/EditorSidebar';
import type { DocumentField } from '../types';

const FIELD_DEFAULT_SIZES = {
  signature: { width: 200, height: 50 },
  text: { width: 200, height: 40 },
  date: { width: 150, height: 40 },
  checkbox: { width: 30, height: 30 },
  initial: { width: 100, height: 50 },
};

export const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentDocument, addField } = useDocumentStore();
  const [selectedField, setSelectedField] = useState<DocumentField | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!currentDocument || !pdfWrapperRef.current || !pdfSize.width || !pdfSize.height) return;

    const type = e.dataTransfer.getData('fieldType') as DocumentField['type'];
    if (!type) return;

    const rect = pdfWrapperRef.current.getBoundingClientRect();

    const absX = e.clientX - rect.left;
    const absY = e.clientY - rect.top;

    const xPercent = (absX / pdfSize.width) * 100;
    const yPercent = (absY / pdfSize.height) * 100;

    // Ensure there's at least a default recipient
    let recipientId = 'default';
    if (currentDocument.recipients.length > 0) {
      recipientId = currentDocument.recipients[0].id;
    }

    const newField: DocumentField = {
      id: crypto.randomUUID(),
      type,
      recipientId,
      position: {
        x: Math.max(0, Math.min(xPercent, 100)),
        y: Math.max(0, Math.min(yPercent, 100)),
      },
      size: FIELD_DEFAULT_SIZES[type],
      required: true,
      page: currentPage,
    };

    console.log('Adding field:', newField);
    addField(currentDocument.id, newField);
    setSelectedField(newField);
  };



  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSave = () => {
    navigate('/summary');
  };

  if (!currentDocument) {
    navigate('/upload');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-4">
        <ProgressBar />
      </div>

      <div className="flex flex-1">
        <EditorSidebar />

        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Document Editor</h2>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>

          <div
            ref={containerRef}
            className="bg-gray-100 rounded-lg p-4 flex justify-center relative overflow-auto min-h-[600px]"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="relative" ref={pdfWrapperRef}>
              {currentDocument.file && (
                <PDFViewer
                  file={currentDocument.file}
                  pageNumber={currentPage}
                  onPageChange={setCurrentPage}
                  onLoadSuccess={setTotalPages}
                  onSize={setPdfSize}
                />
              )}

              {currentDocument.fields
                .filter((field) => field.page === currentPage)
                .map((field) => (
                  <div
                    key={field.id}
                    style={{
                      position: 'absolute',
                      left: `${(field.position.x / 100) * pdfSize.width}px`,
                      top: `${(field.position.y / 100) * pdfSize.height}px`,
                      width: `${field.size.width}px`,
                      height: `${field.size.height}px`,
                    }}
                    className="border-2 border-blue-500 bg-white/80 rounded-md shadow-sm overflow-hidden"
                  >
                    <div className="text-xs bg-blue-500 text-white px-2 py-1 flex items-center justify-between">
                      <span className="capitalize">{field.type}</span>
                      <GripHorizontal className="w-3 h-3 cursor-move" />
                    </div>

                    <div className="p-1">
                      {field.type === 'text' && (
                        <input
                          type="text"
                          placeholder="Text"
                          className="w-full h-full text-sm border-none outline-none bg-transparent"
                        />
                      )}
                      {field.type === 'date' && (
                        <input
                          type="date"
                          className="w-full h-full text-sm border-none outline-none bg-transparent"
                        />
                      )}
                      {field.type === 'checkbox' && (
                        <input
                          type="checkbox"
                          className="w-full h-full"
                        />
                      )}
                      {field.type === 'signature' && (
                        <div className="w-full h-full text-xs italic text-gray-400 flex items-center justify-center">
                          Sign here
                        </div>
                      )}
                      {field.type === 'initial' && (
                        <input
                          type="text"
                          maxLength={2}
                          placeholder="AB"
                          className="w-full h-full text-sm text-center border-none outline-none bg-transparent"
                        />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

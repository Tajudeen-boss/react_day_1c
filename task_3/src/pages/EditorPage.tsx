import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, GripHorizontal, Trash2 } from 'lucide-react';
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
  const { currentDocument, addField, updateField, removeField } = useDocumentStore();
  const [selectedField, setSelectedField] = useState<DocumentField | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });
  const [isDragOver, setIsDragOver] = useState(false);

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
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFieldClick = (field: DocumentField) => {
    setSelectedField(field);
  };

  const handleDeleteField = (fieldId: string) => {
    if (currentDocument) {
      removeField(currentDocument.id, fieldId);
      setSelectedField(null);
    }
  };

  // Add keyboard support for deleting selected fields
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedField) {
        e.preventDefault();
        handleDeleteField(selectedField.id);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedField]);

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
            <div>
              <h2 className="text-2xl font-semibold">Document Editor</h2>
              {selectedField && (
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md mr-2">
                    {selectedField.type} field selected
                  </span>
                  <span className="text-gray-500">Press Delete or Backspace to remove</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedField && (
                <button
                  onClick={() => handleDeleteField(selectedField.id)}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete Field
                </button>
              )}
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            className={`bg-gray-100 rounded-lg p-4 flex justify-center relative overflow-auto min-h-[600px] transition-colors ${
              isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="relative" ref={pdfWrapperRef}>
              {currentDocument.file && (
                <PDFViewer
                  file={currentDocument.file}
                  pageNumber={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  onLoadSuccess={setTotalPages}
                  onSize={setPdfSize}
                />
              )}

              {isDragOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-100/50 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none">
                  <div className="text-blue-600 text-center">
                    <p className="text-lg font-semibold">Drop field here</p>
                    <p className="text-sm">Position the field where you want it on the document</p>
                  </div>
                </div>
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
                    className={`border-2 rounded-md shadow-sm overflow-hidden cursor-pointer transition-colors ${
                      selectedField?.id === field.id
                        ? 'border-red-500 bg-red-50/80'
                        : 'border-blue-500 bg-white/80 hover:bg-blue-50/80'
                    }`}
                    onClick={() => handleFieldClick(field)}
                  >
                    <div className={`text-xs px-2 py-1 flex items-center justify-between ${
                      selectedField?.id === field.id
                        ? 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}>
                      <span className="capitalize">{field.type}</span>
                      <div className="flex items-center gap-1">
                        {selectedField?.id === field.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteField(field.id);
                            }}
                            className="text-white hover:text-red-200 text-xs"
                          >
                            ×
                          </button>
                        )}
                        <GripHorizontal className="w-3 h-3 cursor-move" />
                      </div>
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

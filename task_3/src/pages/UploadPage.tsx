import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useDocumentStore } from '../store/documentStore';
import { ProgressBar } from '../components/ProgressBar';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { addDocument, setCurrentDocument, currentDocument } = useDocumentStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const newDocument = {
        id: crypto.randomUUID(),
        name: file.name,
        uploadDate: new Date(),
        status: 'draft' as const,
        recipients: [],
        fields: [],
        file,
      };
      addDocument(newDocument);
      setCurrentDocument(newDocument);
    }
  }, [addDocument, setCurrentDocument]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressBar />
      <div className="max-w-2xl mx-auto">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-xl mb-2">
            {isDragActive
              ? 'Drop your PDF here'
              : 'Drag and drop your PDF here, or click to select'}
          </p>
          <p className="text-sm text-gray-500">Supported format: PDF</p>
        </div>

        {currentDocument?.file && (
          <div className="mt-6 border-2 border-green-200 rounded-lg bg-green-50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p className="text-sm font-medium text-green-800">File Successfully Uploaded</p>
            </div>
            <div className="bg-white rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600 mb-1">File Name:</p>
              <p className="font-medium text-gray-900">{currentDocument.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Size: {(currentDocument.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <div className="bg-white rounded-lg p-2">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <embed
                src={URL.createObjectURL(currentDocument.file)}
                type="application/pdf"
                width="100%"
                height="400px"
                className="border rounded"
              />
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/recipients')}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

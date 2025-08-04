import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs, PDFPageProxy } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File;
  onLoadSuccess?: (numPages: number) => void;
  onSize?: (size: { width: number; height: number }) => void;
  pageNumber: number;
  onPageChange?: (pageNumber: number) => void;
  scale?: number;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  onLoadSuccess,
  onSize,
  pageNumber,
  onPageChange,
  scale = 1.5,
}) => {
  const handlePageChange = (direction: 'prev' | 'next') => {
    if (onPageChange) {
      onPageChange(direction === 'next' ? pageNumber + 1 : pageNumber - 1);
    }
  };

  const handlePageRenderSuccess = useCallback((page: PDFPageProxy) => {
    const viewport = page.getViewport({ scale });
    onSize?.({ width: viewport.width, height: viewport.height });
  }, [onSize, scale]);

  return (
    <div className="pdf-viewer relative">
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => onLoadSuccess?.(numPages)}
        className="max-w-full"
      >
        <Page
          pageNumber={pageNumber}
          scale={scale}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="shadow-lg"
          onRenderSuccess={handlePageRenderSuccess}
        />
      </Document>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white rounded-lg shadow px-4 py-2">
        <button
          onClick={() => handlePageChange('prev')}
          disabled={pageNumber <= 1}
          className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {pageNumber}</span>
        <button
          onClick={() => handlePageChange('next')}
          className="text-gray-600 hover:text-gray-900"
        >
          Next
        </button>
      </div>
    </div>
  );
};

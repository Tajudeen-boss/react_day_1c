import React from 'react';
import { Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const steps = [
  { path: '/upload', label: 'Upload' },
  { path: '/recipients', label: 'Recipients' },
  { path: '/editor', label: 'Editor' },
  { path: '/summary', label: 'Summary' },
];

export const ProgressBar: React.FC = () => {
  const location = useLocation();
  const currentStepIndex = steps.findIndex(
    (step) => step.path === location.pathname
  );

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      <div className="relative flex items-center justify-between pt-4">
        {/* Progress line positioned behind circles */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0"
             style={{
               marginLeft: '2rem',
               marginRight: '2rem',
               transform: 'translateY(0.75rem)'
             }} />

        {/* Completed portion of the line */}
        <div
          className="absolute top-6 left-0 h-0.5 bg-blue-600 z-0"
          style={{
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            marginLeft: '2rem',
            marginRight: '2rem',
            transform: 'translateY(0.75rem)',
            maxWidth: 'calc(100% - 4rem)'
          }} />

        {steps.map((step, index) => (
          <div key={step.path} className="relative z-20 flex flex-col items-center bg-gray-100">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                index <= currentStepIndex
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-500 border-gray-300'
              }`}
            >
              {index < currentStepIndex ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <div className={`text-sm mt-2 font-medium ${
              index <= currentStepIndex ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

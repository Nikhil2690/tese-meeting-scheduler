import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: 1 | 2;
}

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-xs">
      {/* Container for Dots and Line */}
      <div className="flex items-center w-full">
        
        {/* Step 1 Circle */}
        <div className="relative flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-300 ${
            currentStep >= 1 ? 'bg-[#ff7350] border-[#ff7350]' : 'bg-white border-gray-300'
          }`}>
            <Check size={10} strokeWidth={4} className="text-white" />
          </div>
          {/* Label 1 */}
          <span className="absolute top-6 text-[10px] font-bold uppercase tracking-wide text-gray-400 whitespace-nowrap">
            Choose Time
          </span>
        </div>

        {/* Connector Line - No more negative margins! */}
        <div className="flex-1 h-[2px] bg-gray-200 mx-0">
          <div 
            className="h-full bg-[#ff7350] transition-all duration-500" 
            style={{ width: currentStep > 1 ? '100%' : '0%' }}
          />
        </div>

        {/* Step 2 Circle */}
        <div className="relative flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-300 ${
            currentStep >= 2 ? 'bg-[#ff7350] border-[#ff7350]' : 'bg-white border-gray-300'
          }`}>
            {currentStep >= 2 && <Check size={10} strokeWidth={4} className="text-white" />}
          </div>
          {/* Label 2 */}
          <span className={`absolute top-6 text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${
            currentStep === 2 ? 'text-gray-800' : 'text-gray-400'
          }`}>
            Your Info
          </span>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
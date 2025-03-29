
import { FileCheck, FileSearch, FileText, Edit, Upload } from "lucide-react";

// Step definitions
export const steps = [
  {
    id: "upload-rfp",
    title: "Upload RFP",
    icon: Upload,
    description: "Upload and provide basic RFP information",
  },
  {
    id: "rfp-summary",
    title: "RFP Summary",
    icon: FileSearch,
    description: "Review the AI-generated RFP summary",
  },
  {
    id: "proposal-draft",
    title: "Proposal Draft",
    icon: FileText,
    description: "Review the AI-generated proposal draft",
  },
  {
    id: "refine-proposal",
    title: "Refine Proposal",
    icon: Edit,
    description: "Edit and improve the proposal",
  },
  {
    id: "finalize",
    title: "Finalize",
    icon: FileCheck,
    description: "Review and generate the final document",
  },
];

// Progress indicator component
export const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const progressPercentage = (currentStep / (steps.length - 1)) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div 
              key={step.id} 
              className={`flex flex-col items-center ${index === 0 ? 'ml-0' : ''} ${
                index === steps.length - 1 ? 'mr-0' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isCurrent
                    ? 'bg-brand-500 text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <FileCheck className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div className="text-xs font-medium text-center max-w-[80px]">
                {step.title}
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-brand-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

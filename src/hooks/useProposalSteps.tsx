
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

// Hook to manage the steps of the proposal creation process
export const useProposalSteps = (navigate: (path: string) => void) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processingRfp, setProcessingRfp] = useState(false);
  const [draftingProposal, setDraftingProposal] = useState(false);
  
  // Navigate to the next step
  const handleNext = async (
    currentStep: number,
    processRfpDocument: () => Promise<boolean>,
    generateProposalDraft: () => Promise<boolean>,
    refineProposal: () => void,
    finalizeProposal: () => void,
    updateFormData: (updates: Record<string, any>) => void,
    formData: any
  ) => {
    if (currentStep === 0) {
      await processRfpDocument();
    } else if (currentStep === 1) {
      await generateProposalDraft();
    } else if (currentStep === 2) {
      if (formData && formData.proposalDraft) {
        // Combine all proposal draft sections
        const sections = Object.entries(formData.proposalDraft);
        if (sections.length > 0) {
          const combinedDraft = sections
            .map(([title, content]) => `## ${title.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}\n\n${content}`)
            .join("\n\n");
          
          updateFormData({ proposalEdits: combinedDraft });
        }
      } else {
        console.error("formData or proposalDraft is undefined", formData);
        updateFormData({ proposalEdits: "No proposal draft content available" });
      }
      setCurrentStep(3);
      window.scrollTo(0, 0);
    } else if (currentStep === 3) {
      refineProposal();
    } else if (currentStep === 4) {
      finalizeProposal();
    } else {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };
  
  // Navigate to the previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Save draft
  const saveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your proposal draft has been saved successfully.",
    });
  };
  
  // Finalize and generate document
  const finalizeProposal = () => {
    setLoading(true);
    
    // Simulate document generation with a delay
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: "Proposal Finalized",
        description: "Your proposal document has been generated successfully.",
      });
      
      navigate("/review-proposal/1"); // Navigate to the review page
    }, 2000);
  };

  return {
    currentStep,
    setCurrentStep,
    loading,
    setLoading,
    processingRfp,
    setProcessingRfp,
    draftingProposal,
    setDraftingProposal,
    handleNext,
    handlePrevious,
    saveDraft,
    finalizeProposal
  };
};


import { useNavigate } from "react-router-dom";
import { useProposalSteps } from "./useProposalSteps";
import { useRfpSummary } from "./useRfpSummary";
import { useProposalDraft } from "./useProposalDraft";
import { useProposalChat } from "./useProposalChat";
import { useFormData } from "./useFormData";
import { toast } from "@/hooks/use-toast";

export const useProposalForm = (navigate: (path: string) => void) => {
  // Get all the individual hooks
  const {
    currentStep,
    setCurrentStep,
    loading,
    setLoading,
    processingRfp,
    setProcessingRfp,
    draftingProposal,
    setDraftingProposal,
    handleNext: baseHandleNext,
    handlePrevious,
    saveDraft,
    finalizeProposal
  } = useProposalSteps(navigate);
  
  const {
    apiProcessing,
    editingSections,
    toggleEditSection,
    processDocument
  } = useRfpSummary();
  
  const {
    sectionStatuses,
    sectionComments,
    processRfpDocument: baseProcessRfpDocument,
    generateProposalDraft: baseGenerateProposalDraft,
    addSectionComment,
    updateSectionStatus,
    refineProposal: baseRefineProposal,
    getSectionStatusIcon
  } = useProposalDraft();
  
  const {
    chatInput,
    setChatInput,
    chatMessages,
    sendChatMessage
  } = useProposalChat();
  
  const {
    formData,
    handleChange,
    handleSelectChange,
    handleFileUpload,
    handleProposalSectionChange,
    handleProposalEditsChange,
    updateFormData
  } = useFormData();
  
  // Connect the hooks together with higher-level functions
  const processRfpDocument = async () => {
    setProcessingRfp(true);
    
    try {
      if (!formData.rfpFile) {
        throw new Error("No RFP file selected");
      }
      
      // Process the RFP document through the API
      const success = await processDocument(formData.rfpFile, updateFormData);
      
      if (success) {
        // Check if document location was set correctly
        console.log("Document location after processing:", formData.documentLocation);
        setCurrentStep(1); // Move to the summary step
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error processing RFP:", error);
      return false;
    } finally {
      setProcessingRfp(false);
    }
  };
  
  const generateProposalDraft = async () => {
    console.log("Generating proposal draft with document location:", formData.documentLocation);
    
    if (!formData.documentLocation) {
      console.error("Document location is missing");
      
      // Show error to user
      toast({
        title: "Error",
        description: "Document location is missing. Please try processing the RFP again.",
        variant: "destructive",
      });
      
      return false;
    }
    
    // Prepare the RFP summary for the API
    const summary = {
      rfpSummary: formData.rfpSummary,
      keyRequirements: formData.keyRequirements,
      evaluationCriteria: formData.evaluationCriteria,
      budget: formData.budget,
      timeline: formData.timeline,
      projectTitle: formData.projectTitle
    };
    
    return baseGenerateProposalDraft(
      formData.documentLocation,
      summary, 
      setDraftingProposal, 
      updateFormData, 
      setCurrentStep
    );
  };
  
  const refineProposal = () => baseRefineProposal(
    formData, 
    setLoading, 
    updateFormData, 
    setCurrentStep
  );
  
  const handleNext = async () => {
    if (currentStep === 0) {
      await processRfpDocument();
    } else if (currentStep === 1) {
      await generateProposalDraft();
    } else {
      await baseHandleNext(
        currentStep,
        processRfpDocument,
        generateProposalDraft,
        refineProposal,
        finalizeProposal,
        updateFormData,
        formData
      );
    }
  };
  
  // Return all the necessary functions and state
  return {
    currentStep,
    loading,
    processingRfp,
    draftingProposal,
    apiProcessing,
    editingSections,
    sectionStatuses,
    sectionComments,
    formData,
    chatInput,
    chatMessages,
    toggleEditSection,
    handleFileUpload,
    handleChange,
    handleSelectChange,
    addSectionComment,
    updateSectionStatus,
    handleProposalSectionChange,
    handleProposalEditsChange,
    setChatInput,
    sendChatMessage,
    getSectionStatusIcon,
    saveDraft,
    handleNext,
    handlePrevious,
    finalizeProposal,
    updateFormData
  };
};

export default useProposalForm;

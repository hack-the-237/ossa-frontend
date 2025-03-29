
import { useSectionManagement } from "./useSectionManagement";
import { useProposalGenerator } from "./useProposalGenerator";
import { useProposalRefiner } from "./useProposalRefiner";

/**
 * Hook to manage proposal draft generation and management
 */
export const useProposalDraft = () => {
  // Get all the individual hooks
  const {
    sectionStatuses,
    sectionComments,
    addSectionComment,
    updateSectionStatus,
    getSectionStatusIcon
  } = useSectionManagement();
  
  const {
    generateProposalDraft: baseGenerateProposalDraft
  } = useProposalGenerator();
  
  const {
    refineProposal: baseRefineProposal
  } = useProposalRefiner();
  
  /**
   * Process the RFP document (this function does nothing here, it's just a placeholder)
   */
  const processRfpDocument = async () => {
    // This functionality is handled in another hook
    return true;
  };
  
  /**
   * Generate a proposal draft based on the RFP summary
   */
  const generateProposalDraft = async (
    documentLocation: string,
    rfpSummary: any,
    setDraftingProposal: (drafting: boolean) => void, 
    updateFormData: (updates: Record<string, any>) => void, 
    setCurrentStep: (step: number) => void
  ) => {
    return baseGenerateProposalDraft(
      documentLocation,
      rfpSummary,
      setDraftingProposal,
      updateFormData,
      setCurrentStep,
      updateSectionStatus,
      (comments) => {
        Object.entries(comments).forEach(([section, sectionComments]) => {
          sectionComments.forEach(comment => {
            addSectionComment(section, comment.content);
          });
        });
      }
    );
  };
  
  /**
   * Refine the proposal using AI
   */
  const refineProposal = (
    formData: any,
    setLoading: (loading: boolean) => void,
    updateFormData: (updates: Record<string, any>) => void,
    setCurrentStep: (step: number) => void
  ) => {
    return baseRefineProposal(
      formData,
      setLoading,
      updateFormData,
      setCurrentStep
    );
  };
  
  return {
    sectionStatuses,
    sectionComments,
    processRfpDocument,
    generateProposalDraft,
    addSectionComment,
    updateSectionStatus,
    refineProposal,
    getSectionStatusIcon
  };
};

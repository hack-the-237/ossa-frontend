
import { useEditSections } from './useEditSections';
import { useProcessDocument } from './useProcessDocument';
import { useRegenerateSummary } from './useRegenerateSummary';

/**
 * Main hook combining all RFP summary functionality
 */
export const useRfpSummary = () => {
  // Import all the individual hooks
  const { editingSections, toggleEditSection } = useEditSections();
  const { apiProcessing, processDocument } = useProcessDocument();
  const { regeneratingSummary, regenerateSummary } = useRegenerateSummary();
  
  // Return all the state and functions
  return {
    // Edit sections functionality
    editingSections,
    toggleEditSection,
    
    // API processing functionality
    apiProcessing,
    processDocument,
    
    // Summary regeneration functionality
    regeneratingSummary,
    regenerateSummary,
  };
};

// Export individual hooks for direct use if needed
export { useEditSections, useProcessDocument, useRegenerateSummary };

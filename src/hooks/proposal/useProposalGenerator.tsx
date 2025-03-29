
import { toast } from "@/hooks/use-toast";

// Add the API endpoint for proposal draft generation
const PROPOSAL_GEN_API = "https://hack-237-proposal-gen-466100360461.us-central1.run.app";

/**
 * Hook to handle proposal draft generation
 */
export const useProposalGenerator = () => {
  /**
   * Generate a proposal draft based on the RFP summary
   */
  const generateProposalDraft = async (
    documentLocation: string,
    rfpSummary: any,
    setDraftingProposal: (drafting: boolean) => void,
    updateFormData: (updates: Record<string, any>) => void,
    setCurrentStep: (step: number) => void,
    updateSectionStatus: (section: string, status: string) => void,
    setSectionComments: (comments: Record<string, any[]>) => void,
    additionalContext?: string
  ) => {
    console.log("Starting proposal draft generation with document location:", documentLocation);
    
    // Validate document location
    if (!documentLocation || documentLocation.trim() === "") {
      console.error("Document location is missing or empty");
      toast({
        title: "Error",
        description: "Document location is missing. Please process the RFP first.",
        variant: "destructive",
      });
      return false;
    }
    
    // Show loading state
    setDraftingProposal(true);
    
    try {
      // Add additionalContext to the RFP summary if provided
      const enhancedSummary = { ...rfpSummary };
      if (additionalContext && additionalContext.trim() !== "") {
        enhancedSummary["Additional Context"] = additionalContext;
      }
      
      // Prepare the request payload
      const payload = {
        document_location_uri: documentLocation,
        document_summary: enhancedSummary
      };
      
      console.log("Sending proposal generation request with payload:", payload);
      
      // Make the API request
      const response = await fetch(PROPOSAL_GEN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      // Parse the response
      const data = await response.json();
      console.log("Received proposal draft data:", data);
      
      // Extract the proposal sections
      const proposalDraft: Record<string, string> = {};
      const initialStatuses: Record<string, string> = {};
      const initialComments: Record<string, any[]> = {};
      
      // Helper function to normalize section keys
      const normalizeSectionKey = (key: string): string => {
        return key.replace(/\s+/g, '').replace(/[^a-zA-Z0-9_]/g, '');
      };
      
      // Helper function to process sections recursively
      const processSection = (prefix: string, sectionData: any, level: number) => {
        if (typeof sectionData === 'string') {
          const sectionKey = prefix ? prefix : 'executiveSummary';
          proposalDraft[sectionKey] = sectionData;
          initialStatuses[sectionKey] = 'pending';
          initialComments[sectionKey] = [];
          return;
        }
        
        if (typeof sectionData !== 'object' || sectionData === null) {
          return;
        }
        
        // Handle arrays of sections
        if (Array.isArray(sectionData)) {
          sectionData.forEach((item, index) => {
            const itemKey = prefix ? `${prefix}_item${index + 1}` : `item${index + 1}`;
            processSection(itemKey, item, level + 1);
          });
          return;
        }
        
        // Skip processing of non-relevant keys
        const skipKeys = ['Title', 'Date', 'table_of_contents', 'Table of Contents'];
        
        // Process objects
        Object.entries(sectionData).forEach(([key, value]) => {
          if (skipKeys.includes(key)) {
            return;
          }
          
          const normalizedKey = normalizeSectionKey(key);
          const sectionKey = prefix ? `${prefix}_${normalizedKey}` : normalizedKey;
          
          if (typeof value === 'string') {
            proposalDraft[sectionKey] = value as string;
            initialStatuses[sectionKey] = 'pending';
            initialComments[sectionKey] = [];
          } else if (value && typeof value === 'object') {
            // Cast to SectionContent type for type safety
            const sectionContent = value as any;
            
            // If it's a section with content, add it as a section
            if (sectionContent.Content && typeof sectionContent.Content === 'string') {
              proposalDraft[sectionKey] = sectionContent.Content;
              initialStatuses[sectionKey] = 'pending';
              initialComments[sectionKey] = [];
              
              // Process subsections if they exist
              if (sectionContent.Subsections && Array.isArray(sectionContent.Subsections)) {
                sectionContent.Subsections.forEach((subsection: any) => {
                  if (subsection.Content && typeof subsection.Content === 'string') {
                    const subKey = `${sectionKey}_${normalizeSectionKey(subsection.Title || `sub${subsection.Subsection_Number || ''}`)}`;
                    proposalDraft[subKey] = subsection.Content;
                    initialStatuses[subKey] = 'pending';
                    initialComments[subKey] = [];
                  }
                });
              }
            } else {
              // Otherwise, it's another level of nesting
              processSection(sectionKey, value, level + 1);
            }
          }
        });
      };
      
      // Start processing the data
      if (data.Proposal) {
        // Process the Proposal object
        processSection('', data.Proposal, 0);
      } else {
        // If there's no Proposal key, process the data directly
        processSection('', data, 0);
      }
      
      // If no sections were found, create default sections
      if (Object.keys(proposalDraft).length === 0) {
        const defaultSections = [
          { key: 'executiveSummary', title: '# Executive Summary\n\nPlease add your executive summary here.' },
          { key: 'companyProfile', title: '# Company Profile\n\nPlease add your company profile here.' },
          { key: 'proposedSolution', title: '# Proposed Solution\n\nPlease add your proposed solution details here.' },
          { key: 'implementation', title: '# Implementation Plan\n\nPlease add your implementation plan here.' },
          { key: 'timeline', title: '# Project Timeline\n\nPlease add your project timeline here.' },
          { key: 'pricing', title: '# Pricing Details\n\nPlease add your pricing details here.' }
        ];
        
        defaultSections.forEach(section => {
          proposalDraft[section.key] = section.title;
          initialStatuses[section.key] = 'pending';
          initialComments[section.key] = [];
        });
        
        console.warn("No proposal sections detected in API response, using default sections");
      }
      
      console.log("Processed proposal sections:", proposalDraft);
      
      // Update the form data with the proposal draft
      updateFormData({
        proposalDraft
      });
      
      // Initialize section statuses and comments
      Object.keys(proposalDraft).forEach(section => {
        updateSectionStatus(section, 'pending');
      });
      
      setSectionComments(initialComments);
      
      // Move to the next step
      setCurrentStep(2);
      
      // Show success notification
      toast({
        title: "Proposal Draft Generated",
        description: "Your proposal draft has been successfully generated. You can now review and edit it.",
      });
      
      return true;
    } catch (error) {
      console.error("Error generating proposal draft:", error);
      
      toast({
        title: "Error",
        description: "Failed to generate proposal draft. Please try again.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setDraftingProposal(false);
    }
  };
  
  return {
    generateProposalDraft,
  };
};

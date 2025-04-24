import { useState } from "react";

// Initial form data
const initialFormData = {
  // Step 1: Upload RFP
  rfpFile: null as File | null,
  rfpTitle: "",
  clientName: "",
  clientIndustry: "",
  proposalTemplate: "",
  dueDate: "",
  
  // Document location for API calls
  documentLocation: "",
  
  // Step 2: RFP Summary
  summaryTemplate: "comprehensive",
  rfpSummary: {},
  keyRequirements: [],
  evaluationCriteria: {},
  budget: "",
  timeline: "",
  projectTitle: "",
  technicalRequirements: [],
  deliverables: [],
  clarifyingQuestions: [],
  keywords: [],
  additionalContext: "",
  
  // Step 3: Proposal Draft (AI-generated)
  proposalDraft: {
    executiveSummary: "# Executive Summary\n\nOssa is pleased to present this proposal for implementing a comprehensive ERP solution that addresses all the requirements outlined in your RFP...",
    companyOverview: "# Company Overview\n\nWith over 20 years of experience in delivering enterprise solutions...",
    serviceDescription: "# Service Description\n\nOur solution offers a comprehensive set of features...",
    deliverySchedule: "# Delivery Schedule\n\nOur implementation approach follows a proven methodology...",
    costSchedule: "# Cost Schedule\n\nThe total investment for this solution is...",
    conclusion: "# Conclusion\n\nWe are confident that our solution will meet all your requirements..."
  },
  
  // Step 4: Refine Proposal
  proposalEdits: "",
  aiSuggestions: [] as string[],
  
  // Step 5: Final Review
  finalProposal: "",
};

// Hook to manage form data
export const useFormData = () => {
  const [formData, setFormData] = useState(initialFormData);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle selection changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Mock file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData({
        ...formData,
        rfpFile: file,
      });
    }
  };
  
  // Handle section-specific edits for proposal draft
  const handleProposalSectionChange = (section: keyof typeof formData.proposalDraft, value: string) => {
    setFormData({
      ...formData,
      proposalDraft: {
        ...formData.proposalDraft,
        [section]: value,
      },
    });
  };
  
  // Handle proposal edits in the refinement step
  const handleProposalEditsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      proposalEdits: e.target.value,
    });
  };
  
  // Update form data with partial updates
  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData({
      ...formData,
      ...updates,
    });
  };
  
  return {
    formData,
    handleChange,
    handleSelectChange,
    handleFileUpload,
    handleProposalSectionChange,
    handleProposalEditsChange,
    updateFormData
  };
};

export default useFormData;

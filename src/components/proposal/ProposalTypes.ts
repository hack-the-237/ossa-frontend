
export interface ProposalSection {
  id: string;
  title: string;
  content: string;
}

export interface Comment {
  id: string;
  section?: string;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  timestamp: string;
  content: string;
  resolved: boolean;
}

export interface Proposal {
  id: string;
  title: string;
  client: string;
  status: string;
  submissionDate: string;
  sections: ProposalSection[];
  comments: Comment[];
}

export interface EditingSections {
  rfpSummary: boolean;
  keyRequirements: boolean;
  evaluationCriteria: boolean;
  budget: boolean;
  timeline: boolean;
}

export interface RfpSummaryFormData {
  summaryTemplate: string;
  rfpSummary: any;
  keyRequirements: any;
  evaluationCriteria: any;
  budget: string;
  timeline: any;
}

export interface ProposalDraftSection {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'in-progress' | 'completed';
  commentCount: number;
}

export interface ProposalFormData {
  rfpFile: File | null;
  rfpTitle: string;
  clientName: string;
  clientIndustry: string;
  proposalTemplate: string;
  dueDate: string;
  
  // Document location for API calls
  documentLocation: string;
  
  summaryTemplate: string;
  rfpSummary: any;
  keyRequirements: any;
  evaluationCriteria: any;
  budget: string;
  timeline: any;
  
  proposalDraft: Record<string, string>;
  additionalSections?: Record<string, any>;
  
  proposalEdits: string;
  aiSuggestions: string[];
  
  finalProposal: string;
}

export interface SectionStatus {
  executiveSummary: string;
  proposedSolution: string;
  implementationApproach: string;
  timelineMilestones: string;
  costBreakdown: string;
}

export interface SectionComments {
  executiveSummary: any[];
  proposedSolution: any[];
  implementationApproach: any[];
  timelineMilestones: any[];
  costBreakdown: any[];
}

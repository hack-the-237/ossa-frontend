export interface RfpSummaryData {
  rfpSummary: {
    "Project Title": string;
    "Project Overview": string;
    "Requestor": string;
    "Deadline": string;
    "Contact": string;
  };
  keyRequirements: string[];
  evaluationCriteria: {
    "Contact Information": string | Record<string, string>;
  };
  budget: string;
  timeline: {
    "Timeline": string;
  };
  technicalRequirements: string[];
  deliverables: string[];
  clarifyingQuestions: string[];
  keywords: string[];
}
  
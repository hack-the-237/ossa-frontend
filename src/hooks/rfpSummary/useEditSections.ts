
import { useState } from "react";

export const useEditSections = () => {
  // State to track which sections are currently being edited
  const [editingSections, setEditingSections] = useState({
    rfpSummary: false,
    keyRequirements: false,
    evaluationCriteria: false,
    budget: false,
    timeline: false,
    projectTitle: false
  });
  
  // Toggle editing state for a specific section
  const toggleEditSection = (section: string) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };
  
  return {
    editingSections,
    toggleEditSection
  };
};

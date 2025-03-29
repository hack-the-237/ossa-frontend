
import { useState } from "react";
import { Check, AlertCircle, HelpCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

/**
 * Hook to manage section statuses and comments
 */
export const useSectionManagement = () => {
  // Track the status of each section (pending, in-progress, completed)
  const [sectionStatuses, setSectionStatuses] = useState<Record<string, string>>({});
  
  // Track comments for each section
  const [sectionComments, setSectionComments] = useState<Record<string, any[]>>({});
  
  /**
   * Add a comment to a section
   */
  const addSectionComment = (section: string, comment: string) => {
    setSectionComments(prev => {
      const newComments = { ...prev };
      
      if (!newComments[section]) {
        newComments[section] = [];
      }
      
      newComments[section].push({
        id: `comment-${Date.now()}`,
        content: comment,
        user: {
          name: "You",
          initials: "YO",
        },
        timestamp: new Date().toISOString(),
        resolved: false
      });
      
      return newComments;
    });
  };
  
  /**
   * Update the status of a section
   */
  const updateSectionStatus = (section: string, status: string) => {
    setSectionStatuses(prev => ({
      ...prev,
      [section]: status
    }));
  };
  
  /**
   * Get the appropriate icon for a section status
   */
  const getSectionStatusIcon = (status: string) => {
    const iconClasses = "h-4 w-4 mr-1";
    
    switch (status) {
      case "completed":
        return <Check className={`${iconClasses} text-green-600`} />;
      case "in-progress":
        return <HelpCircle className={`${iconClasses} text-amber-600`} />;
      default:
        return <AlertCircle className={`${iconClasses} text-gray-500`} />;
    }
  };
  
  return {
    sectionStatuses,
    sectionComments,
    addSectionComment,
    updateSectionStatus,
    getSectionStatusIcon
  };
};

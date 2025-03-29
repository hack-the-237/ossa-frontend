
import React from "react";
import { BookOpen, Clock, FileCheck, FileText, RefreshCw } from "lucide-react";

interface SectionIconProps {
  sectionId: string;
  className?: string;
}

const SectionIcon: React.FC<SectionIconProps> = ({ sectionId, className = "h-5 w-5 text-brand-500 mr-2" }) => {
  // Map section IDs to icons - add more mappings as needed
  const sectionIcons: Record<string, any> = {
    executiveSummary: BookOpen,
    proposedSolution: FileCheck,
    implementationApproach: RefreshCw,
    timelineMilestones: Clock,
    costBreakdown: FileText
  };
  
  // Get current section icon, fallback to FileText if not found
  const IconComponent = sectionIcons[sectionId] ? sectionIcons[sectionId] : FileText;
  return <IconComponent className={className} />;
};

export default SectionIcon;

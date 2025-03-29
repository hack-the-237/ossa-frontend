
import React from "react";
import { FileText, MessageSquare, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SectionInfo {
  id: string;
  title: string;
  commentCount?: number;
  status?: string;
}

interface ProposalNavigationProps {
  sections: SectionInfo[];
  activeSection: string;
  setActiveSection: (id: string) => void;
  showOverallRating?: boolean;
  onRatingChange?: (value: string) => void;
  showDecision?: boolean;
  onDecisionChange?: (value: string) => void;
  onComplete?: () => void;
  completeBtnText?: string;
}

const ProposalNavigation: React.FC<ProposalNavigationProps> = ({
  sections,
  activeSection,
  setActiveSection,
  showOverallRating = false,
  onRatingChange,
  showDecision = false,
  onDecisionChange,
  onComplete,
  completeBtnText = "Complete"
}) => {
  // Function to get the appropriate status badge style
  const getStatusBadgeStyle = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800 border-gray-300";
    
    switch (status) {
      case 'completed':
        return "bg-green-100 text-green-800 border-green-300";
      case 'in-progress':
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 sticky top-24">
      <div className="p-4 border-b">
        <h3 className="font-medium text-lg flex items-center">
          <FileText className="h-4 w-4 mr-2 text-brand-500" />
          Navigate Sections
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center transition-colors ${
                activeSection === section.id
                  ? "bg-brand-100 text-navy-800 font-medium"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <span>{section.title}</span>
              <div className="flex items-center gap-1">
                {(section.commentCount && section.commentCount > 0) && (
                  <Badge
                    className={`${
                      activeSection === section.id
                        ? "bg-navy-800 text-white"
                        : "bg-brand-200 text-navy-800"
                    } rounded-md px-2 py-0.5`}
                  >
                    {section.commentCount}
                  </Badge>
                )}
                {section.status && (
                  <Badge
                    className={`rounded-md px-2 py-0.5 border ${getStatusBadgeStyle(section.status)}`}
                  >
                    {section.status === 'completed' ? 'Done' : 
                     section.status === 'in-progress' ? 'Editing' : 'Pending'}
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {(showOverallRating || showDecision || onComplete) && (
        <div className="p-4 border-t">
          {showOverallRating && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Overall Rating</h4>
              <Select
                defaultValue="excellent"
                onValueChange={onRatingChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {showDecision && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Decision</h4>
              <Select
                defaultValue="approve"
                onValueChange={onDecisionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Approve</SelectItem>
                  <SelectItem value="approve-with-changes">
                    Approve with Changes
                  </SelectItem>
                  <SelectItem value="request-revisions">
                    Request Revisions
                  </SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {onComplete && (
            <Button
              className="w-full"
              onClick={onComplete}
            >
              {completeBtnText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProposalNavigation;


import React from "react";
import { Check, MoreHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProposalSectionProps {
  title: string;
  icon: React.ElementType;
  content: string;
  status: string;
  sectionKey: string;
  onContentChange: (sectionKey: string, content: string) => void;
  onStatusChange: (sectionKey: string, status: string) => void;
  onAddComment: (sectionKey: string, comment: string) => void;
  getStatusIcon: (status: string) => React.ReactNode;
}

const ProposalSection: React.FC<ProposalSectionProps> = ({
  title,
  icon: Icon,
  content,
  status,
  sectionKey,
  onContentChange,
  onStatusChange,
  onAddComment,
  getStatusIcon,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center">
          <Icon className="h-4 w-4 text-brand-500 mr-2" />
          <h4 className="font-medium">{title}</h4>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(status)}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onStatusChange(
              sectionKey, 
              status === 'completed' ? 'in-progress' : 'completed'
            )}
            className="h-8 w-8 p-0"
          >
            <Check className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAddComment(sectionKey, `Comment on ${title}`)}>
                Add Comment
              </DropdownMenuItem>
              <DropdownMenuItem>
                Regenerate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-4">
        <Textarea
          value={content}
          onChange={(e) => onContentChange(sectionKey, e.target.value)}
          rows={6}
          className="w-full font-mono text-sm"
        />
      </div>
    </div>
  );
};

export default ProposalSection;

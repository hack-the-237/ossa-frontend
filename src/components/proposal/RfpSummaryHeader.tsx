
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { templates } from "./ProposalConstants";

interface RfpSummaryHeaderProps {
  proposalTemplate: string;
  onTemplateChange: (name: string, value: string) => void;
}

const RfpSummaryHeader: React.FC<RfpSummaryHeaderProps> = ({
  proposalTemplate,
  onTemplateChange,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-medium mb-1">RFP Summary</h3>
        <p className="text-muted-foreground">
          AI-generated summary of the RFP document.
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium">Proposal Template:</span>
          <Select
            value={proposalTemplate}
            onValueChange={(value) => onTemplateChange("proposalTemplate", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.value} value={template.value}>
                  {template.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default RfpSummaryHeader;

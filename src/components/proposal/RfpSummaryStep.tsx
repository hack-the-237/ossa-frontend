
import React from "react";
import {
  BookOpen,
  CheckCircle,
  Clock,
  DollarSign,
  ListChecks,
  FileText,
  MessageCircle
} from "lucide-react";
import RfpSummaryHeader from "./RfpSummaryHeader";
import RfpSummaryCard from "./RfpSummaryCard";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RfpSummaryStepProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  apiProcessing: boolean;
}

const RfpSummaryStep: React.FC<RfpSummaryStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  apiProcessing,
}) => {
  return (
    <div className="space-y-6">
      <RfpSummaryHeader
        proposalTemplate={formData.proposalTemplate}
        onTemplateChange={handleSelectChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <RfpSummaryCard
            icon={<BookOpen className="mr-2 h-4 w-4 text-brand-500" />}
            title="Project Title"
            description="Title of the project from the RFP"
            content={formData.rfpSummary?.["Project Title"] || ""}
            isLoading={apiProcessing}
          />
          
          <RfpSummaryCard
            icon={<BookOpen className="mr-2 h-4 w-4 text-brand-500" />}
            title="Project Information"
            description="Overview of the Request for Proposal"
            content={formData.rfpSummary?.["Project Overview"] || ""}
            isLoading={apiProcessing}
          />

          <RfpSummaryCard
            icon={<ListChecks className="mr-2 h-4 w-4 text-brand-500" />}
            title="Key Requirements"
            description="Essential requirements listed in the RFP"
            content={formData.keyRequirements || []}
            isLoading={apiProcessing}
          />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <RfpSummaryCard
              icon={<CheckCircle className="mr-2 h-4 w-4 text-brand-500" />}
              title="Contact Information"
              description="Relevant contact details for the RFP"
              content={formData.evaluationCriteria || {}}
              isLoading={apiProcessing}
              className="h-auto"
            />
          </div>

          <RfpSummaryCard
            icon={<DollarSign className="mr-2 h-4 w-4 text-brand-500" />}
            title="Budget"
            description="Client's budget information and constraints"
            content={formData.budget || "Loading budget information..."}
            isLoading={apiProcessing}
          />

          <RfpSummaryCard
            icon={<Clock className="mr-2 h-4 w-4 text-brand-500" />}
            title="Timeline"
            description="Project timeline and important deadlines"
            content={formData.timeline || {}}
            isLoading={apiProcessing}
          />

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <MessageCircle className="mr-2 h-4 w-4 text-brand-500" />
                <CardTitle>Additional Context</CardTitle>
              </div>
              <CardDescription>Add any additional information or context for the proposal generation</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                name="additionalContext"
                value={formData.additionalContext || ""}
                onChange={handleChange}
                rows={4}
                placeholder="Add any additional context or notes that should be considered when generating the proposal..."
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {formData.documentLocation && (
        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          <div className="flex items-start">
            <FileText className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
            <span>Document: {formData.documentLocation}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RfpSummaryStep;

import React, { useEffect } from "react";
import { 
  BookOpen, 
  Clock, 
  DollarSign, 
  ListChecks, 
  FileText, 
  MessageCircle, 
  Mail, 
  Download,
  ChevronDown,
  Tag
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { jsPDF } from "jspdf";

import { generateRfpSummaryPdf } from "@/utils/pdfGenerator";
import { generateRfpSummaryDoc } from "@/utils/docGenerator";
import type { RfpSummaryData } from "@/types/rfp";

interface RfpSummaryStepv2Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  apiProcessing: boolean;
  summaryData: RfpSummaryData;
  documentName: string;
}

const RfpSummaryStepv2: React.FC<RfpSummaryStepv2Props> = ({
  formData,
  handleChange,
  handleSelectChange,
  apiProcessing,
}) => {
  // Add effect to log the formData structure
  useEffect(() => {
    console.log("RfpSummaryStepv2 - Current formData:", formData);
    console.log("RfpSummaryStepv2 - RFP Summary:", formData?.rfpSummary);
  }, [formData]);

  const handleDownloadWord = async () => {
    try {
      console.log("Starting Word document generation with formData:", formData);
      
      if (!formData) {
        throw new Error("Form data is undefined or null");
      }

      const blob = await generateRfpSummaryDoc(formData);
      
      if (!blob) {
        throw new Error("Generated document blob is empty");
      }

      console.log("Document blob generated successfully");
      
      // Get requestor name and format it for filename
      const requestor = formData?.rfpSummary?.["Requestor"] || "unnamed";
      const safeRequestorName = requestor
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${safeRequestorName}_summary.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Complete",
        description: "RFP Summary has been downloaded as a Word document.",
      });
    } catch (error) {
      console.error('Error generating Word document:', error);
      console.error('Error details:', {
        formData: formData,
        errorMessage: error.message,
        errorStack: error.stack
      });
      
      toast({
        title: "Download Failed",
        description: error.message || "Failed to generate Word document. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDownloadPdf = () => {
    try {
      const doc = generateRfpSummaryPdf(formData);
      // Get requestor name and format it for filename (remove spaces, special chars)
      const requestor = formData?.rfpSummary?.["Requestor"] || "unnamed";
      const safeRequestorName = requestor
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_') // Replace any non-alphanumeric chars with underscore
        .replace(/_+/g, '_') // Replace multiple underscores with single
        .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
      
      doc.save(`${safeRequestorName}_summary.pdf`);
      
      toast({
        title: "Download Complete",
        description: "RFP Summary has been downloaded as a PDF.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderListSection = (title: string, items: string[] = [], icon: React.ReactNode) => {
    console.log(`Rendering section ${title} with items:`, items);
    
    return (
      <Collapsible className="w-full">
        <div className="flex items-center space-x-4 py-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              {icon}
              <h4 className="text-sm font-semibold">{title}</h4>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          {Array.isArray(items) && items.length > 0 ? (
            <ul className="ml-6 list-disc [&>li]:mt-2">
              {items.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground ml-6">No {title.toLowerCase()} specified</p>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with title and actions */}
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-background pt-4 pb-2 z-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {formData?.rfpSummary?.["Project Title"] || "RFP Summary"}
          </h2>
          <p className="text-muted-foreground">
            <Clock className="inline-block w-4 h-4 mr-1" />
            Deadline: {formData?.rfpSummary?.["Deadline"] || "Not specified"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
          <DropdownMenuItem onClick={handleDownloadPdf}>
              <FileText className="mr-2 h-4 w-4" />
              Download as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadWord}>
              <FileText className="mr-2 h-4 w-4" />
              Download as Word
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main content */}
      <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
                <span className="text-sm">Keywords:</span>
                {formData.keywords && formData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                  >
                  {keyword}
                  </span>
                ))}
            </div>
        {/* Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {formData?.rfpSummary?.["Project Overview"] || "No project overview available"}
            </p>
          </CardContent>
        </Card>

        {/* Scope and Deliverables */}
        <Card>
          <CardContent className="pt-6">
            {renderListSection(
              "Scope of Work",
              formData?.keyRequirements,
              <ListChecks className="h-5 w-5" />
            )}
            <div className="border-t my-4" />
            {renderListSection(
              "Deliverables",
              formData?.deliverables,
              <ListChecks className="h-5 w-5" />
            )}
          </CardContent>
        </Card>

        {/* Requirements and Questions */}
        <Card>
          <CardContent className="pt-6">
            {renderListSection(
              "Technical Requirements",
              formData?.technicalRequirements,
              <FileText className="h-5 w-5" />
            )}
            <div className="border-t my-4" />
            {renderListSection(
              "Clarifying Questions",
              formData?.clarifyingQuestions,
              <MessageCircle className="h-5 w-5" />
            )}
          </CardContent>
        </Card>

        {/* Footer information */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Timeline: {formData?.timeline?.["Timeline"] || "Not specified"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Budget: {formData?.budget || "Not specified"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">Contact: {formData?.rfpSummary?.["Contact"] || "Not specified"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5" />
                <CardTitle className="text-lg flex items-center gap-2">Additional Context</CardTitle>
              </div>
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

export default RfpSummaryStepv2;
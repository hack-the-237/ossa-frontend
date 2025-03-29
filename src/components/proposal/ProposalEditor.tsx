
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenTool, Save, FileText, Check, HelpCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface ProposalEditorProps {
  formData: any;
  activeSection: string;
  setActiveSection: (section: string) => void;
  availableSections: string[];
  getSectionTitle: (section: string) => string;
  handleProposalSectionChange?: (section: string, value: string) => void;
  sectionStatuses: Record<string, string>;
}

const ProposalEditor: React.FC<ProposalEditorProps> = ({
  formData,
  activeSection,
  setActiveSection,
  availableSections,
  getSectionTitle,
  handleProposalSectionChange,
  sectionStatuses
}) => {
  const handleSaveProposal = () => {
    toast({
      title: "Proposal saved",
      description: "Your proposal draft has been saved.",
    });
  };
  
  const handleDownloadProposal = () => {
    // Create content from all sections
    let content = "";
    
    availableSections.forEach(section => {
      content += `## ${getSectionTitle(section)}\n\n${formData.proposalDraft[section] || ''}\n\n`;
    });
    
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proposal-draft.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Your proposal draft has been downloaded as a Word document.",
    });
  };

  const getSectionStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <HelpCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSectionStatusBadge = (section: string) => {
    const status = sectionStatuses[section] || 'pending';
    return (
      <Badge
        className={`${
          status === 'completed' 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : status === 'in-progress'
            ? "bg-amber-100 text-amber-800 border border-amber-200"
            : "bg-gray-100 text-gray-800 border border-gray-200"
        } rounded-sm px-2 py-0.5 text-xs font-medium`}
      >
        {status === 'completed' ? 'Completed' : 
         status === 'in-progress' ? 'In Progress' : 'Pending'}
      </Badge>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center p-3 border-b">
        <div className="flex items-center">
          <PenTool className="h-4 w-4 text-brand-500 mr-2" />
          <h3 className="font-medium text-sm">Proposal Sections</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveProposal}
            className="flex items-center text-xs h-8"
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadProposal}
            className="flex items-center text-xs h-8"
          >
            <FileText className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="p-3">
        <Accordion 
          type="single" 
          collapsible 
          className="w-full"
          defaultValue={activeSection}
        >
          {availableSections.map((section) => (
            <AccordionItem key={section} value={section}>
              <AccordionTrigger 
                className="py-2 px-3 hover:bg-gray-50 rounded-lg text-sm"
                onClick={() => setActiveSection(section)}
              >
                <div className="flex items-center text-left flex-grow">
                  <span className={`font-medium ${section === activeSection ? 'text-brand-500' : ''}`}>
                    {getSectionTitle(section)}
                  </span>
                </div>
                <div className="ml-auto mr-2">
                  {getSectionStatusBadge(section)}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3">
                <Textarea
                  value={formData.proposalDraft[section] || ''}
                  onChange={(e) => handleProposalSectionChange ? 
                    handleProposalSectionChange(section, e.target.value) : 
                    console.warn("Section editing not available")}
                  className="w-full min-h-[200px] font-mono text-xs mb-3"
                  placeholder={`Enter content for ${getSectionTitle(section)}...`}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default ProposalEditor;


import React, { useEffect } from "react";
import { RefreshCw, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ProposalNavigation from "./ProposalNavigation";
import SectionEditor from "./SectionEditor";
import SectionIcon from "./SectionIcon";
import { useSectionNavigation } from "@/hooks/useSectionNavigation";

interface ProposalDraftStepProps {
  formData: {
    proposalDraft: Record<string, string>;
    additionalSections?: Record<string, any>;
    documentLocation?: string;
  };
  sectionStatuses: Record<string, string>;
  handleProposalSectionChange: (section: string, value: string) => void;
  updateSectionStatus: (section: string, status: string) => void;
  addSectionComment: (section: string, comment: string) => void;
  getSectionStatusIcon: (status: string) => React.ReactNode;
}

const ProposalDraftStep: React.FC<ProposalDraftStepProps> = ({
  formData,
  sectionStatuses,
  handleProposalSectionChange,
  updateSectionStatus,
  addSectionComment,
  getSectionStatusIcon,
}) => {
  const availableSections = Object.keys(formData.proposalDraft || {});
  
  const { 
    activeSection, 
    setActiveSection, 
    getSectionTitle, 
    getNavigationSections,
    getSubsections,
    getTopLevelSections
  } = useSectionNavigation(availableSections, sectionStatuses, {});

  // Define default section order
  const defaultSectionOrder = [
    "executiveSummary", 
    "companyOverview", 
    "serviceDescription", 
    "deliverySchedule", 
    "costSchedule", 
    "conclusion"
  ];

  useEffect(() => {
    if (availableSections.length > 0 && !activeSection) {
      // Find the first section that matches our default order
      let initialSection = availableSections[0];
      
      for (const section of defaultSectionOrder) {
        if (availableSections.includes(section)) {
          initialSection = section;
          break;
        }
      }
      
      setActiveSection(initialSection);
    }
  }, [availableSections, activeSection, setActiveSection]);

  const handleDownloadProposal = () => {
    if (!formData.proposalDraft || Object.keys(formData.proposalDraft).length === 0) {
      toast({
        title: "No Content",
        description: "There is no proposal content to download.",
        variant: "destructive",
      });
      return;
    }
    
    let content = "# Complete Proposal\n\n";
    
    const topLevelSections = getTopLevelSections(availableSections);
    topLevelSections.forEach(sectionKey => {
      content += `## ${getSectionTitle(sectionKey)}\n\n${formData.proposalDraft[sectionKey] || ''}\n\n`;
      
      const sectionSubsections = getSubsections(sectionKey);
      sectionSubsections.forEach(subKey => {
        const subName = subKey.replace(`${sectionKey}_`, '');
        content += `### ${getSectionTitle(subName)}\n\n${formData.proposalDraft[subKey] || ''}\n\n`;
      });
    });
    
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'complete_proposal.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Proposal Downloaded",
      description: "The complete proposal has been downloaded as a Word document.",
    });
  };

  const handleStatusChange = () => {
    const currentStatus = sectionStatuses[activeSection] || 'pending';
    const newStatus = currentStatus === 'completed' ? 'in-progress' : 'completed';
    updateSectionStatus(activeSection, newStatus);
    
    toast({
      title: "Status Updated",
      description: `Section marked as ${newStatus === 'completed' ? 'Completed' : 'In Progress'}.`,
    });
  };

  if (!activeSection) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-brand-500 animate-spin mx-auto mb-4" />
          <p>Loading proposal draft sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionEditor
            title={getSectionTitle(activeSection)}
            content={formData.proposalDraft[activeSection] || ''}
            status={sectionStatuses[activeSection] || 'pending'}
            sectionId={activeSection}
            icon={<SectionIcon sectionId={activeSection} />}
            statusIcon={getSectionStatusIcon(sectionStatuses[activeSection] || 'pending')}
            comments={[]}
            onContentChange={(content) => handleProposalSectionChange(activeSection, content)}
            onStatusChange={handleStatusChange}
            onDownload={handleDownloadProposal}
            onAddComment={addSectionComment}
            onResolveComment={() => {}}
          />
        </div>
        
        <div className="lg:col-span-1">
          <ProposalNavigation 
            sections={getNavigationSections()}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            completeBtnText="Mark All Complete"
            onComplete={() => {
              availableSections.forEach(section => {
                updateSectionStatus(section, 'completed');
              });
              
              toast({
                title: "All Sections Completed",
                description: "All sections have been marked as complete.",
              });
            }}
          />
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

export default ProposalDraftStep;

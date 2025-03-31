import React, { useEffect, useState } from "react";
import { RefreshCw, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ProposalNavigation from "./ProposalNavigation";
import SectionEditor from "./SectionEditor";
import SectionIcon from "./SectionIcon";
import { useSectionNavigation } from "@/hooks/useSectionNavigation";
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import { jsPDF } from "jspdf";

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
  const [downloading, setDownloading] = useState(false);
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

  // Generate complete content from all sections
  const generateCompleteContent = () => {
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
    
    return content;
  };

  const handleDownloadText = () => {
    if (!formData.proposalDraft || Object.keys(formData.proposalDraft).length === 0) {
      toast({
        title: "No Content",
        description: "There is no proposal content to download.",
        variant: "destructive",
      });
      return;
    }
    
    const content = generateCompleteContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'complete_proposal.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Proposal Downloaded",
      description: "The complete proposal has been downloaded as a text document.",
    });
  };

  const handleDownloadWord = async () => {
    if (!formData.proposalDraft || Object.keys(formData.proposalDraft).length === 0) {
      toast({
        title: "No Content",
        description: "There is no proposal content to download.",
        variant: "destructive",
      });
      return;
    }
    
    setDownloading(true);
    try {
      const content = generateCompleteContent();
      
      // Create a new document
      const doc = new Document({
        sections: [{
          properties: {},
          children: content.split('\n').map(line => {
            // Simple heading detection
            if (line.startsWith('# ')) {
              return new Paragraph({
                text: line.replace('# ', ''),
                heading: HeadingLevel.HEADING_1
              });
            } else if (line.startsWith('## ')) {
              return new Paragraph({
                text: line.replace('## ', ''),
                heading: HeadingLevel.HEADING_2
              });
            } else if (line.startsWith('### ')) {
              return new Paragraph({
                text: line.replace('### ', ''),
                heading: HeadingLevel.HEADING_3
              });
            } else {
              return new Paragraph({
                children: [
                  new TextRun(line)
                ]
              });
            }
          })
        }]
      });

      // Generate the .docx file
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
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
    } catch (error) {
      console.error("Error creating Word document:", error);
      toast({
        title: "Download Failed",
        description: "Failed to generate Word document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!formData.proposalDraft || Object.keys(formData.proposalDraft).length === 0) {
      toast({
        title: "No Content",
        description: "There is no proposal content to download.",
        variant: "destructive",
      });
      return;
    }
    
    setDownloading(true);
    try {
      const content = generateCompleteContent();
      const doc = new jsPDF();
      
      // Split text into lines and add to PDF
      const lines = content.split('\n');
      let yPos = 10;
      
      lines.forEach(line => {
        // Simple formatting for headings
        if (line.startsWith('# ')) {
          doc.setFontSize(24);
          doc.text(line.replace('# ', ''), 10, yPos);
          yPos += 10;
        } else if (line.startsWith('## ')) {
          doc.setFontSize(18);
          doc.text(line.replace('## ', ''), 10, yPos);
          yPos += 8;
        } else if (line.startsWith('### ')) {
          doc.setFontSize(16);
          doc.text(line.replace('### ', ''), 10, yPos);
          yPos += 7;
        } else if (line.trim() !== '') {
          doc.setFontSize(12);
          
          // Handle text wrapping
          const textLines = doc.splitTextToSize(line, 180);
          doc.text(textLines, 10, yPos);
          yPos += textLines.length * 6;
        } else {
          yPos += 4; // Empty line
        }
        
        // Add a new page if needed
        if (yPos > 280) {
          doc.addPage();
          yPos = 10;
        }
      });
      
      doc.save('complete_proposal.pdf');
      
      toast({
        title: "Proposal Downloaded",
        description: "The complete proposal has been downloaded as a PDF document.",
      });
    } catch (error) {
      console.error("Error creating PDF:", error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
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
            onDownload={() => {
              const downloadOptions = [
                { name: 'Text (.txt)', handler: handleDownloadText },
                { name: 'Word (.docx)', handler: handleDownloadWord },
                { name: 'PDF (.pdf)', handler: handleDownloadPdf }
              ];
              
              const selectedFormat = window.prompt(
                'Select a format to download (enter the number):\n1. Text (.txt)\n2. Word (.docx)\n3. PDF (.pdf)',
                '2'
              );
              
              const formatIndex = parseInt(selectedFormat || '2') - 1;
              if (formatIndex >= 0 && formatIndex < downloadOptions.length) {
                downloadOptions[formatIndex].handler();
              }
            }}
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

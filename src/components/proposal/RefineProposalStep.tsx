
import React, { useState } from "react";
import { FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSectionNavigation } from "@/hooks/useSectionNavigation";
import { Comment } from "./SectionComments";
import ProposalEditor from "./ProposalEditor";
import AiAssistant from "./AiAssistant";

interface ChatMessage {
  role: string;
  content: string;
}

interface RefineProposalStepProps {
  proposalEdits: string;
  chatMessages: ChatMessage[];
  chatInput: string;
  handleProposalEditsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setChatInput: (value: string) => void;
  sendChatMessage: () => void;
  formData: any;
  sectionStatuses: Record<string, string>;
  handleProposalSectionChange?: (section: string, value: string) => void;
}

const RefineProposalStep: React.FC<RefineProposalStepProps> = ({
  proposalEdits,
  chatMessages,
  chatInput,
  handleProposalEditsChange,
  setChatInput,
  sendChatMessage,
  formData,
  sectionStatuses,
  handleProposalSectionChange
}) => {
  // Get section names from proposalDraft for navigation
  const availableSections = Object.keys(formData.proposalDraft || {});
  
  const { 
    activeSection, 
    setActiveSection, 
    getSectionTitle, 
    getNavigationSections,
  } = useSectionNavigation(availableSections, sectionStatuses, {});

  const copyToEditor = (content: string) => {
    const textOnly = content.replace(/^(Assistant|User): /i, "").trim();
    
    // Find the current section content
    const currentSectionContent = formData.proposalDraft[activeSection] || '';
    
    // Update the specific section
    if (handleProposalSectionChange) {
      handleProposalSectionChange(activeSection, currentSectionContent + "\n\n" + textOnly);
      
      toast({
        title: "Added to section",
        description: `The AI's suggestion was added to the ${getSectionTitle(activeSection)} section.`,
      });
    } else {
      toast({
        title: "Cannot add to section",
        description: "Section editing functionality is not available.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ProposalEditor 
            formData={formData}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            availableSections={availableSections}
            getSectionTitle={getSectionTitle}
            handleProposalSectionChange={handleProposalSectionChange}
            sectionStatuses={sectionStatuses}
          />

          {formData.documentLocation && (
            <div className="mt-4 pt-2 border-t text-xs text-muted-foreground">
              <div className="flex items-start">
                <FileText className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span>Document: {formData.documentLocation}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-4">
          <AiAssistant
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            sendChatMessage={sendChatMessage}
            activeSection={activeSection}
            getSectionTitle={getSectionTitle}
            copyToEditor={copyToEditor}
          />
        </div>
      </div>
    </div>
  );
};

export default RefineProposalStep;

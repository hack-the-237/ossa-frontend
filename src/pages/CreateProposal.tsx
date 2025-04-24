
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useProposalForm } from "@/hooks/useProposalForm";
import { StepIndicator } from "@/components/proposal/ProposalSteps";
import UploadRfpStep from "@/components/proposal/UploadRfpStep";
//import RfpSummaryStep from "@/components/proposal/RfpSummaryStep";
import RfpSummaryStepv2 from "@/components/proposal/RfpSummaryStepv2";
import ProposalDraftStep from "@/components/proposal/ProposalDraftStep";
import RefineProposalStep from "@/components/proposal/RefineProposalStep";
import FinalizeStep from "@/components/proposal/FinalizeStep";

const CreateProposal = () => {
  const navigate = useNavigate();
  
  const {
    currentStep,
    loading,
    processingRfp,
    draftingProposal,
    apiProcessing,
    editingSections,
    sectionStatuses,
    formData,
    chatInput,
    chatMessages,
    toggleEditSection,
    handleFileUpload,
    handleChange,
    handleSelectChange,
    addSectionComment,
    updateSectionStatus,
    handleProposalSectionChange,
    handleProposalEditsChange,
    setChatInput,
    sendChatMessage,
    getSectionStatusIcon,
    saveDraft,
    handleNext,
    handlePrevious,
    finalizeProposal,
    updateFormData
  } = useProposalForm(navigate);
  
  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <UploadRfpStep
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleFileUpload={handleFileUpload}
            updateFormData={updateFormData}
          />
        );
      case 1:
        return (
          <RfpSummaryStepv2
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            apiProcessing={apiProcessing}
          />
        );
      case 2:
        return (
          <ProposalDraftStep
            formData={formData}
            sectionStatuses={sectionStatuses}
            handleProposalSectionChange={handleProposalSectionChange}
            updateSectionStatus={updateSectionStatus}
            addSectionComment={addSectionComment}
            getSectionStatusIcon={getSectionStatusIcon}
          />
        );
      case 3:
        return (
          <RefineProposalStep
            proposalEdits={formData.proposalEdits}
            chatMessages={chatMessages}
            chatInput={chatInput}
            handleProposalEditsChange={handleProposalEditsChange}
            setChatInput={setChatInput}
            sendChatMessage={sendChatMessage}
            formData={formData}
            sectionStatuses={sectionStatuses}
            handleProposalSectionChange={handleProposalSectionChange}
          />
        );
      case 4:
        return (
          <FinalizeStep
            finalProposal={formData.finalProposal}
            loading={loading}
            finalizeProposal={finalizeProposal}
            documentLocation={formData.documentLocation}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Proposal</h1>
        <p className="text-muted-foreground mt-2">
          Create a new proposal using AI to help you draft and refine your content.
        </p>
      </div>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <StepIndicator currentStep={currentStep} />
          
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || processingRfp || draftingProposal}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button
              variant="outline"
              onClick={saveDraft}
              disabled={processingRfp || draftingProposal}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={loading || processingRfp || draftingProposal}
            >
              {(() => {
                if (processingRfp) {
                  return (
                    <>
                      <span className="mr-2">Processing RFP</span>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    </>
                  );
                }
                
                if (draftingProposal) {
                  return (
                    <>
                      <span className="mr-2">Drafting Proposal</span>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    </>
                  );
                }
                
                if (currentStep === 0) return "Process RFP";
                if (currentStep === 1) return "Generate Proposal Draft";
                if (currentStep === 2) return "Refine with AI";
                if (currentStep === 3) return "Review Final Proposal";
                if (currentStep === 4) return "Finalize";
                return "Next";
              })()}
              {!processingRfp && !draftingProposal && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProposal;

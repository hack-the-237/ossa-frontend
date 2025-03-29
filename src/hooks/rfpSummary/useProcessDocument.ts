import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { RfpSummaryFormData } from "@/components/proposal/ProposalTypes";
import { processRfpDocument } from "@/services/rfpService";
import { formatDocumentLocation } from "@/services/rfp/documentUtils";

/**
 * Hook to handle RFP document processing
 */
export const useProcessDocument = () => {
  const [apiProcessing, setApiProcessing] = useState(false);
  
  // Process RFP document through the API
  const processDocument = async (
    file: File,
    updateFormData: (updates: Partial<RfpSummaryFormData & { documentLocation: string }>) => void
  ) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload an RFP document first.",
        variant: "destructive",
      });
      return false;
    }
    
    setApiProcessing(true);
    console.log("Starting RFP document processing for file:", file.name);
    
    try {
      // Format document location from the file name
      const documentLocation = formatDocumentLocation(file.name);
      console.log("Formatted document location:", documentLocation);
      
      // First, update the form data with just the document location to ensure it's set
      updateFormData({ documentLocation });
      
      try {
        // The processRfpDocument function now returns formatted data directly
        const formattedData = await processRfpDocument(file);
        
        console.log("Setting form data with formatted RFP data:", formattedData);
        
        // Update the form data with the processed RFP summary and document location
        updateFormData({
          ...formattedData,
          documentLocation // Include the document location in the form data
        });
        
        toast({
          title: "RFP Processed",
          description: `The RFP document "${file.name}" has been successfully analyzed.`,
        });
        
        return true;
      } catch (error) {
        console.error("Failed to process RFP:", error);
        
        // Keep the document location even if processing failed
        updateFormData({ documentLocation });
        
        // Check if it's a specific API error
        if (error instanceof Error && error.message.includes("rate limit exceeded")) {
          toast({
            title: "API Rate Limit Exceeded",
            description: "The LLM service is currently at capacity. Please try again later.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Processing Failed",
            description: "Could not process the RFP document. Please try again later.",
            variant: "destructive",
          });
        }
        
        return false;
      }
    } catch (error) {
      console.error("Error in process document:", error);
      
      toast({
        title: "Processing Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setApiProcessing(false);
    }
  };

  return {
    apiProcessing,
    processDocument,
  };
};

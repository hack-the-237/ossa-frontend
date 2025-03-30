import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { RfpSummaryFormData } from "@/components/proposal/ProposalTypes";
import { processRfpDocument } from "@/services/rfpService";
import { formatDocumentLocation } from "@/services/rfp/documentUtils";
import apiClient from "@/api/apiClient";

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
      // First upload the RFP file to get the GCS path
      console.log("Uploading RFP file to get GCS path...");
      
      toast({
        title: "Uploading RFP",
        description: "Uploading your RFP document to our server...",
      });
      
      // Upload the file to the RFP upload endpoint
      const uploadResponse = await apiClient.uploadRfpDocument<{
        status: string;
        gcs_path: string;
        size: string;
      }>(file);
      
      if (uploadResponse.status !== "success" || !uploadResponse.gcs_path) {
        throw new Error("Failed to upload RFP document: Invalid response");
      }
      
      console.log("RFP file uploaded successfully:", uploadResponse);
      
      // Extract the GCS path from the upload response
      const documentLocation = uploadResponse.gcs_path;
      console.log("Using GCS path as document location:", documentLocation);
      
      // Update the form data with the document location
      updateFormData({ documentLocation });
      
      toast({
        title: "RFP Uploaded",
        description: `Successfully uploaded ${file.name} (${uploadResponse.size})`,
      });
      
      try {
        // Process the RFP document using the GCS path
        const formattedData = await processRfpDocument(file, documentLocation);
        
        console.log("Setting form data with formatted RFP data:", formattedData);
        
        // Update the form data with the processed RFP summary
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

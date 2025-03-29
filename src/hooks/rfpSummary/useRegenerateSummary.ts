
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { formatRfpSummary } from "@/services/rfp/formatterService";
import { API_ENDPOINT } from "@/services/rfp/config";

/**
 * Hook to handle RFP summary regeneration
 */
export const useRegenerateSummary = () => {
  const [regeneratingSummary, setRegeneratingSummary] = useState(false);
  
  // Regenerate RFP summary with potentially different formatting options
  const regenerateSummary = async (
    formData: any,
    updateFormData: (updates: Record<string, any>) => void
  ) => {
    setRegeneratingSummary(true);
    
    try {
      toast({
        title: "Regenerating Summary",
        description: "Please wait while we reformat the RFP summary...",
      });
      
      // Get filename from original RFP data if available
      const filename = formData.rfpFile ? formData.rfpFile.name : "Unknown_RFP.pdf";
      
      // Create the request body
      const documentLocation = `gs://ossa-hack237/rfp/${filename}`;
      const requestBody = JSON.stringify({
        document_name: documentLocation
      });
      
      console.log("Regenerating RFP summary for:", documentLocation);
      console.log("Request payload:", requestBody);
      
      // Use direct API endpoint
      const apiUrl = API_ENDPOINT;
      console.log("Using API endpoint:", apiUrl);
      
      toast({
        title: "Connecting to API",
        description: "Attempting to connect to RFP processing service...",
      });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody
      });
      
      console.log("API Response received, status:", response.status);
      console.log("API Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error("API returned error status:", response.status, response.statusText);
        throw new Error(`API returned error status: ${response.status}`);
      }
      
      let data;
      try {
        const responseText = await response.text();
        console.log("API Response raw text:", responseText);
        
        data = JSON.parse(responseText);
        console.log("API Response successfully parsed:", data);
      } catch (parseError) {
        console.error("Failed to parse API response:", parseError);
        throw new Error("Failed to parse API response");
      }
      
      console.log("API response:", data);
      
      // Format the response for UI consumption
      const formattedData = formatRfpSummary(data);
      console.log("Formatted data for UI:", formattedData);
      
      // Update the form data with the regenerated summary
      updateFormData(formattedData);
      
      toast({
        title: "Summary Regenerated",
        description: "The RFP summary has been successfully regenerated.",
      });
    } catch (error) {
      console.error("Error regenerating summary:", error);
      
      toast({
        title: "Regeneration Failed",
        description: "Could not regenerate the RFP summary. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setRegeneratingSummary(false);
    }
  };

  return {
    regeneratingSummary,
    regenerateSummary,
  };
};

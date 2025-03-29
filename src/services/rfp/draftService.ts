
import { toast } from "@/hooks/use-toast";

/**
 * API endpoint for proposal draft generation
 */
export const DRAFT_API_ENDPOINT = "https://hack-237-proposal-gen-466100360461.us-central1.run.app";

/**
 * Generate a proposal draft based on RFP summary
 * @param documentLocationUri The storage location of the RFP document
 * @param documentSummary The JSON summary of the RFP
 * @returns The generated proposal draft
 */
export const generateProposalDraft = async (documentLocationUri: string, documentSummary: any): Promise<any> => {
  try {
    console.log("Generating proposal draft with:", {
      documentLocationUri,
      documentSummary
    });
    
    // Prepare the request body
    const requestBody = JSON.stringify({
      document_location_uri: documentLocationUri,
      document_summary: documentSummary
    });
    
    // Make the API request
    const response = await fetch(DRAFT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: requestBody
    });
    
    if (!response.ok) {
      console.error("API returned error status:", response.status, response.statusText);
      throw new Error(`API returned error status: ${response.status}`);
    }
    
    // Parse the response
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
    
    return data;
  } catch (error) {
    console.error('Error generating proposal draft:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate proposal draft",
      variant: "destructive",
    });
    
    throw error;
  }
};

/**
 * Format the API response for UI consumption
 * @param apiResponse The raw API response
 * @returns Formatted data for the UI
 */
export const formatProposalDraft = (apiResponse: any) => {
  console.log("Formatting proposal draft API response:", apiResponse);
  
  // Extract the sections and map them to the proposal draft format
  // The structure will depend on the API response format
  try {
    const formattedData = {
      proposalDraft: {
        executiveSummary: apiResponse.executive_summary || apiResponse.executiveSummary || "",
        proposedSolution: apiResponse.proposed_solution || apiResponse.proposedSolution || "",
        implementationApproach: apiResponse.implementation_approach || apiResponse.implementationApproach || "",
        timelineMilestones: apiResponse.timeline_milestones || apiResponse.timelineMilestones || "",
        costBreakdown: apiResponse.cost_breakdown || apiResponse.costBreakdown || ""
      },
      // Include any additional sections from the API response
      additionalSections: {}
    };
    
    // Map any extra sections that might be in the API response but not in our predefined structure
    Object.keys(apiResponse).forEach(key => {
      const formattedKey = key.replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase());
      if (!Object.keys(formattedData.proposalDraft).includes(formattedKey)) {
        // @ts-ignore - dynamic property
        formattedData.additionalSections[formattedKey] = apiResponse[key];
      }
    });
    
    console.log("Formatted proposal draft for UI:", formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error formatting proposal draft:", error);
    return {
      proposalDraft: {
        executiveSummary: "",
        proposedSolution: "",
        implementationApproach: "",
        timelineMilestones: "",
        costBreakdown: ""
      },
      additionalSections: {}
    };
  }
};

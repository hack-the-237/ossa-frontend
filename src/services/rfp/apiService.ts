
import { toast } from "@/hooks/use-toast";
import { API_ENDPOINT, USE_MOCK_DATA, MOCK_RFP_RESPONSE } from './config';

/**
 * Makes an API request to process the RFP document
 * @param documentLocation The location of the document to process
 * @returns The response from the API
 */
export const requestRfpProcessing = async (documentLocation: string): Promise<any> => {
  // Create the request body
  const requestBody = JSON.stringify({
    document_name: documentLocation
  });
  
  console.log("RFP API Request body:", requestBody);
  console.log("RFP API Endpoint:", API_ENDPOINT);
  
  // Use AbortController to handle timeouts better
  const controller = new AbortController();
  // Set a longer timeout (3 minutes) for LLM processing
  const timeoutId = setTimeout(() => controller.abort(), 180000);
  
  try {
    // Display processing toast
    toast({
      title: "Processing RFP",
      description: "This may take up to 3 minutes. LLM analysis is in progress...",
    });
    
    // Use the API endpoint directly without proxy
    const apiUrl = API_ENDPOINT;
    
    console.log("Connecting to API endpoint:", apiUrl);
    console.log("Starting API request with payload:", requestBody);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: requestBody,
      signal: controller.signal
    });
    
    // Clear the timeout since the request completed
    clearTimeout(timeoutId);
    
    console.log("API Response received, status:", response.status);
    console.log("API Response headers:", Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      // If we get a non-2xx response
      console.error("API returned error status:", response.status, response.statusText);
      throw new Error(`API returned error status: ${response.status}`);
    }
    
    const responseText = await response.text();
    console.log("API Response raw text:", responseText);
    
    let apiResponse;
    
    // Check if the response starts with 'An error occurred' - this indicates a non-JSON response error
    if (responseText.trim().startsWith('An error occurred')) {
      console.error("API returned an error message:", responseText);
      throw new Error(responseText);
    }
    
    try {
      apiResponse = JSON.parse(responseText);
      console.log("API Response successfully parsed:", apiResponse);
    } catch (parseError) {
      console.error("Failed to parse API response:", parseError);
      console.error("Problematic response text:", responseText);
      throw new Error("Failed to parse API response");
    }
    
    console.log("API Response successful:", apiResponse);
    
    toast({
      title: "RFP Processing Complete",
      description: "Document analysis finished successfully.",
    });
    
    return apiResponse;
  } catch (fetchError) {
    // Clear the timeout if there's an error
    clearTimeout(timeoutId);
    
    console.error("Fetch operation failed:", fetchError);
    
    // Handle AbortController timeout
    if (fetchError.name === 'AbortError') {
      console.error("Request timed out after 3 minutes");
      toast({
        title: "Request Timeout",
        description: "The LLM processing took too long to respond.",
        variant: "destructive",
      });
      throw new Error("Request timed out. The LLM processing took too long to respond.");
    }
    
    // Get the error message, if it contains Vertex AI error, show a more user-friendly message
    const errorMessage = fetchError.message || "Failed to connect to the RFP API.";
    
    if (errorMessage.includes("429") || errorMessage.includes("Resource exhausted")) {
      toast({
        title: "API Rate Limit Exceeded",
        description: "The LLM service is currently at capacity. Please try again later.",
        variant: "destructive"
      });
      throw new Error("API rate limit exceeded. Please try again later.");
    }
    
    toast({
      title: "API Connection Failed",
      description: "Unable to connect to the RFP processing API. Please try again later.",
      variant: "destructive"
    });
    
    // Rethrow the error
    throw new Error("Failed to connect to the RFP API.");
  }
};

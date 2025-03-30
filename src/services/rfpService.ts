import { toast } from "@/hooks/use-toast";
import { formatDocumentLocation } from './rfp/documentUtils';
import { requestRfpProcessing } from './rfp/apiService';
import { formatRfpSummary } from './rfp/formatterService';

/**
 * Process an RFP document and get the summary
 * @param file The file to process
 * @param gcsPath Optional GCS path if the file has already been uploaded
 * @returns The processed RFP document summary
 */
export const processRfpDocument = async (file: File, gcsPath?: string): Promise<any> => {
  try {
    // Use the provided GCS path if available, otherwise format the location from filename
    const documentLocation = gcsPath || formatDocumentLocation(file.name);
    
    console.log("Processing RFP document:", {
      documentLocation,
      fileName: file.name,
      fileSize: file.size,
      usingGcsPath: !!gcsPath
    });

    // Request RFP processing from the API
    const apiResponse = await requestRfpProcessing(documentLocation);
    
    // Format the response for UI consumption
    const formattedData = formatRfpSummary(apiResponse);
    
    // Add the document location to the formatted data
    formattedData.documentLocation = documentLocation;
    
    console.log("Final formatted RFP data for UI:", formattedData);
    
    return formattedData;
  } catch (error) {
    console.error('Error processing RFP:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to process RFP document",
      variant: "destructive",
    });
    
    throw error;
  }
};

// Re-export the other functions for backward compatibility
export { formatDocumentLocation, formatRfpSummary };

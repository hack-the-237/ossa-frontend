
import { DEFAULT_DOCUMENT_LOCATION } from './config';

/**
 * Format the document location based on the file name
 * @param fileName The name of the file to format
 * @returns The formatted document path
 */
export const formatDocumentLocation = (fileName: string): string => {
  // Normalize the filename - remove any path prefix if present
  const normalizedFileName = fileName.split(/[\/\\]/).pop() || fileName;
  
  // Remove "01 Knowledge Store-" prefix if it exists in the filename
  const cleanedFileName = normalizedFileName.replace(/^01 Knowledge Store-/, "");
  
  // Extract base name without extension
  const fileNameWithoutExtension = cleanedFileName.replace(/\.[^/.]+$/, "");
  
  // Some logging to debug the file path creation
  const documentPath = `${DEFAULT_DOCUMENT_LOCATION}/${fileNameWithoutExtension}.pdf`;
  console.log("Formatted document path:", documentPath);
  
  // Format as required for the API
  return documentPath;
};

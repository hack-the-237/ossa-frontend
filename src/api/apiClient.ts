import { toast } from "@/hooks/use-toast";

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.proposalmanagement.com/v1";
const KNOWLEDGE_BASE_API_URL = "https://ossa-knw-466100360461.europe-west1.run.app";

// Get the token from localStorage
const getToken = () => localStorage.getItem("authToken");

// Set the token in localStorage
export const setToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

// Remove the token from localStorage
export const removeToken = () => {
  localStorage.removeItem("authToken");
};

// Helper to build headers with auth token
const getHeaders = (contentType = "application/json") => {
  const headers: Record<string, string> = {
    "Content-Type": contentType,
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Base request function
const request = async <T>(
  endpoint: string,
  method: string,
  data?: any,
  contentType = "application/json",
  options: { timeout?: number } = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getHeaders(contentType);

  // Use AbortController for timeout control
  const controller = new AbortController();
  // Default timeout 30 seconds, but can be longer for AI operations
  const timeout = options.timeout || 30000;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const config: RequestInit = {
    method,
    headers,
    credentials: "include",
    signal: controller.signal,
    // Add mode for CORS handling
    mode: 'cors'
  };

  if (data) {
    if (contentType === "application/json") {
      config.body = JSON.stringify(data);
    } else if (data instanceof FormData) {
      config.body = data;
      // Let the browser set the content type with boundary
      delete headers["Content-Type"];
    }
  }

  try {
    const response = await fetch(url, config);
    
    // Clear the timeout as request completed
    clearTimeout(timeoutId);

    // If the response is 401 Unauthorized, clear the token and redirect to login
    if (response.status === 401) {
      removeToken();
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw new Error(errorMessage);
    }

    // Handle no-content responses
    if (response.status === 204) {
      return {} as T;
    }

    // Parse JSON response
    const result = await response.json();
    return result as T;
  } catch (error) {
    // Clear the timeout in case of error
    clearTimeout(timeoutId);
    
    // Handle specific abort error (timeout)
    if (error.name === 'AbortError') {
      const timeoutError = new Error(`Request timed out after ${timeout/1000} seconds`);
      toast({
        title: "Request Timeout",
        description: `The operation took too long to complete. Please try again.`,
        variant: "destructive",
      });
      throw timeoutError;
    }
    
    if (error instanceof Error) {
      // Only show toast for network errors, not for already handled errors
      if (error.message !== "Unauthorized") {
        toast({
          title: "Error",
          description: `An error occurred: ${error.message}`,
          variant: "destructive",
        });
      }
      throw error;
    }
    throw new Error("An unknown error occurred");
  }
};

// API Client
export const apiClient = {
  // ... keep existing code (Auth, Proposals, Proposal Sections, Comments, AI Features, etc.)
  
  // Knowledge Base list documents API - ensure consistent implementation
  listKnowledgeBaseDocuments: async <T>(): Promise<T> => {
    try {
      const response = await fetch(`${KNOWLEDGE_BASE_API_URL}/list`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Accept": "application/json"
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Error fetching knowledge base documents:", errorText);
        
        toast({
          title: "Error",
          description: `Failed to fetch knowledge base documents: ${response.status} ${response.statusText}`,
          variant: "destructive",
        });
        
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result as T;
    } catch (error) {
      console.error("Knowledge base API error:", error);
      
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: `Failed to fetch knowledge base documents: ${error.message}`,
          variant: "destructive",
        });
      }
      throw error;
    }
  },

  // Upload document to Knowledge Base
  uploadKnowledgeBaseDocument: async <T>(file: File): Promise<T> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${KNOWLEDGE_BASE_API_URL}/upload`, {
        method: "POST",
        mode: "cors",
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Error uploading document:", errorText);
        
        toast({
          title: "Upload Failed",
          description: `Failed to upload document: ${response.status} ${response.statusText}`,
          variant: "destructive",
        });
        
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result as T;
    } catch (error) {
      console.error("Document upload error:", error);
      
      if (error instanceof Error) {
        toast({
          title: "Upload Failed",
          description: `Failed to upload document: ${error.message}`,
          variant: "destructive",
        });
      }
      throw error;
    }
  }
};

export default apiClient;

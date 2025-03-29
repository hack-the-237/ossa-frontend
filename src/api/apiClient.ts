import { toast } from "@/hooks/use-toast";

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.proposalmanagement.com/v1";

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
  // Auth
  login: <T>(data: { email: string; password: string }) => 
    request<T>("/auth/login", "POST", data),
  
  register: <T>(data: { name: string; email: string; password: string }) => 
    request<T>("/auth/register", "POST", data),
  
  logout: <T>() => 
    request<T>("/auth/logout", "POST"),

  // Proposals
  getProposals: <T>(params?: URLSearchParams) => {
    const queryString = params ? `?${params.toString()}` : "";
    return request<T>(`/proposals${queryString}`, "GET");
  },
  
  getProposal: <T>(id: string) => 
    request<T>(`/proposals/${id}`, "GET"),
  
  createProposal: <T>(data: any) => 
    request<T>("/proposals", "POST", data),
  
  updateProposal: <T>(id: string, data: any) => 
    request<T>(`/proposals/${id}`, "PUT", data),
  
  deleteProposal: <T>(id: string) => 
    request<T>(`/proposals/${id}`, "DELETE"),
  
  // Proposal Sections
  getProposalSections: <T>(id: string) => 
    request<T>(`/proposals/${id}/sections`, "GET"),
  
  // Comments
  getProposalComments: <T>(id: string) => 
    request<T>(`/proposals/${id}/comments`, "GET"),
  
  addProposalComment: <T>(id: string, data: any) => 
    request<T>(`/proposals/${id}/comments`, "POST", data),
  
  // AI Features - extended timeout for AI operations
  generateProposalDraft: <T>(id: string, data: any) => 
    request<T>(`/proposals/${id}/generate-draft`, "POST", data, "application/json", { timeout: 180000 }),
  
  refineProposal: <T>(id: string, data: any) => 
    request<T>(`/proposals/${id}/refine`, "POST", data, "application/json", { timeout: 180000 }),
  
  analyzeRfp: <T>(data: FormData) => 
    request<T>("/rfp/analyze", "POST", data, "multipart/form-data", { timeout: 180000 }),
  
  // Templates
  getProposalTemplates: <T>() => 
    request<T>("/templates/proposal", "GET"),
  
  getSummaryTemplates: <T>() => 
    request<T>("/templates/summary", "GET"),
    
  // Knowledge Base
  getKnowledgeDocuments: <T>(params?: URLSearchParams) => {
    const queryString = params ? `?${params.toString()}` : "";
    return request<T>(`/knowledge-base${queryString}`, "GET");
  },
  
  getKnowledgeDocument: <T>(id: string) => 
    request<T>(`/knowledge-base/${id}`, "GET"),
  
  createKnowledgeDocument: <T>(data: any) => 
    request<T>("/knowledge-base", "POST", data),
  
  updateKnowledgeDocument: <T>(id: string, data: any) => 
    request<T>(`/knowledge-base/${id}`, "PUT", data),
  
  deleteKnowledgeDocument: <T>(id: string) => 
    request<T>(`/knowledge-base/${id}`, "DELETE"),
  
  getKnowledgeCategories: <T>() => 
    request<T>("/knowledge-base/categories", "GET"),
  
  // AI Knowledge Base query - extended timeout
  queryKnowledgeBase: <T>(data: { query: string }) => 
    request<T>("/knowledge-base/query", "POST", data, "application/json", { timeout: 180000 }),
  
  // Documents
  getDocuments: <T>(params?: URLSearchParams) => {
    const queryString = params ? `?${params.toString()}` : "";
    return request<T>(`/documents${queryString}`, "GET");
  },
  
  getDocument: <T>(id: string) => 
    request<T>(`/documents/${id}`, "GET"),
  
  uploadDocument: <T>(data: FormData) => 
    request<T>("/documents", "POST", data, "multipart/form-data"),
  
  updateDocument: <T>(id: string, data: any) => 
    request<T>(`/documents/${id}`, "PUT", data),
  
  deleteDocument: <T>(id: string) => 
    request<T>(`/documents/${id}`, "DELETE"),
  
  downloadDocument: <T>(id: string) => 
    request<T>(`/documents/${id}/download`, "GET"),
  
  // Dashboard
  getDashboardStats: <T>() => 
    request<T>("/dashboard/stats", "GET"),
  
  getRecentProposals: <T>(limit = 5) => 
    request<T>(`/dashboard/proposals/recent?limit=${limit}`, "GET"),
  
  getUpcomingProposalDeadlines: <T>(days = 7, limit = 5) => 
    request<T>(`/dashboard/proposals/upcoming?days=${days}&limit=${limit}`, "GET"),
  
  getUserActivity: <T>(limit = 10) => 
    request<T>(`/dashboard/activity?limit=${limit}`, "GET"),
};

export default apiClient;


/**
 * Format raw API response into the expected structure for the UI
 * @param apiResponse The raw response from the API
 * @returns The formatted response for UI consumption
 */
export const formatRfpSummary = (apiResponse: any): any => {
  console.log("Formatting API response for UI:", apiResponse);
  
  try {
    // Extract project information
    const projectTitle = apiResponse["Project Title"] || "No title available";
    const projectOverview = apiResponse["Project Overview"] || "No overview available";
    
    // Extract key requirements - handle both string and array formats
   /* let keyRequirements = apiResponse["Key Requirements"] || [];
    // If key requirements is a string, try to split it into an array
    if (typeof keyRequirements === 'string') {
      keyRequirements = keyRequirements.split(/\n|•/).filter(item => item.trim().length > 0);
    }*/
    const requestor = apiResponse["Requestor"] || "Not specified";
    const deadline = apiResponse["Deadline"] || "Not specified";
    const scopeOfWork = apiResponse["Scope of Work"] || [];
    const deliverables = apiResponse["Deliverables"] || [];
    const technicalRequirements = apiResponse["Technical Requirements"] || [];
    const clarifyingQuestions = apiResponse["Clarifying Questions"] || [];
    const keywords = apiResponse["Keywords"] || [];
    
    // Extract contact information - could be string or object
    const contactInfo = apiResponse["Contact Information"] || "";
    
    // Structure contact info appropriately based on its type
    let contactInfoObj = {};
    if (typeof contactInfo === 'string') {
      // Try to parse various formats of contact information
      const contactParts = contactInfo.split(/,\s*/);
      if (contactParts.length > 1) {
        contactParts.forEach(part => {
          const [key, value] = part.split(/:\s*/);
          if (key && value) {
            contactInfoObj[key.trim()] = value.trim();
          } else {
            contactInfoObj["Contact"] = part.trim();
          }
        });
      } else {
        contactInfoObj["Contact Information"] = contactInfo;
      }
    } else if (typeof contactInfo === 'object' && contactInfo !== null) {
      contactInfoObj = contactInfo;
    }
    
    // Extract budget - store as raw string, don't try to parse as JSON
    const budget = apiResponse["Budget"] || "No budget information available";
    
    // Extract timeline - could be string or object
    const timeline = apiResponse["Timeline"] || "No timeline information available";
    
    // Handle timeline based on its type
    let timelineObj = {};
    if (typeof timeline === 'string') {
      // Check if timeline has comma-separated parts
      const timelineParts = timeline.split(/,\s*/);
      if (timelineParts.length > 1) {
        timelineParts.forEach(part => {
          const [key, value] = part.split(/:\s*/);
          if (key && value) {
            timelineObj[key.trim()] = value.trim();
          } else {
            timelineObj["Timeline"] = part.trim();
          }
        });
      } else {
        timelineObj["Timeline"] = timeline;
      }
    } else if (typeof timeline === 'object' && timeline !== null) {
      timelineObj = timeline;
    }
    
    // Structure for UI consumption - store objects/arrays as objects/arrays, not as JSON strings
    const formattedData = {
      rfpSummary: {
        "Project Title": projectTitle,
        "Project Overview": projectOverview,
        "Requestor": requestor,
        "Deadline": deadline,
        "Contact": apiResponse["Contact Information"] || ""
      },
      keyRequirements: scopeOfWork,
      evaluationCriteria: { "Contact Information": contactInfo },
      budget: budget,
      timeline: { "Timeline": timeline },
      technicalRequirements: technicalRequirements,
      deliverables: deliverables,
      clarifyingQuestions: clarifyingQuestions,
      keywords: keywords
    };
    
    console.log("Formatted data for UI:", formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error formatting API response:", error);
    
    // Fallback formatting for unexpected response structure
    return {
      rfpSummary: {
        "Project Title": apiResponse["Project Title"] || "N/A",
        "Project Overview": apiResponse["Project Overview"] || "No overview available",
        "Requestor": apiResponse["Requestor"] || "Not specified",
        "Deadline": apiResponse["Deadline"] || "Not specified",
        "Contact": apiResponse["Contact Information"] || "",
        "Budget": apiResponse["Budget"] || "No budget information available",
      },
      keyRequirements: Array.isArray(apiResponse["Scope of Work"]) 
        ? apiResponse["Scope of Work"] 
        : [apiResponse["Scope of Work"] || "No requirements available"],
      evaluationCriteria: {"Contact Information": apiResponse["Contact Information"] || "No contact information available"},
      
      timeline: {"Timeline": apiResponse["Timeline"] || "No timeline information available"},
      technicalRequirements: Array.isArray(apiResponse["Technical Requirements"]) 
        ? apiResponse["Technical Requirements"] 
        : [apiResponse["Technical Requirements"] || "No technical requirements available"],
      deliverables: Array.isArray(apiResponse["Deliverables"]) 
        ? apiResponse["Deliverables"] 
        : [apiResponse["Deliverables"] || "No deliverables available"],
      clarifyingQuestions: Array.isArray(apiResponse["Clarifying Questions"]) 
        ? apiResponse["Clarifying Questions"] 
        : [apiResponse["Clarifying Questions"] || "No clarifying questions available"],
      keywords: Array.isArray(apiResponse["Keywords"]) 
        ? apiResponse["Keywords"] 
        : [apiResponse["Keywords"] || "No keywords available"]
    };
  }
};

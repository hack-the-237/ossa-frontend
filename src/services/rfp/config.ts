// RFP service configuration

// Use environment variable with fallback to the actual API endpoint
export const API_ENDPOINT = import.meta.env.VITE_RFP_API_ENDPOINT || "https://hack237-466100360461.us-central1.run.app";
export const DEFAULT_DOCUMENT_LOCATION = "gs://ossa-hack237/rfp";

// Original API endpoint (used directly now)
export const ORIGINAL_API_ENDPOINT = "https://hack237-466100360461.us-central1.run.app";

// Set to false to prevent the use of mock data when API fails
export const USE_MOCK_DATA = false;

// Mock RFP response data for development
export const MOCK_RFP_RESPONSE = {
  "Project Title": "Management Consulting A Africa Network Connectivity",
  "Project Overview": "Management Consulting A is seeking to modernize its network infrastructure across Africa to support its cloud-based strategy and improve customer experience. This involves procuring reliable, scalable, sustainable, and cost-effective internet connectivity for its data center and 33 offices across 15 African countries, supporting approximately 9000 users. The current infrastructure utilizes a self-managed SD-WAN.",
  "Key Requirements": [
    "Provisioning of internet connectivity to the Data Center and 33 offices in 15 African countries.",
    "Self-managed SD-WAN Service Portfolio, transport-independent, using a blend of multiple access technologies (Fibre preferred).",
    "Cisco Provider Edge router with 4 x Ethernet ports and 4 x Static Routable IP addresses.",
    "Comprehensive overview of SIP and PSTN service availability for Cisco Webex Calling and Microsoft Teams voice services.",
    "Service Level Agreement (SLA) with uptime guarantees."
  ],
  "Budget": "Non-binding indicative pricing (minimum 90% accuracy) is requested for two options: Option A (provider supplies both Connectivity A and B) and Option B (provider supplies only Connectivity A or B).",
  "Timeline": {
    "RFP Responses Due": "07 March 2023", 
    "Implementation to commence": "April 2023"
  },
  "Contact Information": {
    "Primary Contact": "JanineA@managementconsultingA.com", 
    "Procurement": "Janine A"
  }
};

// Add more realistic alternative mock responses to simulate different RFPs
export const ALTERNATIVE_MOCK_RESPONSES = [
  {
    "Project Title": "Powertel Communications Transformer Anti-Intrusion System",
    "Project Overview": "Powertel Communications is seeking proposals for the supply, installation, and commissioning of Transformer Anti-Intrusion and Monitoring end devices using LoRaWAN technology. The project aims to enhance the security and operational efficiency of distribution transformers.",
    "Key Requirements": [
      "LoRaWAN compliant devices",
      "Monitoring of parameters like temperature, humidity, oil level, power consumption",
      "Compatibility with existing monitoring platforms",
      "Long battery life (2+ years)",
      "High MTBF (30+ years)",
      "IP65 rated and water-resistant",
      "24/7 online support"
    ],
    "Budget": "Bids to be priced in United States Dollars. Payment to Local suppliers in local currency at the prevailing interbank rate.",
    "Timeline": {
      "Closing Date": "14 March 2024",
      "Pre-bid Meeting": "7 March 2024",
      "Deployment": "Within 3 months for 2000 sites"
    },
    "Contact Information": {
      "Primary Contact": "procurement@powertel.co.zw",
      "Procurement": "Procurement Manager"
    }
  },
  {
    "Project Title": "Global Financial Services IT Infrastructure Upgrade",
    "Project Overview": "Global Financial Services is looking to upgrade its entire IT infrastructure to support digital transformation initiatives and enhance cybersecurity posture across its 50 locations worldwide.",
    "Key Requirements": [
      "Software-defined networking implementation",
      "Zero-trust security architecture",
      "Cloud migration of legacy systems",
      "24/7 managed security services",
      "Compliance with GDPR, PCI-DSS, and SOX",
      "Disaster recovery with RPO < 15 minutes, RTO < 4 hours"
    ],
    "Budget": "Total project budget not to exceed $15M USD over 3 years, with detailed ROI expectations for each component.",
    "Timeline": {
      "RFP Responses Due": "30 April 2024",
      "Vendor Selection": "31 May 2024",
      "Project Kickoff": "1 July 2024",
      "Phase 1 Completion": "31 December 2024"
    },
    "Contact Information": {
      "Primary Contact": "procurement@globalfinancial.com",
      "Technical Contact": "cto@globalfinancial.com"
    }
  }
];

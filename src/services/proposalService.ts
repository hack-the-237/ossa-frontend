
import { Proposal } from "@/components/proposal/ProposalTypes";

export const getProposalById = (id: string): Proposal => {
  // This would typically fetch from an API
  return {
    id: "1",
    title: "Enterprise Network Infrastructure Modernization",
    client: "Global Financial Technologies Inc.",
    status: "review",
    submissionDate: "2023-05-15",
    sections: [
      {
        id: "executive-summary",
        title: "Executive Summary",
        content: `
          Thank you for the opportunity to submit our proposal for your Enterprise Network Infrastructure Modernization project. 
          Global Financial Technologies Inc. is facing increasing demands on network infrastructure due to rapid growth, 
          new digital services, and remote work requirements.
          
          Our solution offers a comprehensive approach to modernize your network infrastructure while ensuring 
          minimal disruption to your operations. We propose a phased implementation strategy that will:
          
          1. Upgrade core network components to increase capacity and throughput
          2. Implement software-defined networking to enhance flexibility and management
          3. Strengthen security posture through advanced threat protection
          4. Optimize WAN connectivity for improved branch and remote user performance
          
          With over 15 years of experience implementing similar solutions for financial institutions, 
          our team is uniquely positioned to deliver this project on time and within budget.
        `,
      },
      {
        id: "company-background",
        title: "Company Background",
        content: `
          Founded in 2005, our company has established itself as a leader in enterprise networking solutions with 
          specialized expertise in the financial services sector. We maintain the highest level industry certifications 
          and have been recognized as a Gartner Magic Quadrant leader for the past 5 consecutive years.
          
          Our team of over 200 skilled engineers and consultants has implemented network infrastructure solutions for 
          5 of the top 10 banks in North America. We bring deep knowledge of the regulatory requirements and security 
          considerations unique to financial institutions.
          
          Key differentiators:
          • Dedicated financial services practice with compliance specialists
          • 24/7/365 support operations with guaranteed response times
          • Proprietary network management tools developed specifically for high-security environments
          • Strategic partnerships with major hardware and software vendors
        `,
      },
      {
        id: "solution-approach",
        title: "Solution Approach & Methodology",
        content: `
          Our approach to the Enterprise Network Infrastructure Modernization project follows our proven methodology:
          
          Phase 1: Assessment & Design (Weeks 1-4)
          • Comprehensive assessment of current infrastructure
          • Requirements gathering and stakeholder interviews
          • Gap analysis and documentation review
          • Architecture design and technology selection
          • Detailed implementation planning
          
          Phase 2: Core Infrastructure Implementation (Weeks 5-12)
          • Staging and pre-configuration in our test environment
          • Phased deployment of core network components
          • Implementation of software-defined networking
          • Integration with existing systems
          • Initial testing and validation
          
          Phase 3: Security Enhancement (Weeks 13-18)
          • Implementation of next-generation firewalls
          • Zero-trust network access deployment
          • Security monitoring and logging systems
          • Threat intelligence integration
          • Compliance validation
          
          Phase 4: WAN Optimization & Remote Access (Weeks 19-24)
          • SD-WAN implementation for branch locations
          • Remote access solution upgrades
          • Performance optimization
          • Monitoring and management system deployment
          
          Phase 5: Testing & Transition (Weeks 25-30)
          • Comprehensive testing of all components
          • Performance validation
          • Knowledge transfer and documentation
          • Operational handover and support transition
          
          Throughout the project, we'll employ an Agile project management approach with bi-weekly sprint reviews 
          and continuous stakeholder engagement to ensure alignment with your priorities and requirements.
        `,
      },
      {
        id: "pricing",
        title: "Pricing & Commercial Terms",
        content: `
          Our comprehensive pricing for this project is $1,875,000 USD, broken down as follows:
          
          Hardware and Software: $950,000
          • Core network equipment (routers, switches): $420,000
          • Security solutions (firewalls, access control): $275,000
          • SD-WAN and remote access infrastructure: $180,000
          • Software licensing and subscriptions: $75,000
          
          Professional Services: $725,000
          • Assessment and design: $120,000
          • Implementation and configuration: $385,000
          • Testing and validation: $95,000
          • Project management: $125,000
          
          Support and Maintenance (Year 1): $200,000
          • 24/7 technical support
          • Quarterly health checks
          • Software updates and patches
          • Proactive monitoring
          
          Payment Schedule:
          • 30% upon project initiation
          • 30% upon completion of Phase 2
          • 30% upon completion of Phase 4
          • 10% upon final acceptance
          
          This proposal is valid for 60 days from submission. Extended support and maintenance options 
          are available for years 2-5 at preferred rates if included in the initial agreement.
        `,
      },
    ],
    comments: [
      {
        id: "1",
        section: "executive-summary",
        user: {
          name: "Mike Johnson",
          avatar: "",
          initials: "MJ",
        },
        timestamp: "2023-05-16T14:30:00Z",
        content:
          "The executive summary is strong, but we should highlight our experience with similar financial institutions more prominently.",
        resolved: false,
      },
      {
        id: "2",
        section: "pricing",
        user: {
          name: "Sarah Chen",
          avatar: "",
          initials: "SC",
        },
        timestamp: "2023-05-16T16:45:00Z",
        content:
          "I think our pricing is slightly higher than the client's budget. Can we provide some optional components or phasing to give them flexibility?",
        resolved: true,
      },
      {
        id: "3",
        section: "solution-approach",
        user: {
          name: "David Miller",
          avatar: "",
          initials: "DM",
        },
        timestamp: "2023-05-17T09:15:00Z",
        content:
          "We should add more details about our testing methodology and how we'll ensure minimal disruption during implementation.",
        resolved: false,
      },
    ],
  };
};

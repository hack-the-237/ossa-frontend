import { useState, useEffect } from "react";

interface Section {
  id: string;
  title: string;
  status: string;
  commentCount: number;
}

// Default section order for fallback
const DEFAULT_SECTION_ORDER = [
  "executiveSummary",
  "companyOverview",
  "serviceDescription",
  "deliverySchedule",
  "costSchedule",
  "conclusion"
];

export function useSectionNavigation(
  sections: string[],
  sectionStatuses: Record<string, string>,
  sectionComments: Record<string, any[]>
) {
  const [activeSection, setActiveSection] = useState<string>("");

  // Initialize active section if not set
  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      // Try to find the first section from the default order if it exists
      const firstDefaultSection = DEFAULT_SECTION_ORDER.find(section => 
        sections.includes(section)
      );
      
      if (firstDefaultSection) {
        setActiveSection(firstDefaultSection);
      } else {
        // Fallback to the first available section
        const topLevelSections = sections.filter(section => !section.includes('_'));
        if (topLevelSections.length > 0) {
          setActiveSection(topLevelSections[0]);
        } else {
          setActiveSection(sections[0]);
        }
      }
    }
  }, [sections, activeSection]);

  // Map section IDs to titles for display
  const getSectionTitle = (sectionId: string) => {
    // Convert camelCase to Title Case with spaces
    return sectionId
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' '); // Also replace underscores with spaces
  };

  // Filter top-level sections (exclude subsections)
  const getTopLevelSections = (allSections: string[]) => {
    // We consider subsections as keys containing underscores
    return allSections.filter(section => !section.includes('_'));
  };

  // Get subsections for a specific section
  const getSubsections = (parentSection: string) => {
    return sections.filter(section => 
      section.startsWith(`${parentSection}_`) && section !== parentSection
    );
  };

  // Get sections for navigation - preserve the original order from API response
  const getNavigationSections = () => {
    // Only use top-level sections for navigation
    const topLevelSections = getTopLevelSections(sections);
    
    return topLevelSections.map(sectionKey => ({
      id: sectionKey,
      title: getSectionTitle(sectionKey),
      status: sectionStatuses[sectionKey] || 'pending',
      commentCount: (sectionComments[sectionKey] || []).filter(c => !c.resolved).length || 0
    }));
  };

  // Sort sections according to DEFAULT_SECTION_ORDER if possible, otherwise keep original order
  const sortSections = (sectionsToSort: string[]) => {
    // Create a map of section to its position in DEFAULT_SECTION_ORDER
    const orderMap: Record<string, number> = {};
    DEFAULT_SECTION_ORDER.forEach((section, index) => {
      orderMap[section] = index;
    });
    
    // Sort sections based on their position in DEFAULT_SECTION_ORDER
    return [...sectionsToSort].sort((a, b) => {
      const aOrder = orderMap[a] !== undefined ? orderMap[a] : Number.MAX_SAFE_INTEGER;
      const bOrder = orderMap[b] !== undefined ? orderMap[b] : Number.MAX_SAFE_INTEGER;
      
      if (aOrder === Number.MAX_SAFE_INTEGER && bOrder === Number.MAX_SAFE_INTEGER) {
        // Neither section is in DEFAULT_SECTION_ORDER, keep original order
        return sectionsToSort.indexOf(a) - sectionsToSort.indexOf(b);
      }
      
      return aOrder - bOrder;
    });
  };

  return {
    activeSection,
    setActiveSection,
    getSectionTitle,
    getNavigationSections,
    getSubsections,
    getTopLevelSections,
    sortSections
  };
}

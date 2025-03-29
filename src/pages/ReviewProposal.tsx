
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import ProposalHeader from "@/components/proposal/ProposalHeader";
import ProposalContentSection from "@/components/proposal/ProposalContentSection";
import ProposalNavigation from "@/components/proposal/ProposalNavigation";
import SectionComments from "@/components/proposal/SectionComments";
import { Comment } from "@/components/proposal/SectionComments";
import { getProposalById } from "@/services/proposalService";

const ReviewProposal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const proposal = getProposalById(id || "1");
  
  const [activeSection, setActiveSection] = useState(proposal.sections[0].id);
  const [comments, setComments] = useState<Comment[]>(proposal.comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    user: comment.user,
    timestamp: comment.timestamp,
    resolved: comment.resolved,
    section: comment.section
  })));

  const currentSection = proposal.sections.find(
    (section) => section.id === activeSection
  );

  const sectionComments = comments.filter(
    (comment) => comment.section === activeSection
  );

  const handleAddComment = (sectionId: string, content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content,
      user: {
        name: "You",
        avatar: "",
        initials: "YO",
      },
      timestamp: new Date().toISOString(),
      resolved: false,
      section: sectionId
    };

    setComments([...comments, newComment]);
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the proposal review.",
    });
  };

  const toggleCommentResolution = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, resolved: !comment.resolved }
          : comment
      )
    );
  };

  const handleSubmitReview = () => {
    toast({
      title: "Review Submitted",
      description: "The proposal review has been submitted successfully.",
    });
    navigate("/proposals");
  };

  const handleSectionStatusChange = (value: string) => {
    toast({
      title: "Section Status Updated",
      description: `This section is now marked as ${value}.`,
    });
  };

  const navigationSections = proposal.sections.map((section) => {
    const sectionCommentCount = comments.filter(
      (c) => c.section === section.id && !c.resolved
    ).length;
    
    return {
      id: section.id,
      title: section.title,
      commentCount: sectionCommentCount
    };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <ProposalHeader 
        title={proposal.title} 
        client={proposal.client} 
        submissionDate={proposal.submissionDate}
        onSubmitReview={handleSubmitReview}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {currentSection && (
            <ProposalContentSection 
              title={currentSection.title}
              content={currentSection.content}
              onSelectStatus={handleSectionStatusChange}
            />
          )}

          <div className="mt-6">
            <SectionComments
              comments={sectionComments}
              sectionId={activeSection}
              onAddComment={handleAddComment}
              onResolveComment={toggleCommentResolution}
            />
          </div>
        </div>

        <div>
          <ProposalNavigation 
            sections={navigationSections}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            showOverallRating={true}
            onRatingChange={(value) => {
              toast({
                title: "Rating Updated",
                description: `You've rated this proposal as ${value}.`,
              });
            }}
            showDecision={true}
            onDecisionChange={(value) => {
              toast({
                title: "Decision Updated",
                description: `You've selected to ${value} this proposal.`,
              });
            }}
            onComplete={handleSubmitReview}
            completeBtnText="Complete Review"
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewProposal;


import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProposalHeaderProps {
  title: string;
  client: string;
  submissionDate: string;
  onSubmitReview: () => void;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  title,
  client,
  submissionDate,
  onSubmitReview,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleExportPDF = () => {
    toast({
      title: "Export Started",
      description: "Your proposal is being exported to PDF.",
    });
  };

  return (
    <>
      <div className="mb-6">
        <Link to="/proposals">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Proposals
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-start mb-6 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500">
            Client: {client} • Submitted:{" "}
            {formatDate(submissionDate)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={onSubmitReview}>
            <FileText className="h-4 w-4 mr-2" />
            Submit Review
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProposalHeader;

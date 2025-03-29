
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Copy, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface ProposalContentSectionProps {
  title: string;
  content: string;
  onSelectStatus: (value: string) => void;
}

const ProposalContentSection: React.FC<ProposalContentSectionProps> = ({
  title,
  content,
  onSelectStatus,
}) => {
  const handleCopyContent = () => {
    navigator.clipboard.writeText(content || "");
    toast({
      title: "Content Copied",
      description: "The section content has been copied to clipboard.",
    });
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Badge variant="outline" className="bg-brand-100 text-navy-800 px-2 py-1 rounded-sm border border-brand-300">
            In Review
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose max-w-none">
          <p className="whitespace-pre-line">{content}</p>
        </div>
      </CardContent>
      <CardFooter className="border-t flex justify-between py-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Suggest Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyContent}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Text
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select
            defaultValue="approved"
            onValueChange={onSelectStatus}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="needs-revision">
                Needs Revision
              </SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProposalContentSection;

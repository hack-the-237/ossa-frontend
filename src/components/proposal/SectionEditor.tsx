
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import SectionComments from "./SectionComments";
import SectionHeader from "./SectionHeader";

interface SectionEditorProps {
  title: string;
  content: string;
  status: string;
  sectionId: string;
  icon: React.ReactNode;
  statusIcon: React.ReactNode;
  comments: any[];
  onContentChange: (content: string) => void;
  onStatusChange: () => void;
  onDownload: () => void;
  onAddComment: (sectionId: string, content: string) => void;
  onResolveComment: (commentId: string) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  title,
  content,
  status,
  sectionId,
  icon,
  statusIcon,
  comments,
  onContentChange,
  onStatusChange,
  onDownload,
  onAddComment,
  onResolveComment
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <SectionHeader
        title={title}
        status={status}
        icon={icon}
        statusIcon={statusIcon}
        onStatusChange={onStatusChange}
        onDownload={onDownload}
      />
      
      <Textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="min-h-[400px] font-mono text-sm mb-6"
        placeholder={`Enter ${title} content here...`}
      />
      
      <SectionComments 
        comments={comments}
        sectionId={sectionId}
        onAddComment={onAddComment}
        onResolveComment={onResolveComment}
      />
    </div>
  );
};

export default SectionEditor;

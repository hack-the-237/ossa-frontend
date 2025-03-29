
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, MessageSquare, Send, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface Comment {
  id: string;
  content: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  timestamp: string;
  resolved: boolean;
  section?: string; // Make section optional to support different use cases
}

interface SectionCommentsProps {
  comments: Comment[];
  sectionId: string;
  onAddComment: (sectionId: string, content: string) => void;
  onResolveComment?: (commentId: string) => void;
}

const SectionComments: React.FC<SectionCommentsProps> = ({
  comments,
  sectionId,
  onAddComment,
  onResolveComment,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    onAddComment(sectionId, newComment);
    setNewComment("");
    
    toast({
      title: "Comment Added",
      description: "Your comment has been added to this section.",
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center">
        <MessageSquare className="h-4 w-4 mr-2 text-brand-500" />
        Comments on this section
      </h3>
      
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No comments yet. Be the first to add a comment.
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg border ${
                comment.resolved
                  ? "bg-gray-50 border-gray-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-brand-100 text-navy-800">
                      {comment.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.user.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {onResolveComment && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResolveComment(comment.id)}
                  >
                    {comment.resolved ? (
                      <div className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-xs">Resolved</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500">
                        <X className="h-4 w-4 mr-1" />
                        <span className="text-xs">Resolve</span>
                      </div>
                    )}
                  </Button>
                )}
              </div>
              <p
                className={
                  comment.resolved ? "text-gray-500" : "text-gray-800"
                }
              >
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1"
        />
        <Button className="self-end" onClick={handleAddComment}>
          <Send className="h-4 w-4 mr-2" />
          Comment
        </Button>
      </div>
    </div>
  );
};

export default SectionComments;

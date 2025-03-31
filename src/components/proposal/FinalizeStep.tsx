import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FinalizeStepProps {
  finalProposal: string;
  loading: boolean;
  finalizeProposal: () => void;
  documentLocation?: string;
}

const FinalizeStep: React.FC<FinalizeStepProps> = ({ 
  finalProposal, 
  loading, 
  finalizeProposal,
  documentLocation 
}) => {
  const handleDownload = () => {
    const blob = new Blob([finalProposal], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'final_proposal.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Your Proposal is Ready!</h2>
        <p className="text-muted-foreground mb-8">
          Your proposal has been prepared and is ready to be finalized.
        </p>
        
        <div className="flex justify-center space-x-4 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex items-center"
              >
                <Eye className="mr-2 h-5 w-5" />
                Preview Document
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Proposal Preview</DialogTitle>
                <DialogDescription>
                  Preview your proposal before finalizing
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown 
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                    h4: ({ node, ...props }) => <h4 className="text-base font-bold mt-3 mb-2" {...props} />,
                    h5: ({ node, ...props }) => <h5 className="text-sm font-bold mt-3 mb-1" {...props} />,
                    h6: ({ node, ...props }) => <h6 className="text-xs font-bold mt-3 mb-1" {...props} />,
                    p: ({ node, ...props }) => <p className="my-3" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-3" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-3" {...props} />,
                    li: ({ node, ...props }) => <li className="my-1" {...props} />,
                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-3" {...props} />,
                    a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                    code: ({ node, ...props }) => <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props} />,
                    pre: ({ node, ...props }) => <pre className="bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto my-4" {...props} />
                  }}
                >
                  {finalProposal}
                </ReactMarkdown>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            size="lg" 
            onClick={handleDownload}
            className="flex items-center"
          >
            <Download className="mr-2 h-5 w-5" />
            Download as Word
          </Button>
        </div>
        
        <Button 
          onClick={finalizeProposal} 
          disabled={loading}
          size="lg"
          className="w-full max-w-md"
        >
          {loading ? (
            <>
              <span className="mr-2">Generating Final Document</span>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            </>
          ) : (
            'Finalize Proposal'
          )}
        </Button>
      </div>
      
      {documentLocation && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <FileText className="h-4 w-4 mr-2 text-brand-500" />
              Document Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <p className="mb-1"><strong>Source:</strong> {documentLocation}</p>
              <p className="mb-1"><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinalizeStep;

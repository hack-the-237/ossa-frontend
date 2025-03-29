
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';

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
  const handlePreview = () => {
    // Create a preview window with proper markdown rendering
    const previewWindow = window.open();
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Proposal Preview</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0 auto; padding: 2rem; max-width: 800px; }
              h1 { font-size: 2rem; margin-bottom: 1.5rem; }
              h2 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; color: #1a56db; }
              h3 { font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem; }
              p { margin-bottom: 1rem; }
              ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; }
              li { margin-bottom: 0.5rem; }
              pre { background-color: #f7f7f7; padding: 1rem; border-radius: 0.25rem; overflow-x: auto; }
              blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; margin-left: 0; color: #4b5563; }
              table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
              th, td { border: 1px solid #e5e7eb; padding: 0.5rem; text-align: left; }
              th { background-color: #f3f4f6; }
            </style>
          </head>
          <body>
            <h1>Proposal Preview</h1>
            <div id="content"></div>
            <script src="https://unpkg.com/marked/marked.min.js"></script>
            <script>
              document.getElementById('content').innerHTML = marked.parse(${JSON.stringify(finalProposal)});
            </script>
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

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
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handlePreview}
            className="flex items-center"
          >
            <Eye className="mr-2 h-5 w-5" />
            Preview Document
          </Button>
          
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

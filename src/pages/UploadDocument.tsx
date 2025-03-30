import { useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Upload, 
  File, 
  X, 
  AlertCircle, 
  CheckCircle, 
  ChevronLeft,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import apiClient from "@/api/apiClient";

// Response interface for document upload
interface UploadResponse {
  status: string;
  gcs_path: string;
  size: string;
}

// Mock categories
const categories = [
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "product", label: "Product" },
  { value: "engineering", label: "Engineering" },
  { value: "finance", label: "Finance" },
  { value: "legal", label: "Legal" },
  { value: "hr", label: "HR" },
];

const UploadDocument = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    if (!title || !category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Use interval to simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        // Cap at 90% until actual completion
        return prev < 90 ? prev + 5 : prev;
      });
    }, 300);
    
    try {
      // Upload the file to knowledge base
      const response = await apiClient.uploadKnowledgeBaseDocument<UploadResponse>(selectedFile);
      
      // Clear the interval and set progress to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Set upload success and response
      setUploadSuccess(true);
      setUploadResponse(response);
      
      toast({
        title: "Upload Complete",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });
    } catch (error) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
      
      // Error is already handled in the API client
      console.error("Upload failed:", error);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setTitle("");
    setCategory("");
    setDescription("");
    setTags("");
    setUploadSuccess(false);
    setUploadProgress(0);
    setUploadResponse(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/knowledge-base">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Knowledge Base
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Upload Document</CardTitle>
              <CardDescription>
                Add a new document to the knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadSuccess ? (
                <div className="text-center py-8">
                  <div className="bg-green-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Upload Complete!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your document has been uploaded successfully and is now available in the knowledge base.
                  </p>
                  {uploadResponse && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                      <p className="font-medium">Upload Details:</p>
                      <p className="text-sm">Status: {uploadResponse.status}</p>
                      <p className="text-sm">Location: {uploadResponse.gcs_path}</p>
                      <p className="text-sm">Size: {uploadResponse.size}</p>
                    </div>
                  )}
                  <div className="flex justify-center space-x-4">
                    <Button onClick={resetForm} variant="outline">
                      Upload Another
                    </Button>
                    <Link to="/knowledge-base">
                      <Button>View Knowledge Base</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    {!selectedFile ? (
                      <div className="py-4">
                        <Upload className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          Drag and drop your file here
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Supports PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX files up to 50MB
                        </p>
                        <Button asChild variant="outline">
                          <label>
                            Browse Files
                            <input
                              type="file"
                              className="hidden"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                            />
                          </label>
                        </Button>
                      </div>
                    ) : (
                      <div className="py-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                          <div className="flex items-center">
                            <File className="h-8 w-8 text-blue-500 mr-3" />
                            <div>
                              <p className="font-medium">{selectedFile.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRemoveFile}
                            disabled={isUploading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {isUploading && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          onClick={handleRemoveFile}
                          disabled={isUploading}
                        >
                          Change File
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium">
                        Document Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter document title"
                        className="mt-1"
                        required
                        disabled={isUploading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={category}
                        onValueChange={setCategory}
                        disabled={isUploading}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a brief description of the document"
                        className="mt-1"
                        rows={4}
                        disabled={isUploading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags" className="text-sm font-medium">
                        Tags
                      </Label>
                      <Input
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Enter tags separated by commas"
                        className="mt-1"
                        disabled={isUploading}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Tags help make your document more discoverable
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
            {!uploadSuccess && (
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/knowledge-base")}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isUploading || !selectedFile || !title || !category}
                >
                  {isUploading ? "Uploading..." : "Upload Document"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  Documents are automatically indexed for search after upload.
                </p>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  Adding detailed descriptions and tags will help others find your document more easily.
                </p>
              </div>
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  Large files might take longer to upload. Please be patient.
                </p>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Privacy Notice</AlertTitle>
            <AlertDescription>
              Please ensure that documents you upload do not contain sensitive customer data or personally identifiable information (PII).
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <File className="h-8 w-8 text-red-500 p-1 bg-red-50 rounded mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm">Q3 Marketing Report</h3>
                  <p className="text-xs text-muted-foreground">Uploaded 2 days ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <File className="h-8 w-8 text-blue-500 p-1 bg-blue-50 rounded mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm">Product Roadmap</h3>
                  <p className="text-xs text-muted-foreground">Uploaded 5 days ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <File className="h-8 w-8 text-purple-500 p-1 bg-purple-50 rounded mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm">Brand Guidelines</h3>
                  <p className="text-xs text-muted-foreground">Uploaded 1 week ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;

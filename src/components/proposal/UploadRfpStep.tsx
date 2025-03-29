
import React, { useEffect } from "react";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { industries } from "./ProposalConstants";
import { format } from "date-fns";

interface UploadRfpStepProps {
  formData: {
    rfpFile: File | null;
    clientName: string;
    clientIndustry: string;
    dueDate: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateFormData: (updates: Record<string, any>) => void;
}

const UploadRfpStep: React.FC<UploadRfpStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  handleFileUpload,
  updateFormData,
}) => {
  // Set creation date on component mount
  useEffect(() => {
    if (!formData.dueDate) {
      const today = format(new Date(), "yyyy-MM-dd");
      updateFormData({ dueDate: today });
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
        <input
          type="file"
          id="rfpFile"
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx"
        />
        <div className="space-y-3">
          <Upload className="h-10 w-10 mx-auto text-gray-400" />
          <div>
            <h3 className="text-lg font-medium">Upload RFP Document</h3>
            <p className="text-sm text-muted-foreground">
              PDF, DOC, or DOCX files up to 10MB
            </p>
          </div>
          {formData.rfpFile ? (
            <div className="flex items-center justify-center space-x-2 text-sm">
              <FileText className="h-4 w-4 text-brand-500" />
              <span className="font-medium">{formData.rfpFile.name}</span>
              <span className="text-muted-foreground">
                ({Math.round(formData.rfpFile.size / 1024)} KB)
              </span>
            </div>
          ) : (
            <Button
              onClick={() => document.getElementById("rfpFile")?.click()}
              variant="outline"
            >
              Select File
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientName">
              Client Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Enter client organization name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="clientIndustry">Industry</Label>
            <Select
              value={formData.clientIndustry}
              onValueChange={(value) => handleSelectChange("clientIndustry", value)}
            >
              <SelectTrigger id="clientIndustry" className="mt-1">
                <SelectValue placeholder="Select client industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.value} value={industry.value}>
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="dueDate">
            Creation Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className="mt-1"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default UploadRfpStep;

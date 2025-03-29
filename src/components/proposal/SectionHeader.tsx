
import React from "react";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface SectionHeaderProps {
  title: string;
  status: string;
  icon: React.ReactNode;
  onDownload: () => void;
  onStatusChange: () => void;
  statusIcon: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  status,
  icon,
  onDownload,
  onStatusChange,
  statusIcon
}) => {
  // Define status colors based on current status
  const getStatusColor = () => {
    switch(status) {
      case 'completed':
        return "bg-green-100 text-green-800 border-green-300";
      case 'in-progress':
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        {icon}
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge
          className={`px-2 py-1 rounded-sm border ${getStatusColor()}`}
          onClick={onStatusChange}
        >
          <span className="flex items-center">
            {statusIcon}
            <span className="ml-1">
              {status === 'completed' ? 'Completed' : 
                status === 'in-progress' ? 'In Progress' : 'Pending'}
            </span>
          </span>
        </Badge>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default SectionHeader;

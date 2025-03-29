
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface RfpSummaryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  content: string | Record<string, any> | Array<string>;
  isLoading?: boolean;
  className?: string;
}

const RfpSummaryCard: React.FC<RfpSummaryCardProps> = ({
  icon,
  title,
  description,
  content,
  isLoading = false,
  className,
}) => {
  // Log content on mount and when it changes
  useEffect(() => {
    console.log(`RfpSummaryCard ${title} content:`, content);
  }, [content, title]);

  // Function to render different content types
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      );
    }
    
    if (typeof content === 'string') {
      return <pre className="text-sm whitespace-pre-wrap font-sans">{content}</pre>;
    } else if (Array.isArray(content)) {
      return (
        <ul className="list-disc pl-5 space-y-1">
          {content.map((item, index) => (
            <li key={index} className="text-sm">{item}</li>
          ))}
        </ul>
      );
    } else if (typeof content === 'object' && content !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(content).map(([key, value]) => (
            <div key={key} className="mb-2">
              <div className="font-medium text-sm">{key}:</div>
              {typeof value === 'object' && value !== null ? (
                <div className="ml-4">
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <div key={subKey} className="text-sm">
                      <span className="font-medium">{subKey}:</span> {subValue as string}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ml-4 text-sm">{value as string}</div>
              )}
            </div>
          ))}
        </div>
      );
    }
    return <div className="text-red-500">Unable to display content</div>;
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default RfpSummaryCard;

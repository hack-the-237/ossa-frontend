
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Share, 
  Bookmark, 
  ChevronLeft,
  Eye,
  Star,
  Calendar,
  Clock,
  FileText,
  MessageSquare
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock document data
const documentData = {
  id: 1,
  title: "Marketing Strategy 2023",
  category: "Marketing",
  author: "Sarah Johnson",
  thumbnail: "https://via.placeholder.com/800x500",
  dateCreated: "May 12, 2023",
  lastUpdated: "September 15, 2023",
  viewCount: 243,
  size: "2.4 MB",
  type: "PDF",
  description: "Comprehensive marketing strategy including target audience analysis and campaign planning for the upcoming fiscal year.",
  content: `
    <h1>Marketing Strategy 2023</h1>
    <p class="text-muted-foreground">Last updated: September 15, 2023</p>
    
    <h2 class="text-xl font-semibold mt-6 mb-3">Executive Summary</h2>
    <p>This document outlines our comprehensive marketing strategy for the fiscal year 2023, focusing on expanding our market reach, strengthening brand recognition, and increasing customer engagement across all channels.</p>
    
    <h2 class="text-xl font-semibold mt-6 mb-3">Target Audience Analysis</h2>
    <p>Our primary target segments include:</p>
    <ul class="list-disc pl-6 space-y-1 mt-2">
      <li>Enterprise corporations (250+ employees)</li>
      <li>Mid-market businesses (50-249 employees)</li>
      <li>Small businesses with high growth potential</li>
    </ul>
    
    <p class="mt-4">Based on our research, these segments have shown the following characteristics:</p>
    <ul class="list-disc pl-6 space-y-1 mt-2">
      <li>Increasing investment in digital transformation</li>
      <li>Prioritizing efficiency and automation</li>
      <li>Seeking integrated solutions over point products</li>
    </ul>
    
    <h2 class="text-xl font-semibold mt-6 mb-3">Key Marketing Initiatives</h2>
    
    <h3 class="text-lg font-medium mt-4 mb-2">1. Content Marketing</h3>
    <p>Develop thought leadership content that addresses specific pain points of our target segments:</p>
    <ul class="list-disc pl-6 space-y-1 mt-2">
      <li>Industry-specific white papers (quarterly)</li>
      <li>Case studies showcasing ROI (monthly)</li>
      <li>Educational webinars (bi-weekly)</li>
    </ul>
    
    <h3 class="text-lg font-medium mt-4 mb-2">2. Digital Advertising</h3>
    <p>Increase precision in our ad targeting with:</p>
    <ul class="list-disc pl-6 space-y-1 mt-2">
      <li>LinkedIn campaigns targeting decision-makers</li>
      <li>Google Ads with industry-specific keywords</li>
      <li>Retargeting campaigns for website visitors</li>
    </ul>
    
    <h3 class="text-lg font-medium mt-4 mb-2">3. Event Marketing</h3>
    <p>Participate in key industry events:</p>
    <ul class="list-disc pl-6 space-y-1 mt-2">
      <li>SaaS Conference (March 2023)</li>
      <li>Tech Innovation Summit (June 2023)</li>
      <li>Industry Specific Roundtables (quarterly)</li>
    </ul>
    
    <h2 class="text-xl font-semibold mt-6 mb-3">Budget Allocation</h2>
    <p>Our total marketing budget for FY2023 is $1.2M, allocated as follows:</p>
    <ul class="list-disc pl-6 space-y-1 mt-2">
      <li>Content Marketing: 35%</li>
      <li>Digital Advertising: 25%</li>
      <li>Event Marketing: 20%</li>
      <li>PR & Communications: 10%</li>
      <li>Tools & Technology: 5%</li>
      <li>Contingency: 5%</li>
    </ul>
    
    <h2 class="text-xl font-semibold mt-6 mb-3">Key Performance Indicators</h2>
    <p>We will measure success through the following KPIs:</p>
    <ul class="list-disc pl-6 space-y-1 mt-2">
      <li>Marketing Qualified Leads (MQLs): 25% increase YoY</li>
      <li>Sales Qualified Leads (SQLs): 20% increase YoY</li>
      <li>Website Traffic: 30% increase YoY</li>
      <li>Conversion Rate: Improve by 2 percentage points</li>
      <li>Customer Acquisition Cost (CAC): Reduce by 10%</li>
    </ul>
    
    <h2 class="text-xl font-semibold mt-6 mb-3">Timeline and Milestones</h2>
    <p>Q1 (Jan-Mar):</p>
    <ul class="list-disc pl-6 space-y-1 mt-2">
      <li>Launch new product messaging and positioning</li>
      <li>Refresh website with updated value propositions</li>
      <li>Develop Q1-Q2 content calendar</li>
    </ul>
    
    <p class="mt-4">Q2 (Apr-Jun):</p>
    <ul class="list-disc pl-6 space-y-1 mt-2">
      <li>Launch vertical-specific marketing campaigns</li>
      <li>Execute spring event strategy</li>
      <li>Conduct mid-year performance review</li>
    </ul>
    
    <p class="mt-4">Q3 (Jul-Sep):</p>
    <ul class="list-disc pl-6 space-y-1 mt-2">
      <li>Optimize campaigns based on mid-year results</li>
      <li>Execute partner marketing initiatives</li>
      <li>Develop Q3-Q4 content calendar</li>
    </ul>
    
    <p class="mt-4">Q4 (Oct-Dec):</p>
    <ul class="list-disc pl-6 space-y-1 mt-2">
      <li>Execute year-end demand generation push</li>
      <li>Plan holiday customer appreciation campaign</li>
      <li>Begin planning for FY2024</li>
    </ul>
    
    <h2 class="text-xl font-semibold mt-6 mb-3">Conclusion</h2>
    <p>This marketing strategy aims to position our company for sustainable growth by focusing on targeted messaging, valuable content creation, and strategic channel selection. By consistently executing on these initiatives and carefully tracking our performance metrics, we expect to achieve our business objectives for 2023.</p>
  `,
  comments: [
    {
      id: 1,
      author: "John Smith",
      date: "September 18, 2023",
      content: "Great document. I think we should consider adding more information about the competitive landscape in the market analysis section."
    },
    {
      id: 2,
      author: "Emily Wong",
      date: "September 20, 2023",
      content: "The budget allocation looks good, but I wonder if we should allocate a bit more to digital advertising given the trends we're seeing."
    }
  ]
};

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  // In a real app, you would fetch the document based on the ID
  // For now, we'll just use our mock data
  const document = documentData;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/knowledge-base">
          <Button variant="ghost" size="sm" className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Knowledge Base
          </Button>
        </Link>
        <div className="h-6 w-px bg-gray-200 mx-2" />
        <span className="text-sm text-muted-foreground">
          {document.category}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{document.title}</h1>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">Created: {document.dateCreated}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Updated: {document.lastUpdated}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800 mr-2">
                      {document.type}
                    </span>
                    <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800 mr-2">
                      {document.size}
                    </span>
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Eye className="h-3 w-3 mr-1" />
                      {document.viewCount} views
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleFavorite}
                          className={isFavorite ? "text-yellow-500" : ""}
                        >
                          <Star className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Share className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share document</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="preview" className="w-full">
              <div className="px-6 border-b border-gray-100">
                <TabsList className="mt-2">
                  <TabsTrigger value="preview">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="comments">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comments ({document.comments.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="preview" className="m-0">
                <div className="p-6">
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: document.content }}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="comments" className="m-0">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Comments</h2>
                  <div className="space-y-4 mb-6">
                    {document.comments.map((comment) => (
                      <div 
                        key={comment.id} 
                        className="border border-gray-100 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-sm text-muted-foreground">{comment.date}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-md font-medium mb-2">Add a Comment</h3>
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-md mb-2"
                      rows={4}
                      placeholder="Type your comment here..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button className="mt-2">
                      Post Comment
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Document Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground block">Author</span>
                <span className="font-medium">{document.author}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Category</span>
                <span className="font-medium">{document.category}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Date Created</span>
                <span className="font-medium">{document.dateCreated}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Last Updated</span>
                <span className="font-medium">{document.lastUpdated}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Format</span>
                <span className="font-medium">{document.type}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Size</span>
                <span className="font-medium">{document.size}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Related Documents</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <FileText className="h-8 w-8 text-blue-500 p-1 bg-blue-50 rounded mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm">Social Media Guidelines</h3>
                  <p className="text-xs text-muted-foreground">Marketing • May 2023</p>
                </div>
              </div>
              <div className="flex items-start">
                <FileText className="h-8 w-8 text-red-500 p-1 bg-red-50 rounded mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm">Brand Guidelines 2023</h3>
                  <p className="text-xs text-muted-foreground">Marketing • Apr 2023</p>
                </div>
              </div>
              <div className="flex items-start">
                <FileText className="h-8 w-8 text-purple-500 p-1 bg-purple-50 rounded mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm">Q2 Marketing Report</h3>
                  <p className="text-xs text-muted-foreground">Marketing • Jul 2023</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Related
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentView;

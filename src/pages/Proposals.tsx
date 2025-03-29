
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";

// Mock data for proposals
const proposalsData = [
  {
    id: 1,
    title: "Cloud Migration Services",
    client: "Acme Corporation",
    status: "Draft",
    progress: 30,
    dueDate: "Oct 15, 2023",
    lastEdited: "3 days ago",
    tags: ["IT", "Cloud", "Migration"],
  },
  {
    id: 2,
    title: "IT Infrastructure Upgrade",
    client: "TechNova Inc.",
    status: "In Review",
    progress: 85,
    dueDate: "Oct 22, 2023",
    lastEdited: "1 day ago",
    tags: ["Infrastructure", "Hardware", "Network"],
  },
  {
    id: 3,
    title: "Software Development Services",
    client: "GlobalTech",
    status: "Completed",
    progress: 100,
    dueDate: "Sep 30, 2023",
    lastEdited: "1 week ago",
    tags: ["Software", "Development", "Java"],
  },
  {
    id: 4,
    title: "Cybersecurity Assessment",
    client: "SecureBank Ltd.",
    status: "Draft",
    progress: 45,
    dueDate: "Nov 10, 2023",
    lastEdited: "2 days ago",
    tags: ["Security", "Assessment", "Compliance"],
  },
  {
    id: 5,
    title: "Data Analytics Platform",
    client: "DataDriven Co.",
    status: "In Review",
    progress: 70,
    dueDate: "Oct 28, 2023",
    lastEdited: "5 days ago",
    tags: ["Analytics", "Big Data", "BI"],
  },
  {
    id: 6,
    title: "Network Infrastructure Overhaul",
    client: "ConnectCorp",
    status: "Completed",
    progress: 100,
    dueDate: "Sep 15, 2023",
    lastEdited: "2 weeks ago",
    tags: ["Network", "Infrastructure", "Upgrade"],
  },
];

const Proposals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter proposals based on search term and status filter
  const filteredProposals = proposalsData.filter((proposal) => {
    const matchesSearch = 
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "draft" && proposal.status === "Draft") ||
      (statusFilter === "review" && proposal.status === "In Review") ||
      (statusFilter === "completed" && proposal.status === "Completed");
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">RFP Proposals</h1>
          <p className="text-muted-foreground">
            Create and manage your RFP proposal drafts
          </p>
        </div>
        <Link to="/create-proposal">
          <Button className="px-4">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Proposal
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search proposals by title, client or tags..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === "all"
                  ? "All Statuses"
                  : statusFilter === "draft"
                  ? "Drafts"
                  : statusFilter === "review"
                  ? "In Review"
                  : "Completed"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                Drafts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("review")}>
                In Review
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="flex items-center" onClick={() => setStatusFilter("all")}>
            <FileText className="h-4 w-4 mr-2" />
            All Proposals
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center" onClick={() => setStatusFilter("draft")}>
            <Clock className="h-4 w-4 mr-2" />
            Drafts
          </TabsTrigger>
          <TabsTrigger value="review" className="flex items-center" onClick={() => setStatusFilter("review")}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            In Review
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center" onClick={() => setStatusFilter("completed")}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {renderProposalList(filteredProposals)}
        </TabsContent>
        
        <TabsContent value="draft" className="mt-0">
          {renderProposalList(filteredProposals)}
        </TabsContent>
        
        <TabsContent value="review" className="mt-0">
          {renderProposalList(filteredProposals)}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          {renderProposalList(filteredProposals)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const renderProposalList = (proposals: typeof proposalsData) => {
  if (proposals.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
        <div className="bg-gray-100 p-6 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No proposals found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search or filter to find what you're looking for.
        </p>
        <Link to="/create-proposal">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Proposal
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {proposals.map((proposal) => (
        <Card key={proposal.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div
                className={`px-2 py-1 text-xs rounded ${
                  proposal.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : proposal.status === "In Review"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {proposal.status}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardTitle className="text-lg mt-2">{proposal.title}</CardTitle>
            <CardDescription>{proposal.client}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className={`font-medium ${
                    proposal.status === "Completed"
                      ? "text-green-600"
                      : "text-brand-600"
                  }`}>
                    {proposal.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      proposal.status === "Completed"
                        ? "bg-green-500"
                        : "bg-brand-500"
                    }`}
                    style={{ width: `${proposal.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  Due: {proposal.dueDate}
                </div>
                <div className="text-muted-foreground">
                  Edited: {proposal.lastEdited}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {proposal.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-0.5 bg-gray-100 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Link to={`/proposals/${proposal.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                {proposal.status === "Completed" ? "View" : "Continue Editing"}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Proposals;

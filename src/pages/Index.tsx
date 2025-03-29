
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Upload, FileText, Clock, TrendingUp, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const recentDocuments = [
  { id: 1, title: "Marketing Strategy 2023", category: "Marketing", date: "2 days ago" },
  { id: 2, title: "Product Roadmap Q3", category: "Product", date: "1 week ago" },
  { id: 3, title: "Technical Requirements", category: "Engineering", date: "2 weeks ago" },
];

const recentProposals = [
  { id: 1, title: "Cloud Migration Services", status: "Draft", progress: 30 },
  { id: 2, title: "IT Infrastructure Upgrade", status: "In Review", progress: 85 },
  { id: 3, title: "Software Development Services", status: "Completed", progress: 100 },
];

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-brand-50 to-white border-brand-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-brand-500" />
              Knowledge Base
            </CardTitle>
            <CardDescription>Browse company documents</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">142</p>
            <p className="text-sm text-muted-foreground">Total Documents</p>
          </CardContent>
          <CardFooter>
            <Link to="/knowledge-base">
              <Button variant="outline" className="w-full">View Library</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Upload className="h-5 w-5 mr-2 text-blue-500" />
              Document Upload
            </CardTitle>
            <CardDescription>Add new knowledge</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">7</p>
            <p className="text-sm text-muted-foreground">Uploads This Week</p>
          </CardContent>
          <CardFooter>
            <Link to="/upload">
              <Button variant="outline" className="w-full">Upload New</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-500" />
              RFP Proposals
            </CardTitle>
            <CardDescription>Manage proposal drafts</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Active Proposals</p>
          </CardContent>
          <CardFooter>
            <Link to="/proposals">
              <Button variant="outline" className="w-full">Manage Proposals</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-brand-500" />
              Recent Documents
            </CardTitle>
            <CardDescription>
              Recently added or updated knowledge base documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-100">
              {recentDocuments.map((doc) => (
                <li key={doc.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{doc.title}</p>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                        {doc.category}
                      </span>
                      <span className="ml-2">{doc.date}</span>
                    </div>
                  </div>
                  <Link to={`/document/${doc.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Link to="/knowledge-base" className="w-full">
              <Button variant="outline" className="w-full">
                View All Documents
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-brand-500" />
              RFP Proposal Drafts
            </CardTitle>
            <CardDescription>
              Your in-progress and recently completed proposals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-100">
              {recentProposals.map((proposal) => (
                <li key={proposal.id} className="py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{proposal.title}</p>
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
                  <div className="flex justify-end mt-2">
                    <Link to={`/proposals/${proposal.id}`}>
                      <Button variant="ghost" size="sm">
                        Continue
                      </Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <div className="flex w-full space-x-2">
              <Link to="/proposals" className="flex-1">
                <Button variant="outline" className="w-full">
                  View All
                </Button>
              </Link>
              <Link to="/create-proposal" className="flex-1">
                <Button className="w-full">
                  New Proposal
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-brand-500" />
              System Activity
            </CardTitle>
            <CardDescription>
              Knowledge base usage and proposal creation metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Activity chart will be displayed here
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-brand-500" />
              Team Highlights
            </CardTitle>
            <CardDescription>
              Recent team activities and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Marketing team completed Q3 planning</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Sales team won Enterprise client</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Engineering completed API integration</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

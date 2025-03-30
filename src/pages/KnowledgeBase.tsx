import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, FileText, BookOpen, Clock, Calendar, Send, MessageSquare, Bot, X, FileIcon, Download, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Knowledge Base Document interface
interface KnowledgeBaseDocument {
  name: string;
  size: number;
  content_type: string;
  time_created: string;
  updated: string;
}

// Chat message interface
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("newest");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch knowledge base documents
  const { data: knowledgeBaseDocuments, isLoading: isLoadingDocuments, error } = useQuery({
    queryKey: ['knowledgeBaseDocuments'],
    queryFn: () => apiClient.listKnowledgeBaseDocuments<KnowledgeBaseDocument[]>(),
    retry: 2,
    refetchOnWindowFocus: false,
  });

  console.log("Knowledge Base Documents:", knowledgeBaseDocuments);
  console.log("Loading status:", isLoadingDocuments);
  console.log("Error:", error);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get document icon based on content type
  const getDocumentIcon = (contentType: string) => {
    if (contentType.includes("pdf")) {
      return <FileText className="h-10 w-10 text-red-500 p-2 bg-red-50 rounded-md" />;
    } else if (contentType.includes("word") || contentType.includes("doc")) {
      return <FileText className="h-10 w-10 text-blue-500 p-2 bg-blue-50 rounded-md" />;
    } else if (contentType.includes("presentation") || contentType.includes("powerpoint")) {
      return <FileText className="h-10 w-10 text-orange-500 p-2 bg-orange-50 rounded-md" />;
    } else {
      return <FileIcon className="h-10 w-10 text-gray-500 p-2 bg-gray-50 rounded-md" />;
    }
  };

  // Filter documents based on search term
  const filteredDocuments = knowledgeBaseDocuments
    ? knowledgeBaseDocuments.filter((doc) => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // Sort documents
  const sortedDocuments = [...(filteredDocuments || [])].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.updated).getTime() - new Date(a.updated).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.updated).getTime() - new Date(b.updated).getTime();
    } else if (sortBy === "a-z") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  // Handle chat message sending
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    };
    
    setChatMessages([...chatMessages, userMessage]);
    setChatInput("");
    setIsLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      // Mock AI response based on knowledge base documents
      let aiResponse = "I couldn't find specific information about that in the knowledge base.";
      
      const lowercaseInput = chatInput.toLowerCase();
      
      // Try to find relevant document based on query
      const relevantDoc = knowledgeBaseDocuments?.find(doc => 
        doc.name.toLowerCase().includes(lowercaseInput)
      );
      
      if (relevantDoc) {
        aiResponse = `I found a document that might be relevant: "${relevantDoc.name}". It was last updated on ${formatDate(relevantDoc.updated)}.`;
      } else if (lowercaseInput.includes("mtn") || lowercaseInput.includes("proposal")) {
        aiResponse = "I found some MTN-related documents in the knowledge base. Would you like me to provide more information about any specific document?";
      }
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setChatMessages(prevMessages => [...prevMessages, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen && chatMessages.length === 0) {
      // Add a welcome message when opening an empty chat
      setChatMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hello! I'm your knowledge base assistant. Ask me anything about the documents in your knowledge base.",
          timestamp: new Date(),
        }
      ]);
    }
  };

  // Categories derived from documents
  const categories = [
    "All Categories",
    ...Array.from(new Set(knowledgeBaseDocuments?.map(doc => {
      // Extract category from filename
      const parts = doc.name.split('-');
      return parts.length > 1 ? parts[0] : "Other";
    }) || []))
  ];

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Browse and search through all company documents and resources
        </p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search documents..."
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
                {selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={category === selectedCategory}
                  onCheckedChange={() => setSelectedCategory(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={sortBy === "newest"}
                onCheckedChange={() => setSortBy("newest")}
              >
                Newest First
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "oldest"}
                onCheckedChange={() => setSortBy("oldest")}
              >
                Oldest First
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "a-z"}
                onCheckedChange={() => setSortBy("a-z")}
              >
                A-Z
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "z-a"}
                onCheckedChange={() => setSortBy("z-a")}
              >
                Z-A
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            All Documents
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Recently Viewed
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Favorites
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {isLoadingDocuments ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Card key={n} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2 animate-pulse">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-5 w-3/4 bg-gray-200 rounded mt-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded mt-2"></div>
                  </CardHeader>
                  <CardContent className="pb-2 animate-pulse">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                  </CardContent>
                  <CardFooter className="animate-pulse">
                    <div className="h-9 w-full bg-gray-200 rounded"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-100 p-6 rounded-full mb-4 inline-block">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium mb-1">Error loading documents</h3>
              <p className="text-muted-foreground mb-4">
                There was a problem connecting to the knowledge base.
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : sortedDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedDocuments.map((doc) => (
                <Card key={doc.name} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      {getDocumentIcon(doc.content_type)}
                      <div className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                        {doc.content_type.split('/').pop()?.toUpperCase()} • {formatFileSize(doc.size)}
                      </div>
                    </div>
                    <CardTitle className="text-lg font-semibold mt-2 line-clamp-2">
                      {doc.name}
                    </CardTitle>
                    <CardDescription>
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Updated: {formatDate(doc.updated)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600">
                      Created: {formatDate(doc.time_created)}
                    </p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1 flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" className="flex-1 flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Categories");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="mt-0">
          <div className="rounded-lg border border-gray-100 p-8 text-center bg-white">
            <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Recently Viewed Documents</h3>
            <p className="text-muted-foreground mb-6">
              Documents you've viewed recently will appear here for quick access.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-0">
          <div className="rounded-lg border border-gray-100 p-8 text-center bg-white">
            <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Your Favorite Documents</h3>
            <p className="text-muted-foreground mb-6">
              Mark documents as favorites to access them quickly from this tab.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Chat Assistant - Fixed button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      >
        {isChatOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>

      {/* AI Chat Panel */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-[90%] max-w-md h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center">
            <Bot className="h-6 w-6 text-brand-500 mr-2" />
            <div>
              <h3 className="font-medium">Knowledge Base Assistant</h3>
              <p className="text-xs text-muted-foreground">Ask questions about your documents</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto h-8 w-8" 
              onClick={toggleChat}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 block mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[75%]">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <form 
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your documents..."
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!chatInput.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send, 
  MessageSquare, 
  Sparkles, 
  Lightbulb, 
  Copy, 
  ChevronDown
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ChatMessage {
  role: string;
  content: string;
}

interface AiAssistantProps {
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (value: string) => void;
  sendChatMessage: () => void;
  activeSection: string;
  getSectionTitle: (section: string) => string;
  copyToEditor: (content: string) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({
  chatMessages,
  chatInput,
  setChatInput,
  sendChatMessage,
  activeSection,
  getSectionTitle,
  copyToEditor
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const quickSuggestions = [
    "Can you improve the executive summary?",
    "Make the timeline more realistic",
    "Strengthen the cost justification",
    "Add more details about our expertise",
    "Enhance the value proposition",
    "Make the proposal more client-focused",
    "Add case studies or social proof",
  ];
  
  const handleQuickSuggestion = (suggestion: string) => {
    setChatInput(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center p-3 border-b">
          <MessageSquare className="h-4 w-4 text-brand-500 mr-2" />
          <h4 className="text-sm font-medium">AI Assistant</h4>
        </div>
        
        <div className="p-3">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-2 mb-3 max-h-[250px] overflow-y-auto">
            <div className="space-y-2">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg ${
                    msg.role === "assistant"
                      ? "bg-brand-50 border border-brand-100"
                      : "bg-gray-100 border border-gray-200 ml-4"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      <Avatar className="h-5 w-5 mr-1">
                        <AvatarFallback className={msg.role === "assistant" ? "bg-brand-100" : "bg-gray-200"}>
                          {msg.role === "assistant" ? "AI" : "You"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-gray-500">
                        {msg.role === "assistant" ? "Assistant" : "You"}
                      </span>
                    </div>
                    
                    {msg.role === "assistant" && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0"
                        onClick={() => copyToEditor(msg.content)}
                        title="Copy to editor"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
          
          <Collapsible>
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs mb-2"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                {showSuggestions ? 'Hide suggestions' : 'Show suggestions'}
              </Button>
              
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-5 w-5">
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent>
              {showSuggestions && (
                <div className="mb-2 p-2 bg-brand-50 rounded-lg border border-brand-100">
                  <h4 className="text-xs font-medium mb-1 flex items-center">
                    <Lightbulb className="h-3 w-3 text-brand-500 mr-1" />
                    Quick Suggestions
                  </h4>
                  <div className="grid grid-cols-1 gap-1">
                    {quickSuggestions.map((suggestion, idx) => (
                      <Button 
                        key={idx} 
                        variant="outline" 
                        size="sm" 
                        className="justify-start text-left text-xs h-auto py-1"
                        onClick={() => handleQuickSuggestion(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex-1 flex items-center space-x-2">
                <Input
                  placeholder="Ask AI to help improve your proposal..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                  className="text-xs"
                />
                <Button 
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim()}
                  size="sm"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Send
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      
      <div className="bg-brand-50 rounded-lg border border-brand-100 p-3">
        <h4 className="font-medium mb-2 flex items-center text-xs">
          <Sparkles className="h-3 w-3 text-brand-500 mr-1" />
          AI Assistance Tips
        </h4>
        <ul className="text-xs space-y-1">
          <li className="flex items-start">
            <span className="text-brand-500 mr-1">•</span>
            Ask the AI to improve specific sections
          </li>
          <li className="flex items-start">
            <span className="text-brand-500 mr-1">•</span>
            Request industry-specific language
          </li>
          <li className="flex items-start">
            <span className="text-brand-500 mr-1">•</span>
            Ask for more persuasive value propositions
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AiAssistant;


import { useState } from "react";

// Hook to manage the chat functionality for proposal refinement
export const useProposalChat = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([
    {role: "assistant", content: "I'm here to help you refine your proposal. What specific sections would you like to improve?"}
  ]);
  
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    setChatMessages([...chatMessages, {role: "user", content: chatInput}]);
    
    // Clear input
    setChatInput("");
    
    // Simulate AI response with a delay
    setTimeout(() => {
      const responses = [
        "I've improved the executive summary to better highlight your competitive advantages. Would you like me to focus on any other specific sections?",
        "I've adjusted the cost breakdown to fit within the client's budget range. The total is now $720,000 which is within their specified range.",
        "I've enhanced the implementation timeline section to emphasize your efficient delivery methodology. This addresses one of their key evaluation criteria.",
        "I've added more details about your past experience with similar projects. This should help improve your score on the 'Prior experience' evaluation criterion."
      ];
      
      // Add AI response
      setChatMessages(prev => [...prev, {
        role: "assistant", 
        content: responses[Math.floor(Math.random() * responses.length)]
      }]);
    }, 1000);
  };
  
  return {
    chatInput,
    setChatInput,
    chatMessages,
    sendChatMessage
  };
};

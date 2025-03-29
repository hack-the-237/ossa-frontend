
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import KnowledgeBase from "./pages/KnowledgeBase";
import DocumentView from "./pages/DocumentView";
import UploadDocument from "./pages/UploadDocument";
import Proposals from "./pages/Proposals";
import CreateProposal from "./pages/CreateProposal";
import ReviewProposal from "./pages/ReviewProposal";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Routes setup with BrowserRouter outside of the AuthProvider
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/proposals" replace /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/proposals" replace /> : <SignUp />} 
        />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout><Index /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/knowledge-base" element={
          <ProtectedRoute>
            <Layout><KnowledgeBase /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/document/:id" element={
          <ProtectedRoute>
            <Layout><DocumentView /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute>
            <Layout><UploadDocument /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/proposals" element={
          <ProtectedRoute>
            <Layout><Proposals /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/create-proposal" element={
          <ProtectedRoute>
            <Layout><CreateProposal /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/review-proposal/:id" element={
          <ProtectedRoute>
            <Layout><ReviewProposal /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Fallback Routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

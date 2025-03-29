
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { setToken, removeToken } from "@/api/apiClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthResponseType {
  user: User;
  token: string;
  expires_at: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      
      if (token) {
        try {
          // For now, let's assume there's a user in localStorage too
          // In a real app, you would verify the token with your backend
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // If no user found but token exists, log out as it's invalid
            removeToken();
          }
        } catch (error) {
          console.error("Auth check error:", error);
          removeToken();
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate login - in a real app, this would use the apiClient
      // const response = await apiClient.login<AuthResponseType>({ email, password });
      
      // For demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === "demo@example.com" && password === "password") {
        const mockUser = {
          id: "user-1",
          name: "Demo User",
          email: "demo@example.com",
          initials: "DU"
        };
        
        const mockToken = "mock-jwt-token";
        
        // Store user and token
        localStorage.setItem("user", JSON.stringify(mockUser));
        setToken(mockToken);
        setUser(mockUser);
        
        toast({
          title: "Success",
          description: "You have successfully logged in",
        });
        
        navigate("/proposals");
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      let message = "An error occurred during login";
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate registration - in a real app, this would use the apiClient
      // const response = await apiClient.register<AuthResponseType>({ 
      //   name, 
      //   email, 
      //   password 
      // });
      
      // For demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Your account has been created successfully",
      });
      
      navigate("/login");
    } catch (error) {
      let message = "An error occurred during registration";
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // In a real app, you would call apiClient.logout()
    removeToken();
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
